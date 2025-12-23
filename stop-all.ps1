Write-Host "Stopping Factify Services..." -ForegroundColor Cyan

# Kill processes on port 5000 (Node.js Backend)
Write-Host "`n[1/3] Stopping Node.js Backend (Port 5000)..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    $pid = $port5000.OwningProcess | Select-Object -First 1
    Stop-Process -Id $pid -Force
    Write-Host "Killed process $pid on port 5000" -ForegroundColor Green
} else {
    Write-Host "No process found on port 5000" -ForegroundColor Gray
}

# Kill processes on port 3002 (Python RAG)
Write-Host "[2/3] Stopping Python RAG Service (Port 3002)..." -ForegroundColor Yellow
$port3002 = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
if ($port3002) {
    $pid = $port3002.OwningProcess | Select-Object -First 1
    Stop-Process -Id $pid -Force
    Write-Host "Killed process $pid on port 3002" -ForegroundColor Green
} else {
    Write-Host "No process found on port 3002" -ForegroundColor Gray
}

# Kill processes on port 5173 (React Frontend)
Write-Host "[3/3] Stopping React Frontend (Port 5173)..." -ForegroundColor Yellow
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    $pid = $port5173.OwningProcess | Select-Object -First 1
    Stop-Process -Id $pid -Force
    Write-Host "Killed process $pid on port 5173" -ForegroundColor Green
} else {
    Write-Host "No process found on port 5173" -ForegroundColor Gray
}

Write-Host "`nAll services stopped!" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
