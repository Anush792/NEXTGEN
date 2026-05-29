@echo off
echo ========================================
echo    SUPABASE OAUTH SETUP HELPER
echo ========================================
echo.

echo Step 1: Opening Supabase Dashboard...
start https://supabase.com/dashboard
echo.
echo Please:
echo 1. Sign in to Supabase
echo 2. Select your project (or create new one)
echo 3. Go to Settings -^> API
echo 4. Copy your Project URL and anon key
echo.
pause

echo.
echo Step 2: Opening Google Cloud Console for OAuth setup...
start https://console.cloud.google.com/
echo.
echo Please:
echo 1. Create/select a project
echo 2. Enable Google+ API
echo 3. Create OAuth 2.0 credentials
echo 4. Add redirect URI: https://your-project-id.supabase.co/auth/v1/callback
echo.
pause

echo.
echo Step 3: Opening Facebook Developers for OAuth setup...
start https://developers.facebook.com/
echo.
echo Please:
echo 1. Create/select an app
echo 2. Add Facebook Login product
echo 3. Configure OAuth redirect URI: https://your-project-id.supabase.co/auth/v1/callback
echo.
pause

echo.
echo Now update your .env file with real credentials and restart the dev server.
echo.
echo Test commands:
echo - npm run dev (start development server)
echo - Visit http://localhost:3000/api/test-supabase (test connection)
echo - Visit http://localhost:3000/signin (test OAuth login)
echo.
pause