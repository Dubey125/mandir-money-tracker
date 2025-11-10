@echo off
cd /d "%~dp0backend"
echo.
echo ============================================
echo Starting Backend Server on Port 3000
echo ============================================
echo.
node server/index.js
pause
