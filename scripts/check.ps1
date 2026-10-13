# Budgetly - local verification script
# Usage:  pwsh -File scripts/check.ps1
# Runs a fast sanity check: FastAPI imports cleanly and the client type-checks.

param(
    [string]$Python = "server\venv\Scripts\python.exe"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "[1/2] Checking FastAPI app imports..." -ForegroundColor Cyan
if (-not (Test-Path $Python)) {
    Write-Host "  Python not found at '$Python'. Create the venv first:" -ForegroundColor Yellow
    Write-Host "    python -m venv server\venv" -ForegroundColor Yellow
    exit 1
}
& $Python -c "import server.main; print('  server import OK')"

Write-Host "[2/2] Type-checking the client..." -ForegroundColor Cyan
Push-Location client
try {
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) { throw "TypeScript type-check failed" }
    Write-Host "  client type-check OK" -ForegroundColor Green
}
finally {
    Pop-Location
}

Write-Host "All checks passed." -ForegroundColor Green
