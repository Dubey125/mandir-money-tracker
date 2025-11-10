@echo off
cd /d "%~dp0"
echo Starting backend server...
node server/index.js
pause
