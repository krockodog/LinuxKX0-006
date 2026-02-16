import requests
import sys
from datetime import datetime
import json

class LinuxLearningAPITester:
    def __init__(self, base_url="https://smart-lerntool.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.text}")
                except:
                    pass
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        return success

    def test_register(self):
        """Test user registration"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@test.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/auth/register",
            200,
            data={"email": test_email, "password": "test1234", "name": "Test User"}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            print(f"✅ Registration successful, token obtained")
            return True
        return False

    def test_login_existing_user(self):
        """Test login with existing user"""
        success, response = self.run_test(
            "Login Existing User",
            "POST",
            "api/auth/login",
            200,
            data={"email": "max@test.com", "password": "test1234"}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            print(f"✅ Login successful with existing user")
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "api/auth/me",
            200
        )
        return success and 'email' in response

    def test_update_language(self):
        """Test language update"""
        success, response = self.run_test(
            "Update Language to DE",
            "PUT",
            "api/auth/language?language=de",
            200
        )
        return success

    def test_get_chapters(self):
        """Test get chapters"""
        success, response = self.run_test(
            "Get Chapters",
            "GET",
            "api/chapters",
            200
        )
        if success and isinstance(response, list) and len(response) == 5:
            print(f"✅ Found {len(response)} chapters")
            return True
        return False

    def test_get_questions(self):
        """Test get questions for chapter 1"""
        success, response = self.run_test(
            "Get Questions Chapter 1",
            "GET",
            "api/questions/1?limit=10",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"✅ Found {len(response)} questions for chapter 1")
            return True
        return False

    def test_submit_quiz(self):
        """Test quiz submission"""
        # First get questions
        success, questions = self.run_test(
            "Get Questions for Quiz",
            "GET",
            "api/questions/1?limit=5",
            200
        )
        
        if not success or not questions:
            return False
            
        # Submit answers (all correct for testing)
        answers = []
        for q in questions:
            answers.append({
                "question_id": q["id"],
                "selected_answer": q["correct_answer"]
            })
        
        success, response = self.run_test(
            "Submit Quiz",
            "POST",
            "api/quiz/submit?chapter=1",
            200,
            data=answers
        )
        
        if success and 'score' in response:
            print(f"✅ Quiz submitted - Score: {response['score']}/{response['total']}")
            return True
        return False

    def test_get_flashcards(self):
        """Test get flashcards"""
        success, response = self.run_test(
            "Get All Flashcards",
            "GET",
            "api/flashcards",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"✅ Found {len(response)} flashcards")
            return True
        return False

    def test_get_flashcards_by_chapter(self):
        """Test get flashcards by chapter"""
        success, response = self.run_test(
            "Get Flashcards Chapter 1",
            "GET",
            "api/flashcards/1",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Found {len(response)} flashcards for chapter 1")
            return True
        return False

    def test_mark_flashcard_reviewed(self):
        """Test mark flashcard as reviewed"""
        success, response = self.run_test(
            "Mark Flashcard Reviewed",
            "POST",
            "api/flashcards/reviewed",
            200
        )
        return success

    def test_get_progress(self):
        """Test get user progress"""
        success, response = self.run_test(
            "Get User Progress",
            "GET",
            "api/progress",
            200
        )
        if success and 'user_id' in response:
            print(f"✅ Progress data retrieved")
            return True
        return False

    def test_update_week(self):
        """Test update current week"""
        success, response = self.run_test(
            "Update Current Week",
            "PUT",
            "api/progress/week?week=5",
            200
        )
        return success

    def test_get_study_plan(self):
        """Test get study plan"""
        success, response = self.run_test(
            "Get Study Plan",
            "GET",
            "api/studyplan",
            200
        )
        if success and isinstance(response, list) and len(response) == 20:
            print(f"✅ Found 20-week study plan")
            return True
        return False

    def test_invalid_login(self):
        """Test invalid login credentials"""
        success, response = self.run_test(
            "Invalid Login",
            "POST",
            "api/auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrongpass"}
        )
        return success  # Success means we got expected 401

    def test_unauthorized_access(self):
        """Test unauthorized access"""
        # Temporarily remove token
        temp_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Unauthorized Access to Progress",
            "GET",
            "api/progress",
            401
        )
        
        # Restore token
        self.token = temp_token
        return success  # Success means we got expected 401

def main():
    print("🚀 Starting CompTIA Linux+ Learning App API Tests")
    print("=" * 60)
    
    tester = LinuxLearningAPITester()
    
    # Test sequence
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("User Registration", tester.test_register),
        ("Get Current User", tester.test_get_me),
        ("Update Language", tester.test_update_language),
        ("Get Chapters", tester.test_get_chapters),
        ("Get Questions", tester.test_get_questions),
        ("Submit Quiz", tester.test_submit_quiz),
        ("Get All Flashcards", tester.test_get_flashcards),
        ("Get Chapter Flashcards", tester.test_get_flashcards_by_chapter),
        ("Mark Flashcard Reviewed", tester.test_mark_flashcard_reviewed),
        ("Get User Progress", tester.test_get_progress),
        ("Update Current Week", tester.test_update_week),
        ("Get Study Plan", tester.test_get_study_plan),
        ("Invalid Login", tester.test_invalid_login),
        ("Unauthorized Access", tester.test_unauthorized_access),
        ("Login Existing User", tester.test_login_existing_user),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"  - {test}")
    else:
        print("\n✅ All tests passed!")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())