@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           FIREBASE AUTH SETUP - QUICK COMMANDS              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo These commands require Firebase CLI to be installed.
echo To install: npm install -g firebase-tools
echo.
echo ════════════════════════════════════════════════════════════════
echo STEP 1: Login to Firebase
echo ════════════════════════════════════════════════════════════════
echo Command: firebase login
echo.
echo ════════════════════════════════════════════════════════════════
echo STEP 2: Enable Email/Password Auth (via Firebase Console only)
echo ════════════════════════════════════════════════════════════════
echo Note: Auth providers can only be enabled via Firebase Console
echo URL: https://console.firebase.google.com/project/ngcdo-6b1ce/authentication
echo.
echo ════════════════════════════════════════════════════════════════
echo STEP 3: Create Admin User via CLI
echo ════════════════════════════════════════════════════════════════
echo Command: firebase auth:import users.json --project ngcdo-6b1ce
echo.
echo OR use the Admin SDK script (create-admin.js)
echo.
echo ════════════════════════════════════════════════════════════════
echo RECOMMENDED: Manual Console Setup (Fastest)
echo ════════════════════════════════════════════════════════════════
echo 1. Visit: https://console.firebase.google.com/project/ngcdo-6b1ce/authentication
echo 2. Click "Get Started"
echo 3. Enable "Email/Password"
echo 4. Go to Users tab → Add User
echo 5. Email: anushgiri110@gmail.com
echo 6. Password: Nextgen2624
echo.
echo ════════════════════════════════════════════════════════════════
echo AFTER SETUP: Verify with this command
echo ════════════════════════════════════════════════════════════════
echo firebase auth:export users.json --project ngcdo-6b1ce
echo.
pause
