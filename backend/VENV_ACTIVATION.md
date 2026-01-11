How to activate the virtualenv

PowerShell (recommended):

- From project root:
  - `.	ools\activate_venv.ps1`  # sets temporary execution policy and activates the venv
- Or directly:
  - `.\.\venv\Scripts\Activate.ps1`
- If PowerShell refuses to run scripts, run:
  - `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`

Command Prompt (cmd.exe):

- From project root:
  - `activate_venv.bat`  # calls venv\Scripts\activate.bat
  - Or `venv\Scripts\activate.bat`

Git Bash / MSYS / WSL:

- Run: `source venv/Scripts/activate` or `. venv/Scripts/activate`

Notes:
- The provided helper scripts only change the execution policy for the current PowerShell session and do not modify system-wide policy.
- If you still see errors, ensure you have Python installed and that the `venv` folder exists. If not, create it with `py -3 -m venv venv`.