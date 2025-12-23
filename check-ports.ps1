Write-Host "Checking Factify Service Ports..." -ForegroundColor Cyan

$ports = @(5000, 3002, 5173)
$names = @("Node.js Backend", "Python RAG", "React Frontend")

for ($i = 0; $i -lt $ports.Length; $i++) {
    $port = $ports[$i]
    $name = $names[$i]
    
    Write-Host "`nChecking $name (Port $port)..." -ForegroundColor Yellow
    
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connection) {
        $pid = $connection.OwningProcess | Select-Object -First 1
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        
        Write-Host "  Status: RUNNING" -ForegroundColor Green
        Write-Host "  PID: $pid" -ForegroundColor White
        Write-Host "  Process: $($process.ProcessName)" -ForegroundColor White
        
        $kill = Read-Host "  Kill this process? (y/n)"
        if ($kill -eq 'y') {
            Stop-Process -Id $pid -Force
            Write-Host "  Process killed!" -ForegroundColor Red
        }
    } else {
        Write-Host "  Status: NOT RUNNING" -ForegroundColor Gray
    }
}

Write-Host "`nDone!" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
