from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import secrets
import jwt
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_hex(32))
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ============ MODELS ============

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    created_at: str
    language: str = "en"

class QuizQuestion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    chapter: int
    question: str
    options: List[str]
    correct_answer: int
    explanation: str = ""

class QuizAnswer(BaseModel):
    question_id: str
    selected_answer: int

class QuizResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    chapter: int
    score: int
    total: int
    percentage: float
    answers: List[dict]
    completed_at: str

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    total_quizzes: int = 0
    total_correct: int = 0
    total_questions: int = 0
    chapters_completed: List[int] = []
    current_week: int = 1
    streak_days: int = 0
    last_activity: str = ""
    flashcards_reviewed: int = 0

class Flashcard(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    chapter: int
    front: str
    back: str
    category: str = ""

class StudyPlanWeek(BaseModel):
    week: int
    title: str
    topics: List[str]
    completed: bool = False

# ============ HELPERS ============

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        return user
    except:
        return None

# ============ AUTH ROUTES ============

@api_router.post("/auth/register")
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": data.email,
        "password": hash_password(data.password),
        "name": data.name,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "language": "en"
    }
    await db.users.insert_one(user)
    
    # Initialize progress
    progress = {
        "user_id": user_id,
        "total_quizzes": 0,
        "total_correct": 0,
        "total_questions": 0,
        "chapters_completed": [],
        "current_week": 1,
        "streak_days": 0,
        "last_activity": datetime.now(timezone.utc).isoformat(),
        "flashcards_reviewed": 0
    }
    await db.progress.insert_one(progress)
    
    token = create_token(user_id)
    return {"token": token, "user": {"id": user_id, "email": data.email, "name": data.name, "language": "en"}}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email, "password": hash_password(data.password)}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"])
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "name": user["name"], "language": user.get("language", "en")}}

@api_router.get("/auth/me")
async def get_me(user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"id": user["id"], "email": user["email"], "name": user["name"], "language": user.get("language", "en")}

@api_router.put("/auth/language")
async def update_language(language: str, user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.users.update_one({"id": user["id"]}, {"$set": {"language": language}})
    return {"success": True, "language": language}

# ============ QUESTIONS DATA ============

QUESTIONS = [
    # Chapter 1: Linux System Foundations
    {"id": "q1", "chapter": 1, "question": "A newly provisioned physical server fails to boot past the BIOS screen. You notice the bootloader menu never appears. Which component is most likely misconfigured?", "options": ["EFI System Partition", "Initramfs image", "Kernel command line", "/etc/fstab entry"], "correct_answer": 0, "explanation": "The EFI System Partition contains the bootloader. If it's misconfigured, the system won't be able to load GRUB or any bootloader."},
    {"id": "q2", "chapter": 1, "question": "While troubleshooting a GRUB2 boot entry, you need to add a kernel parameter to disable SELinux at startup. Which file should you edit?", "options": ["/boot/grub2/grub.cfg", "/etc/default/grub", "/etc/grub.d/40_custom", "/etc/sysconfig/kernel"], "correct_answer": 1, "explanation": "/etc/default/grub is the correct file for persistent GRUB configuration changes."},
    {"id": "q3", "chapter": 1, "question": "A system's initramfs lacks the driver for its storage controller, causing a panic during early boot. Which tool regenerates initramfs with correct modules?", "options": ["mkinitcpio", "depmod", "update-grub", "dracut"], "correct_answer": 3, "explanation": "dracut is the standard tool for regenerating initramfs on RHEL-based systems."},
    {"id": "q4", "chapter": 1, "question": "You need to inspect currently loaded kernel modules and their memory footprint. Which command provides this information?", "options": ["lsmod", "modinfo", "modprobe -l", "insmod"], "correct_answer": 0, "explanation": "lsmod lists all currently loaded kernel modules with their size and dependencies."},
    {"id": "q5", "chapter": 1, "question": "A log indicates a kernel panic due to missing root filesystem. Which boot parameter would correctly identify the root device?", "options": ["fstab=/etc/fstab", "init=/sbin/init", "root=/dev/sda1", "quiet"], "correct_answer": 2, "explanation": "The root= parameter specifies the root filesystem device."},
    {"id": "q6", "chapter": 1, "question": "An administrator must create a logical volume that spans two 1 TB disks. After initializing both disks with pvcreate, which command combines them into a single pool?", "options": ["vgextend", "vgcreate", "pvscan", "lvs"], "correct_answer": 1, "explanation": "vgcreate creates a new volume group from physical volumes."},
    {"id": "q7", "chapter": 1, "question": "During a live migration of a virtual machine, network connectivity drops intermittently. Which virtualization component is most likely involved?", "options": ["QEMU network bridge", "KVM CPU scheduler", "libvirt storage pool", "KVM balloon driver"], "correct_answer": 0, "explanation": "Network issues during VM migration typically involve the QEMU network bridge configuration."},
    {"id": "q8", "chapter": 1, "question": "A newly created logical volume must be formatted with XFS and mounted at /data. What sequence of commands achieves this?", "options": ["mkfs.xfs /dev/vg01/data; mount /data", "mkfs.ext4 /dev/vg01/data; mount /dev/vg01/data /data", "mkfs.xfs /dev/mapper/vg01-data; mount /dev/mapper/vg01-data /data", "mke2fs -t xfs /dev/vg01-data; mount /data"], "correct_answer": 2, "explanation": "The /dev/mapper path is the correct device mapper path for LVM volumes."},
    {"id": "q9", "chapter": 1, "question": "A configuration management script must append 'export JAVA_HOME' to all user shells. Which file is best for a system-wide environment variable?", "options": ["/etc/profile.d/java.sh", "~/.bash_profile", "/etc/environment", "/etc/bashrc"], "correct_answer": 0, "explanation": "/etc/profile.d/ is the recommended location for system-wide shell environment scripts."},
    {"id": "q10", "chapter": 1, "question": "After editing /etc/netplan/01-netcfg.yaml, commands hang with no error. Which step is missing?", "options": ["netplan generate", "netplan apply", "ifup eth0", "systemctl restart networking"], "correct_answer": 1, "explanation": "netplan apply activates the new network configuration."},
    
    # Chapter 2: Services, User Management, Containerization
    {"id": "q11", "chapter": 2, "question": "A development team needs to share files in /opt/shared with specific access requirements. Members of the devteam group require read/write access, while managers group needs read-only access. Which command implements this using ACLs?", "options": ["setfacl -m g:devteam:rw,g:managers:r /opt/shared", "setfacl -m g:devteam:rwx,g:managers:r-x /opt/shared", "chmod g+rw,o+r /opt/shared", "chgrp devteam /opt/shared && chmod 764 /opt/shared"], "correct_answer": 0, "explanation": "setfacl with -m modifies ACLs to set different permissions for different groups."},
    {"id": "q12", "chapter": 2, "question": "After creating a new user account with 'useradd -m alice', the user reports they cannot log in. Which file most likely needs modification?", "options": ["/etc/shadow", "/etc/passwd", "/etc/group", "/etc/login.defs"], "correct_answer": 0, "explanation": "The password needs to be set in /etc/shadow using passwd command."},
    {"id": "q13", "chapter": 2, "question": "A system administrator must ensure all files created in /data/projects inherit the group ownership of the directory. Which permission bit achieves this?", "options": ["Sticky bit (chmod +t)", "SUID bit (chmod +s on user)", "SGID bit (chmod +s on group)", "Execute bit (chmod +x)"], "correct_answer": 2, "explanation": "The SGID bit on a directory causes new files to inherit the directory's group."},
    {"id": "q14", "chapter": 2, "question": "A containerized web application requires persistent storage for uploaded files. Which Podman command creates a named volume and mounts it to /app/uploads?", "options": ["podman run -v uploads:/app/uploads webapp:latest", "podman volume create uploads && podman run --mount source=uploads,target=/app/uploads webapp:latest", "Both A and B", "podman run --tmpfs /app/uploads webapp:latest"], "correct_answer": 2, "explanation": "Both syntaxes are valid for creating and mounting named volumes in Podman."},
    {"id": "q15", "chapter": 2, "question": "Users report slow system performance. Analysis shows process PID 1234 has a nice value of -10. What does this indicate?", "options": ["The process has lower than normal priority", "The process has higher than normal priority", "The process is suspended", "The process has standard priority"], "correct_answer": 1, "explanation": "Negative nice values indicate higher priority. -10 means the process gets more CPU time."},
    {"id": "q16", "chapter": 2, "question": "A service fails to start automatically after system reboot. Which systemctl command configures it for automatic startup?", "options": ["systemctl start servicename", "systemctl enable servicename", "systemctl reload servicename", "systemctl restart servicename"], "correct_answer": 1, "explanation": "systemctl enable creates symlinks to start the service at boot."},
    {"id": "q17", "chapter": 2, "question": "You must remove user account 'tempuser' while preserving their home directory for audit purposes. Which command achieves this?", "options": ["userdel tempuser", "userdel -r tempuser", "userdel --remove-home tempuser", "usermod -L tempuser"], "correct_answer": 0, "explanation": "userdel without -r removes the user but preserves the home directory."},
    {"id": "q18", "chapter": 2, "question": "A Docker container needs to communicate with a database container on the same host. Which networking approach is most appropriate?", "options": ["Host networking mode", "Bridge networking with custom network", "Container networking mode", "Macvlan networking"], "correct_answer": 1, "explanation": "Custom bridge networks allow containers to communicate using container names as DNS."},
    {"id": "q19", "chapter": 2, "question": "An application requires execution with elevated privileges but should not run as root. Which file attribute enables this safely?", "options": ["Setting SUID bit on the executable", "Adding the user to sudo group", "Using capabilities with setcap", "Creating a dedicated service account"], "correct_answer": 2, "explanation": "Linux capabilities provide fine-grained privilege control without full root access."},
    {"id": "q20", "chapter": 2, "question": "Package installation fails with dependency conflicts. Which YUM/DNF option forces installation despite dependency issues?", "options": ["--nodeps", "--force", "--skip-broken", "--override"], "correct_answer": 2, "explanation": "--skip-broken allows installation to continue skipping problematic packages."},
    
    # Chapter 3: Security Hardening
    {"id": "q21", "chapter": 3, "question": "A system administrator needs to configure PAM to require both password and smart card authentication for SSH access. Which PAM control flag ensures both methods must succeed?", "options": ["required", "sufficient", "requisite", "optional"], "correct_answer": 2, "explanation": "requisite means the module must succeed, and failure terminates authentication immediately."},
    {"id": "q22", "chapter": 3, "question": "An organization implements LDAP authentication but users report login failures during network outages. Which PAM module configuration provides offline authentication capability?", "options": ["Configure pam_ldap with caching enabled", "Add pam_unix as a fallback after pam_ldap", "Use pam_sss with SSSD offline authentication", "All of the above"], "correct_answer": 2, "explanation": "SSSD with pam_sss provides robust offline authentication caching."},
    {"id": "q23", "chapter": 3, "question": "An iptables rule needs to block incoming connections except SSH from management network 192.168.100.0/24. Which rule implements this policy?", "options": ["iptables -A INPUT -p tcp --dport 22 -j ACCEPT", "iptables -A INPUT -p tcp --dport 22 -j DROP", "iptables -P INPUT DROP; iptables -A INPUT -s 192.168.100.0/24 -p tcp --dport 22 -j ACCEPT", "iptables -A INPUT -m state --state ESTABLISHED -j ACCEPT"], "correct_answer": 2, "explanation": "Set default policy to DROP, then allow SSH only from the management network."},
    {"id": "q24", "chapter": 3, "question": "A server requires connection rate limiting to prevent brute force attacks. Which iptables module provides this functionality?", "options": ["recent", "limit", "conntrack", "Both A and B"], "correct_answer": 3, "explanation": "Both 'recent' and 'limit' modules can be used for rate limiting in iptables."},
    {"id": "q25", "chapter": 3, "question": "A system requires key-based SSH authentication with password authentication disabled. Which sshd_config settings implement this?", "options": ["PasswordAuthentication no", "PubkeyAuthentication yes", "AuthenticationMethods publickey", "All of the above"], "correct_answer": 3, "explanation": "All three settings together ensure only key-based authentication is allowed."},
    {"id": "q26", "chapter": 3, "question": "Password policy requires 14-character minimum with complexity requirements. Which PAM module configuration enforces this?", "options": ["password requisite pam_pwquality.so minlen=14 ucredit=-1 lcredit=-1 dcredit=-1", "password required pam_cracklib.so minlen=14 difok=3", "password sufficient pam_unix.so minlen=14", "Both A and B"], "correct_answer": 0, "explanation": "pam_pwquality with minlen and credit options enforces password complexity."},
    {"id": "q27", "chapter": 3, "question": "An account requires a restricted shell preventing access to system commands. Which shell provides this functionality?", "options": ["/bin/rbash", "/bin/false", "/sbin/nologin", "/usr/bin/scponly"], "correct_answer": 2, "explanation": "/sbin/nologin prevents login while displaying a message."},
    {"id": "q28", "chapter": 3, "question": "Password aging policy requires users to change passwords every 90 days with 7-day warning. Which command implements this?", "options": ["chage -M 90 -W 7 username", "passwd -x 90 -w 7 username", "Both A and B", "usermod --maxdays 90 --warndays 7 username"], "correct_answer": 2, "explanation": "Both chage and passwd can configure password aging policies."},
    {"id": "q29", "chapter": 3, "question": "SELinux is preventing a web application from accessing database files. Which command identifies the required policy changes?", "options": ["audit2allow -a", "sealert -a /var/log/audit/audit.log", "grep AVC /var/log/audit/audit.log", "All help diagnose SELinux denials"], "correct_answer": 1, "explanation": "sealert provides the most comprehensive analysis of SELinux denials."},
    {"id": "q30", "chapter": 3, "question": "AppArmor profile development requires learning mode to observe application behavior. Which command enables learning mode for a profile?", "options": ["aa-complain /path/to/profile", "aa-enforce /path/to/profile", "aa-audit /path/to/profile", "aa-disable /path/to/profile"], "correct_answer": 0, "explanation": "aa-complain puts a profile in complain (learning) mode."},
    
    # Chapter 4: Automation, Scripting, DevOps
    {"id": "q31", "chapter": 4, "question": "A DevOps team needs to automate the deployment of a web application across multiple servers. Which Ansible approach provides the most scalable solution?", "options": ["Run individual Ansible commands on each server", "Create a playbook with roles for web server configuration", "Use ad-hoc commands with loops", "Write shell scripts that call Ansible modules"], "correct_answer": 1, "explanation": "Ansible playbooks with roles provide the most maintainable and scalable automation."},
    {"id": "q32", "chapter": 4, "question": "Your organization requires Infrastructure as Code for consistent environment provisioning. Which combination provides the most comprehensive solution?", "options": ["Terraform for provisioning, Ansible for configuration", "OpenTofu for provisioning, Puppet for configuration", "CloudFormation for provisioning, Chef for configuration", "All of the above depending on cloud provider"], "correct_answer": 0, "explanation": "Terraform + Ansible is a widely adopted combination for IaC."},
    {"id": "q33", "chapter": 4, "question": "A shell script needs to handle errors gracefully and continue processing other tasks when one fails. Which construct accomplishes this?", "options": ["set -e at the beginning of the script", "Use trap to catch errors and continue", "Implement if-then checks after each command", "Use || true after potentially failing commands"], "correct_answer": 2, "explanation": "if-then checks provide the most control over error handling per command."},
    {"id": "q34", "chapter": 4, "question": "You need to create a Python virtual environment for a system administration project. Which command sequence is correct?", "options": ["python3 -m venv myproject && source myproject/bin/activate", "virtualenv myproject && . myproject/bin/activate", "Both A and B are correct", "pip install venv && venv activate myproject"], "correct_answer": 0, "explanation": "python3 -m venv is the standard way to create virtual environments in Python 3."},
    {"id": "q35", "chapter": 4, "question": "A Git repository has multiple developers working on different features. Which branching strategy best supports continuous integration?", "options": ["GitFlow with feature branches", "GitHub Flow with short-lived branches", "Single branch with frequent commits", "Long-lived feature branches with periodic merges"], "correct_answer": 1, "explanation": "GitHub Flow with short-lived branches supports continuous integration best."},
    {"id": "q36", "chapter": 4, "question": "An Ansible playbook fails intermittently due to timing issues with service startups. Which directive addresses this problem?", "options": ["wait_for module to check service availability", "pause module to add fixed delays", "retries and delay parameters on tasks", "Both A and C provide solutions"], "correct_answer": 3, "explanation": "Both wait_for and retry mechanisms help handle timing issues."},
    {"id": "q37", "chapter": 4, "question": "A Python script needs to parse JSON configuration files and handle missing keys gracefully. Which approach is most robust?", "options": ["Use json.loads() with try-except blocks", "Use json.loads() with get() method on dictionaries", "Validate JSON schema before parsing", "All of the above combined"], "correct_answer": 1, "explanation": "Using dict.get() is the simplest way to handle missing keys gracefully."},
    {"id": "q38", "chapter": 4, "question": "Your CI/CD pipeline needs to run tests, build containers, and deploy to staging automatically. Which tool chain accomplishes this?", "options": ["Jenkins with Docker and Kubernetes plugins", "GitLab CI/CD with integrated container registry", "GitHub Actions with Docker and deployment workflows", "All of the above can accomplish this"], "correct_answer": 3, "explanation": "All major CI/CD platforms can accomplish automated testing and deployment."},
    {"id": "q39", "chapter": 4, "question": "Ansible vault protects sensitive data in playbooks. Which command encrypts an existing variable file?", "options": ["ansible-vault encrypt vars.yml", "ansible-vault create vars.yml", "ansible-vault edit vars.yml", "ansible-playbook --vault-id vars.yml"], "correct_answer": 0, "explanation": "ansible-vault encrypt encrypts an existing file."},
    {"id": "q40", "chapter": 4, "question": "Git merge conflicts occur frequently in a team environment. Which strategy minimizes conflicts?", "options": ["Frequent rebasing of feature branches", "Smaller, more focused commits", "Regular communication about code changes", "All of the above help minimize conflicts"], "correct_answer": 1, "explanation": "Smaller commits are easier to merge and resolve conflicts."},
    
    # Chapter 5: Troubleshooting and Performance
    {"id": "q41", "chapter": 5, "question": "A production web server suddenly becomes unresponsive, and the SLA requires 99.9% uptime. Which monitoring approach provides the fastest incident detection?", "options": ["SNMP-based health checks every 30 seconds", "Synthetic transaction monitoring every 60 seconds", "Application log analysis every 5 minutes", "Manual availability checks every 15 minutes"], "correct_answer": 1, "explanation": "Synthetic monitoring simulates real user transactions for fast detection."},
    {"id": "q42", "chapter": 5, "question": "Users report intermittent database connection failures. The SLI shows 98.5% success rate, but the SLO target is 99.5%. Which diagnostic approach identifies the root cause?", "options": ["Analyze connection timing patterns and error correlation", "Increase connection pool size immediately", "Restart the database service during maintenance window", "Implement connection retry logic in applications"], "correct_answer": 0, "explanation": "Root cause analysis requires examining patterns and correlating errors."},
    {"id": "q43", "chapter": 5, "question": "A Linux server fails to boot after a kernel update, stopping at 'Kernel panic - not syncing'. Which recovery sequence resolves this issue?", "options": ["Boot from rescue media and reinstall the operating system", "Use GRUB rescue mode to boot with the previous kernel", "Perform hardware diagnostics on memory and storage", "Reset BIOS settings to factory defaults"], "correct_answer": 1, "explanation": "GRUB can boot an older kernel version to recover from failed kernel updates."},
    {"id": "q44", "chapter": 5, "question": "Performance monitoring shows average CPU utilization at 45%, but users report slow response times. Which metric provides additional insight?", "options": ["Load average over 1, 5, and 15-minute intervals", "Total number of CPU cores and threads", "CPU cache hit ratio statistics", "Process nice values and priorities"], "correct_answer": 0, "explanation": "Load average shows if the system is overloaded despite moderate CPU usage."},
    {"id": "q45", "chapter": 5, "question": "A filesystem shows read-only status after unexpected shutdown. The command 'mount -o remount,rw /dev/sdb1' fails. Which diagnostic step identifies the problem?", "options": ["Check disk space availability with df -h", "Examine block device errors in system logs", "Verify mount options in /etc/fstab", "Run fsck to detect and repair filesystem corruption"], "correct_answer": 3, "explanation": "fsck checks and repairs filesystem corruption after unexpected shutdowns."},
    {"id": "q46", "chapter": 5, "question": "DNS resolution fails for external domains, but internal DNS works correctly. The command 'dig @8.8.8.8 google.com' times out. Which troubleshooting approach isolates the issue?", "options": ["Restart the local DNS resolver service", "Check firewall rules for outbound DNS traffic on port 53", "Flush the local DNS cache using systemd-resolve", "Verify network interface configuration and routing"], "correct_answer": 1, "explanation": "If external DNS queries timeout, firewall rules may be blocking port 53."},
    {"id": "q47", "chapter": 5, "question": "System memory utilization shows 95% used, but 'free -h' indicates significant cached memory. Which command determines if the system has a memory pressure issue?", "options": ["vmstat 1 10 to monitor memory allocation patterns", "top -o %MEM to identify memory-intensive processes", "swapon -s to check swap space utilization", "All of the above provide complementary memory analysis"], "correct_answer": 3, "explanation": "Multiple tools together provide comprehensive memory analysis."},
    {"id": "q48", "chapter": 5, "question": "A RAID 5 array shows 'degraded' status after a disk failure. One spare disk is available. Which action sequence properly rebuilds the array?", "options": ["The spare disk should automatically begin rebuilding without intervention", "Hot-swap the spare disk using mdadm --replace", "Force array rebuild with mdadm --create --force", "Replace the failed disk physically, then run mdadm --add /dev/md0 /dev/sdX"], "correct_answer": 3, "explanation": "Physical replacement followed by mdadm --add initiates rebuild properly."},
    {"id": "q49", "chapter": 5, "question": "Network performance degrades significantly during peak hours. The iftop command shows high bandwidth utilization. Which approach identifies the traffic sources?", "options": ["Use tcpdump to capture packets for protocol analysis", "Implement QoS rules to prioritize critical traffic", "Monitor per-process network usage with nethogs", "Both A and C provide traffic source identification"], "correct_answer": 3, "explanation": "tcpdump and nethogs help identify which processes generate network traffic."},
    {"id": "q50", "chapter": 5, "question": "A web application returns '502 Bad Gateway' errors intermittently. Application logs show database connection timeouts. Which performance optimization addresses this issue?", "options": ["Increase web server worker processes and connection limits", "Optimize database queries and implement connection pooling", "Add more memory to the database server", "Both A and B address different aspects of the problem"], "correct_answer": 1, "explanation": "Database connection pooling addresses timeout issues directly."},
]

# ============ FLASHCARDS DATA ============

FLASHCARDS = [
    # Chapter 1
    {"id": "f1", "chapter": 1, "front": "What is the EFI System Partition (ESP)?", "back": "A partition on a data storage device used by UEFI firmware to store boot loaders and applications. Typically formatted as FAT32.", "category": "Boot Process"},
    {"id": "f2", "chapter": 1, "front": "What does 'dracut' do?", "back": "dracut regenerates the initramfs (initial RAM filesystem) with the necessary kernel modules and drivers for booting.", "category": "Boot Process"},
    {"id": "f3", "chapter": 1, "front": "What is LVM?", "back": "Logical Volume Manager - allows flexible disk management by abstracting physical storage into logical volumes that can be resized dynamically.", "category": "Storage"},
    {"id": "f4", "chapter": 1, "front": "What is the difference between vgcreate and vgextend?", "back": "vgcreate creates a NEW volume group from physical volumes. vgextend ADDS physical volumes to an EXISTING volume group.", "category": "Storage"},
    {"id": "f5", "chapter": 1, "front": "What is KVM?", "back": "Kernel-based Virtual Machine - a Linux kernel module that turns the kernel into a hypervisor for running virtual machines.", "category": "Virtualization"},
    {"id": "f6", "chapter": 1, "front": "What is the purpose of /etc/fstab?", "back": "Configuration file that defines how disk partitions, filesystems, and remote filesystems should be automatically mounted at boot.", "category": "Filesystems"},
    {"id": "f7", "chapter": 1, "front": "What does 'netplan apply' do?", "back": "Applies network configuration changes defined in YAML files under /etc/netplan/ on Ubuntu systems.", "category": "Networking"},
    {"id": "f8", "chapter": 1, "front": "What is udev?", "back": "The device manager for the Linux kernel that dynamically creates and removes device nodes in /dev/ based on hardware detection.", "category": "System"},
    
    # Chapter 2
    {"id": "f9", "chapter": 2, "front": "What does SGID do on a directory?", "back": "When set on a directory, files created inside inherit the directory's group ownership instead of the creator's primary group.", "category": "Permissions"},
    {"id": "f10", "chapter": 2, "front": "What is the difference between 'systemctl start' and 'systemctl enable'?", "back": "start: Starts the service NOW. enable: Configures the service to start automatically at BOOT.", "category": "Services"},
    {"id": "f11", "chapter": 2, "front": "What are Linux Capabilities?", "back": "Fine-grained privileges that can be assigned to executables instead of full root access (e.g., CAP_NET_BIND_SERVICE for binding to low ports).", "category": "Security"},
    {"id": "f12", "chapter": 2, "front": "What is a nice value?", "back": "A process priority value from -20 (highest priority) to 19 (lowest). Negative values give more CPU time.", "category": "Process Management"},
    {"id": "f13", "chapter": 2, "front": "What is the difference between Docker and Podman?", "back": "Podman is daemonless (no background service), rootless by default, and compatible with Docker CLI commands.", "category": "Containers"},
    {"id": "f14", "chapter": 2, "front": "What does 'setfacl' do?", "back": "Sets Access Control Lists (ACLs) on files/directories, allowing more granular permissions than standard chmod.", "category": "Permissions"},
    
    # Chapter 3
    {"id": "f15", "chapter": 3, "front": "What is PAM?", "back": "Pluggable Authentication Modules - a framework for integrating multiple authentication schemes into Linux.", "category": "Authentication"},
    {"id": "f16", "chapter": 3, "front": "What are the PAM control flags?", "back": "required, requisite, sufficient, optional - they determine how module success/failure affects overall authentication.", "category": "Authentication"},
    {"id": "f17", "chapter": 3, "front": "What is SELinux?", "back": "Security-Enhanced Linux - a MAC (Mandatory Access Control) system that confines processes to minimum required permissions.", "category": "Security"},
    {"id": "f18", "chapter": 3, "front": "What is the difference between iptables and nftables?", "back": "nftables is the modern replacement for iptables with better performance, unified syntax for IPv4/IPv6, and atomic rule updates.", "category": "Firewall"},
    {"id": "f19", "chapter": 3, "front": "What does LUKS provide?", "back": "Linux Unified Key Setup - full disk encryption with multiple key slots, secure key management, and standard format.", "category": "Encryption"},
    {"id": "f20", "chapter": 3, "front": "What is fail2ban?", "back": "Intrusion prevention software that monitors logs and bans IPs showing malicious signs (like repeated failed logins).", "category": "Security"},
    
    # Chapter 4
    {"id": "f21", "chapter": 4, "front": "What is Ansible?", "back": "Agentless IT automation tool that uses SSH to configure systems, deploy software, and orchestrate tasks using YAML playbooks.", "category": "Automation"},
    {"id": "f22", "chapter": 4, "front": "What is Terraform?", "back": "Infrastructure as Code tool for provisioning and managing cloud resources using declarative configuration files.", "category": "IaC"},
    {"id": "f23", "chapter": 4, "front": "What is a Git branch?", "back": "A lightweight pointer to a commit that allows parallel development without affecting the main codebase.", "category": "Version Control"},
    {"id": "f24", "chapter": 4, "front": "What does 'set -e' do in a shell script?", "back": "Causes the script to exit immediately if any command returns a non-zero exit status.", "category": "Scripting"},
    {"id": "f25", "chapter": 4, "front": "What is CI/CD?", "back": "Continuous Integration/Continuous Deployment - automated processes for testing code changes and deploying to production.", "category": "DevOps"},
    
    # Chapter 5
    {"id": "f26", "chapter": 5, "front": "What is load average?", "back": "Average number of processes waiting to run over 1, 5, and 15 minutes. Values higher than CPU cores indicate overload.", "category": "Performance"},
    {"id": "f27", "chapter": 5, "front": "What does 'iostat -x' show?", "back": "Extended I/O statistics including disk utilization, average queue size, and service times per device.", "category": "Performance"},
    {"id": "f28", "chapter": 5, "front": "What is inode exhaustion?", "back": "When a filesystem runs out of inodes (metadata structures), preventing new file creation even with free disk space.", "category": "Troubleshooting"},
    {"id": "f29", "chapter": 5, "front": "What does the 'D' state mean in process status?", "back": "Uninterruptible sleep - usually indicates the process is waiting for I/O (disk/network). Too many D-state processes indicates I/O bottleneck.", "category": "Performance"},
    {"id": "f30", "chapter": 5, "front": "What is fsck?", "back": "File System Consistency Check - repairs filesystem corruption, typically run on unmounted filesystems after crashes.", "category": "Troubleshooting"},
]

# 20-Week Study Plan
STUDY_PLAN = [
    {"week": 1, "title": "Linux Boot Process & GRUB", "topics": ["BIOS/UEFI boot sequence", "GRUB2 configuration", "Boot parameters", "initramfs"]},
    {"week": 2, "title": "Kernel & Modules", "topics": ["Kernel parameters", "Module management (lsmod, modprobe)", "dracut/mkinitcpio", "sysctl"]},
    {"week": 3, "title": "Storage Fundamentals", "topics": ["Partitioning (fdisk, gdisk)", "Filesystems (ext4, XFS, Btrfs)", "Mount options", "fstab"]},
    {"week": 4, "title": "LVM & RAID", "topics": ["Physical/Volume/Logical volumes", "LVM commands", "RAID levels", "mdadm"]},
    {"week": 5, "title": "Networking Basics", "topics": ["IP configuration", "NetworkManager/netplan", "DNS resolution", "Routing"]},
    {"week": 6, "title": "User & Group Management", "topics": ["useradd/usermod/userdel", "Group management", "Password policies", "/etc/passwd, shadow, group"]},
    {"week": 7, "title": "Permissions & ACLs", "topics": ["chmod, chown, chgrp", "SUID/SGID/Sticky bit", "ACLs (setfacl, getfacl)", "umask"]},
    {"week": 8, "title": "Process Management", "topics": ["ps, top, htop", "Nice values & priorities", "Signals", "Background processes"]},
    {"week": 9, "title": "Systemd & Services", "topics": ["Unit files", "systemctl commands", "Targets", "Journald"]},
    {"week": 10, "title": "Containers", "topics": ["Docker basics", "Podman", "Images & volumes", "Networking"]},
    {"week": 11, "title": "PAM & Authentication", "topics": ["PAM configuration", "LDAP/Kerberos basics", "SSSD", "SSH keys"]},
    {"week": 12, "title": "Firewalls", "topics": ["iptables/nftables", "firewalld zones", "UFW", "Port forwarding"]},
    {"week": 13, "title": "SELinux & AppArmor", "topics": ["SELinux modes & contexts", "Boolean values", "AppArmor profiles", "Troubleshooting"]},
    {"week": 14, "title": "Encryption & PKI", "topics": ["LUKS encryption", "GPG", "SSL/TLS certificates", "OpenSSL"]},
    {"week": 15, "title": "Shell Scripting", "topics": ["Variables & loops", "Conditionals", "Functions", "Error handling"]},
    {"week": 16, "title": "Ansible Automation", "topics": ["Playbooks", "Roles", "Variables & templates", "Vault"]},
    {"week": 17, "title": "Git & CI/CD", "topics": ["Git workflows", "Branching strategies", "CI/CD pipelines", "Infrastructure as Code"]},
    {"week": 18, "title": "Performance Monitoring", "topics": ["vmstat, iostat, sar", "CPU & memory analysis", "I/O bottlenecks", "Network performance"]},
    {"week": 19, "title": "Troubleshooting", "topics": ["Boot issues", "Network diagnostics", "Log analysis", "Filesystem recovery"]},
    {"week": 20, "title": "Exam Review & Practice", "topics": ["Full practice tests", "Weak areas review", "Time management", "Exam strategies"]},
]

CHAPTERS = [
    {"id": 1, "title": "Linux System Foundations", "title_de": "Linux-Systemgrundlagen", "description": "Boot process, LVM, RAID, networking, virtualization", "description_de": "Boot-Prozess, LVM, RAID, Netzwerk, Virtualisierung", "questions": 10, "weight": "23%"},
    {"id": 2, "title": "Services & User Management", "title_de": "Dienste & Benutzerverwaltung", "description": "Systemd, users, permissions, containers", "description_de": "Systemd, Benutzer, Berechtigungen, Container", "questions": 10, "weight": "20%"},
    {"id": 3, "title": "Security Hardening", "title_de": "Sicherheitshärtung", "description": "PAM, firewalls, SELinux, encryption", "description_de": "PAM, Firewalls, SELinux, Verschlüsselung", "questions": 10, "weight": "18%"},
    {"id": 4, "title": "Automation & DevOps", "title_de": "Automatisierung & DevOps", "description": "Ansible, scripting, Git, CI/CD", "description_de": "Ansible, Scripting, Git, CI/CD", "questions": 10, "weight": "17%"},
    {"id": 5, "title": "Troubleshooting & Performance", "title_de": "Fehlerbehebung & Leistung", "description": "Monitoring, diagnostics, optimization", "description_de": "Überwachung, Diagnose, Optimierung", "questions": 10, "weight": "22%"},
]

# ============ QUIZ ROUTES ============

@api_router.get("/chapters")
async def get_chapters():
    return CHAPTERS

@api_router.get("/questions/{chapter}")
async def get_questions(chapter: int, limit: int = 10):
    chapter_questions = [q for q in QUESTIONS if q["chapter"] == chapter]
    import random
    random.shuffle(chapter_questions)
    return chapter_questions[:limit]

@api_router.post("/quiz/submit")
async def submit_quiz(chapter: int, answers: List[QuizAnswer], user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    chapter_questions = {q["id"]: q for q in QUESTIONS if q["chapter"] == chapter}
    correct = 0
    results = []
    
    for answer in answers:
        q = chapter_questions.get(answer.question_id)
        if q:
            is_correct = answer.selected_answer == q["correct_answer"]
            if is_correct:
                correct += 1
            results.append({
                "question_id": answer.question_id,
                "selected": answer.selected_answer,
                "correct": q["correct_answer"],
                "is_correct": is_correct,
                "explanation": q["explanation"]
            })
    
    total = len(answers)
    percentage = (correct / total * 100) if total > 0 else 0
    
    quiz_result = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "chapter": chapter,
        "score": correct,
        "total": total,
        "percentage": round(percentage, 1),
        "answers": results,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }
    await db.quiz_results.insert_one(quiz_result)
    
    # Update progress
    await db.progress.update_one(
        {"user_id": user["id"]},
        {
            "$inc": {"total_quizzes": 1, "total_correct": correct, "total_questions": total},
            "$addToSet": {"chapters_completed": chapter} if percentage >= 70 else {},
            "$set": {"last_activity": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    return {"id": quiz_result["id"], "score": correct, "total": total, "percentage": round(percentage, 1), "results": results}

# ============ FLASHCARDS ROUTES ============

@api_router.get("/flashcards/{chapter}")
async def get_flashcards(chapter: int):
    return [f for f in FLASHCARDS if f["chapter"] == chapter]

@api_router.get("/flashcards")
async def get_all_flashcards():
    return FLASHCARDS

@api_router.post("/flashcards/reviewed")
async def mark_flashcard_reviewed(user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.progress.update_one(
        {"user_id": user["id"]},
        {"$inc": {"flashcards_reviewed": 1}, "$set": {"last_activity": datetime.now(timezone.utc).isoformat()}}
    )
    return {"success": True}

# ============ PROGRESS ROUTES ============

@api_router.get("/progress")
async def get_progress(user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    progress = await db.progress.find_one({"user_id": user["id"]}, {"_id": 0})
    if not progress:
        progress = {
            "user_id": user["id"],
            "total_quizzes": 0,
            "total_correct": 0,
            "total_questions": 0,
            "chapters_completed": [],
            "current_week": 1,
            "streak_days": 0,
            "last_activity": "",
            "flashcards_reviewed": 0
        }
    
    # Get quiz history
    quiz_history = await db.quiz_results.find({"user_id": user["id"]}, {"_id": 0}).sort("completed_at", -1).limit(10).to_list(10)
    
    return {**progress, "quiz_history": quiz_history}

@api_router.put("/progress/week")
async def update_week(week: int, user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.progress.update_one({"user_id": user["id"]}, {"$set": {"current_week": week}})
    return {"success": True, "current_week": week}

# ============ STUDY PLAN ROUTES ============

@api_router.get("/studyplan")
async def get_study_plan():
    return STUDY_PLAN

# ============ AI EXPLANATION ROUTES ============

# AI Provider configurations
AI_PROVIDERS = {
    "openai": {
        "name": "OpenAI (GPT)",
        "base_url": "https://api.openai.com/v1",
        "default_model": "gpt-4o",
        "models": ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"]
    },
    "gemini": {
        "name": "Google Gemini",
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai",
        "default_model": "gemini-2.0-flash",
        "models": ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"]
    },
    "anthropic": {
        "name": "Anthropic Claude",
        "base_url": "https://api.anthropic.com/v1",
        "default_model": "claude-3-5-sonnet-20241022",
        "models": ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"]
    },
    "deepseek": {
        "name": "DeepSeek",
        "base_url": "https://api.deepseek.com",
        "default_model": "deepseek-chat",
        "models": ["deepseek-chat", "deepseek-coder"]
    },
    "qwen": {
        "name": "Qwen (Alibaba)",
        "base_url": "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
        "default_model": "qwen-max",
        "models": ["qwen-max", "qwen-plus", "qwen-turbo"]
    },
    "perplexity": {
        "name": "Perplexity",
        "base_url": "https://api.perplexity.ai",
        "default_model": "sonar-pro",
        "models": ["sonar-pro", "sonar"]
    }
}

class AIExplanationRequest(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    user_answer: Optional[int] = None
    provider: str
    api_key: str
    model: Optional[str] = None
    language: str = "en"

class AIExplanationResponse(BaseModel):
    explanation: str
    provider: str
    model: str
    success: bool
    error: Optional[str] = None

@api_router.get("/ai/providers")
async def get_ai_providers():
    """Get list of available AI providers"""
    return [
        {
            "id": provider_id,
            "name": config["name"],
            "models": config["models"],
            "default_model": config["default_model"]
        }
        for provider_id, config in AI_PROVIDERS.items()
    ]

@api_router.post("/ai/explain", response_model=AIExplanationResponse)
async def get_ai_explanation(request: AIExplanationRequest):
    """Get AI-powered explanation for a question"""
    
    if request.provider not in AI_PROVIDERS:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {request.provider}")
    
    provider_config = AI_PROVIDERS[request.provider]
    model = request.model or provider_config["default_model"]
    
    # Build the prompt
    lang_instruction = "Antworte auf Deutsch." if request.language == "de" else "Answer in English."
    
    options_text = "\n".join([f"{chr(65+i)}. {opt}" for i, opt in enumerate(request.options)])
    correct_letter = chr(65 + request.correct_answer)
    
    user_answer_text = ""
    if request.user_answer is not None:
        user_letter = chr(65 + request.user_answer)
        if request.user_answer != request.correct_answer:
            user_answer_text = f"\n\nThe user selected: {user_letter} (incorrect)"
    
    system_prompt = f"""You are a Linux expert helping students prepare for the CompTIA Linux+ XK0-006 exam.
Provide clear, concise explanations for exam questions.
Focus on WHY the correct answer is right and explain the relevant Linux concepts.
{lang_instruction}"""

    user_prompt = f"""Explain this Linux+ exam question:

Question: {request.question}

Options:
{options_text}

Correct Answer: {correct_letter}{user_answer_text}

Provide a clear explanation of why {correct_letter} is correct. Include relevant Linux commands or concepts that help understand the topic."""

    try:
        # Handle Anthropic differently (uses messages API with different format)
        if request.provider == "anthropic":
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{provider_config['base_url']}/messages",
                    headers={
                        "x-api-key": request.api_key,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "max_tokens": 1024,
                        "system": system_prompt,
                        "messages": [{"role": "user", "content": user_prompt}]
                    }
                )
                
                if response.status_code != 200:
                    error_detail = response.text
                    return AIExplanationResponse(
                        explanation="",
                        provider=request.provider,
                        model=model,
                        success=False,
                        error=f"API error ({response.status_code}): {error_detail}"
                    )
                
                data = response.json()
                explanation = data["content"][0]["text"]
                
        else:
            # OpenAI-compatible API (OpenAI, Gemini, DeepSeek, Qwen, Perplexity)
            async with httpx.AsyncClient(timeout=60.0) as client:
                headers = {
                    "Authorization": f"Bearer {request.api_key}",
                    "Content-Type": "application/json"
                }
                
                # Gemini uses different header
                if request.provider == "gemini":
                    headers = {
                        "x-goog-api-key": request.api_key,
                        "Content-Type": "application/json"
                    }
                
                response = await client.post(
                    f"{provider_config['base_url']}/chat/completions",
                    headers=headers,
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "max_tokens": 1024,
                        "temperature": 0.7
                    }
                )
                
                if response.status_code != 200:
                    error_detail = response.text
                    return AIExplanationResponse(
                        explanation="",
                        provider=request.provider,
                        model=model,
                        success=False,
                        error=f"API error ({response.status_code}): {error_detail}"
                    )
                
                data = response.json()
                explanation = data["choices"][0]["message"]["content"]
        
        return AIExplanationResponse(
            explanation=explanation,
            provider=request.provider,
            model=model,
            success=True
        )
        
    except httpx.TimeoutException:
        return AIExplanationResponse(
            explanation="",
            provider=request.provider,
            model=model,
            success=False,
            error="Request timed out. Please try again."
        )
    except Exception as e:
        logger.error(f"AI explanation error: {str(e)}")
        return AIExplanationResponse(
            explanation="",
            provider=request.provider,
            model=model,
            success=False,
            error=str(e)
        )

@api_router.get("/")
async def root():
    return {"message": "Linux+ Learning App API", "version": "2.0", "features": ["quiz", "flashcards", "ai-explanations"]}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
