@echo off
REM Helper batch file to activate venv in cmd.exe
if exist "%~dp0venv\Scripts\activate.bat" (
    call "%~dp0venv\Scripts\activate.bat"
    echo Activated virtualenv: venv
) else (
    echo Virtualenv activation script not found at %~dp0venv\Scripts\activate.bat
    exit /b 1
)