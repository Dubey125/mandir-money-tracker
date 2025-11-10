@echo off
echo Adding Windows Firewall rules for ports 3000 and 5173...
echo.
netsh advfirewall firewall add rule name="MoneyTracker Backend (3000)" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="MoneyTracker Frontend (5173)" dir=in action=allow protocol=TCP localport=5173
echo.
echo Done! Press any key to close...
pause
