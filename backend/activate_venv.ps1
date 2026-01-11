# Helper script to activate the project's virtualenv in PowerShell (temporary execution policy for this session)

param(
    [switch]$Force
)

# Resolve the venv activation script
$venvActivate = Join-Path -Path $PSScriptRoot -ChildPath "venv\Scripts\Activate.ps1"
if (-not (Test-Path $venvActivate)) {
    Write-Error "Virtualenv activation script not found at: $venvActivate"
    exit 1
}

# Allow script execution in this PowerShell session if needed
try {
    if ((Get-ExecutionPolicy -Scope Process) -eq 'Restricted' -and -not $Force) {
        Write-Host "Setting execution policy for this session to RemoteSigned..."
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
    }
} catch {
    Write-Warning "Could not change execution policy: $_.Exception.Message"
}

# Dot-source the activate script to keep environment in current session
. $venvActivate
Write-Host "Activated virtualenv: venv"