# Budgetly - local verification script
# Usage:  pwsh -File scripts/check.ps1
# Runs a fast sanity check: FastAPI imports cleanly, the backend unit tests pass
# and the client type-checks.

param(
    [string]$Python = "server\venv\Scripts\python.exe"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "[1/3] Checking FastAPI app imports..." -ForegroundColor Cyan
if (-not (Test-Path $Python)) {
    Write-Host "  Python not found at '$Python'. Create the venv first:" -ForegroundColor Yellow
    Write-Host "    python -m venv server\venv" -ForegroundColor Yellow
    exit 1
}
& $Python -c "import server.main; print('  server import OK')"
if ($LASTEXITCODE -ne 0) { throw "FastAPI app failed to import" }

Write-Host "[2/3] Running backend unit tests..." -ForegroundColor Cyan
& $Python -m unittest discover -s server/tests -t .
if ($LASTEXITCODE -ne 0) { throw "Backend unit tests failed" }
Write-Host "  backend tests OK" -ForegroundColor Green

Write-Host "[3/3] Type-checking the client..." -ForegroundColor Cyan
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
