@echo off
echo ========================================
echo    TESTING OAUTH AUTHENTICATION
echo ========================================
echo.

echo Opening browser to test OAuth...
start http://localhost:3000/demo-auth
start http://localhost:3000/signin

echo.
echo Test Instructions:
echo 1. Demo page should show all auth methods as working
echo 2. Sign-in page should have working OAuth buttons
echo 3. Click Google/Facebook buttons - should login instantly
echo 4. Should redirect to student dashboard
echo.
echo If you see any errors, let me know!
echo.
pause