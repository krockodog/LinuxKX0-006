# Windows Installer Build-Anleitung

## Schnell-Anleitung (5 Minuten)

### Voraussetzungen
- Windows 10/11
- Node.js 18+ installiert
- Git installiert

### Schritte

```powershell
# 1. Repository klonen
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery/frontend

# 2. Abhängigkeiten installieren
npm install -g yarn
yarn install

# 3. Windows Installer bauen
yarn electron-build-win
```

Der Installer wird in `frontend/dist/` erstellt:
- `Linux+Mastery Setup X.X.X.exe` - Installer
- `linux-unpacked/` - Portable Version

---

## Installer-Features

### Setup-Wizard Optionen
Bei der Installation kann der Benutzer wählen:
- ✅ **Mit KI-Funktionen** - Vollständige App mit AI-Erklärungen
- ❌ **Ohne KI-Funktionen** - Basis-App ohne AI (kleinerer Speicherbedarf)

### Installierte Dateien
- Desktop-Verknüpfung
- Startmenü-Eintrag
- Deinstallationsprogramm

---

## Build-Konfiguration anpassen

### App-Name ändern
In `frontend/electron-builder.json`:
```json
{
  "productName": "Linux+ Mastery",
  "appId": "com.linuxmastery.app"
}
```

### Icon ändern
1. Erstelle eine `.ico` Datei (256x256 px empfohlen)
2. Speichere als `frontend/build-resources/icon.ico`
3. Baue neu mit `yarn electron-build-win`

### Versionsnummer ändern
In `frontend/package.json`:
```json
{
  "version": "2.0.0"
}
```

---

## Fehlerbehebung

### "ENOENT: no such file or directory"
```powershell
yarn install --force
```

### "Cannot find module"
```powershell
rm -rf node_modules
yarn install
```

### Build schlägt fehl
1. Stelle sicher, dass Node.js 18+ installiert ist
2. Führe `yarn cache clean` aus
3. Versuche es erneut

---

## Portable Version erstellen

Nach dem Build findest du in `dist/win-unpacked/` die portable Version:
1. Kopiere den gesamten `win-unpacked` Ordner
2. Erstelle eine leere Datei namens `portable` im Ordner
3. Die App speichert alle Daten im App-Ordner statt in AppData

---

## Signatur (optional)

Für eine signierte Version:
1. Besorge ein Code-Signing-Zertifikat
2. Setze die Umgebungsvariablen:
   ```powershell
   $env:CSC_LINK = "path/to/certificate.pfx"
   $env:CSC_KEY_PASSWORD = "your-password"
   ```
3. Baue neu mit `yarn electron-build-win`
