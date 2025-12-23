Write-Host "Starting Factify Services..." -ForegroundColor Cyan

# Start Node.js Backend
Write-Host "`n[1/3] Starting Node.js Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; node app.js" -WorkingDirectory $PSScriptRoot

# Wait a bit for backend to initialize
Start-Sleep -Seconds 2

# Start Python RAG Service
Write-Host "[2/3] Starting Python RAG Service (Port 3002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd RAG; python main.py" -WorkingDirectory $PSScriptRoot

# Wait a bit for RAG to initialize
Start-Sleep -Seconds 2

# Start React Frontend
Write-Host "[3/3] Starting React Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WorkingDirectory $PSScriptRoot

Write-Host "`nAll services started! Check the individual terminal windows." -ForegroundColor Green
Write-Host "Press any key to exit this script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
