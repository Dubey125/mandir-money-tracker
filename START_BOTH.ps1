# Start Backend Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\New folder\MoneyTracker_fixed - Copy\backend'; node server/index.js"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\New folder\MoneyTracker_fixed - Copy'; npm run dev"

Write-Host "✅ Both servers starting in new windows..."
Write-Host "Backend: http://10.43.20.133:3000"
Write-Host "Frontend: http://10.43.20.133:5173"
