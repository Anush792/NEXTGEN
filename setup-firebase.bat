@echo off
echo ========================================
echo    FREE FIREBASE OAUTH SETUP
echo ========================================
echo.

echo Step 1: Opening Firebase Console...
start https://console.firebase.google.com/
echo.
echo Please:
echo 1. Sign in with your Google account
echo 2. Click "Create a project" or select existing
echo 3. Enable Authentication:
echo    - Go to Authentication tab
echo    - Click "Get started"
echo    - Go to Sign-in method
echo    - Enable Google and Facebook providers
echo.
pause

echo.
echo Step 2: Get your Firebase config...
echo.
echo In Firebase Console:
echo 1. Click the gear icon (Settings) -^> Project settings
echo 2. Scroll down to "Your apps" section
echo 3. Click the web icon "^</^>" to add a web app
echo 4. Register your app (name it anything)
echo 5. Copy the config object (apiKey, authDomain, etc.)
echo.
pause

echo.
echo Step 3: Update your .env file...
echo.
echo Replace the demo values in .env with your real Firebase config
echo.
echo Test commands:
echo - npm run dev (start development server)
echo - Visit http://localhost:3000/signin (test OAuth login)
echo.
echo NOTE: Firebase is completely FREE for OAuth authentication!
echo.
pause