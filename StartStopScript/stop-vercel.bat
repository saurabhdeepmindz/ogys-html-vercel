@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem ===========================================================================
rem  stop-vercel.bat
rem  Takes the OGYS FRD site DOWN.
rem
rem  Usage:
rem     stop-vercel.bat             Remove the production deployments (asks first)
rem     stop-vercel.bat prod        Same as above
rem     stop-vercel.bat prod -y     Same, without the confirmation prompt
rem     stop-vercel.bat local       Stop the local Vercel dev server on port 3000
rem
rem  "prod" removes the Vercel project and all of its deployments, so the site
rem  goes offline and the alias starts returning 404. start-vercel.bat recreates
rem  the project under the same name, so the same URL comes back.
rem
rem  Reads VERCEL_TOKEN from the .env file in the project root.
rem  Writes a timestamped log to .\logs\stop-<mode>-DD-MMM-YYYY-HH-MM-SS.log
rem ===========================================================================

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
for %%I in ("%SCRIPT_DIR%\..") do set "PROJECT_DIR=%%~fI"

set "LOG_DIR=%SCRIPT_DIR%\logs"
set "ENV_FILE=%PROJECT_DIR%\.env"
set "STATE_FILE=%SCRIPT_DIR%\last-deployment.txt"
set "PROJECT_NAME=ogys-html-vercel"
set "LOCAL_PORT=3000"
set "EXITCODE=0"
set "FORCE="

set "MODE=%~1"
set "FLAG=%~2"
if /i "%MODE%"=="-y"     ( set "MODE=prod" & set "FORCE=1" )
if /i "%MODE%"=="--yes"  ( set "MODE=prod" & set "FORCE=1" )
if not defined MODE set "MODE=prod"
if /i "%FLAG%"=="-y"     set "FORCE=1"
if /i "%FLAG%"=="--yes"  set "FORCE=1"

if /i "%MODE%"=="prod"  goto mode_ok
if /i "%MODE%"=="local" goto mode_ok
echo [ERROR] Unknown mode "%MODE%". Use: stop-vercel.bat [prod^|local] [-y]
exit /b 2
:mode_ok

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
call :timestamp
set "LOGFILE=%LOG_DIR%\stop-%MODE%-%TS%.log"

call :log "==========================================================="
call :log "STOP   ::  mode=%MODE%  ::  %TS%"
call :log "==========================================================="
call :log "Project folder : %PROJECT_DIR%"
call :log "Vercel project : %PROJECT_NAME%"
call :log "Log file       : %LOGFILE%"

if exist "%STATE_FILE%" (
    call :log "Last recorded start:"
    for /f "usebackq delims=" %%L in ("%STATE_FILE%") do call :log "    %%L"
)

if /i "%MODE%"=="local" goto stop_local
goto stop_prod


rem ---------------------------------------------------------------- PROD ----
:stop_prod
call :load_token  || goto fail
call :require_cli || goto fail

if not defined FORCE (
    echo.
    echo   This will REMOVE the Vercel project "%PROJECT_NAME%" and all of its
    echo   deployments, taking https://%PROJECT_NAME%.vercel.app offline.
    echo   Run start-vercel.bat afterwards to bring the same URL back.
    echo.
    set "ANSWER="
    set /p "ANSWER=  Type YES to continue: "
    if /i not "!ANSWER!"=="YES" (
        call :log "Cancelled by the user at the confirmation prompt."
        goto done
    )
    call :log "User confirmed removal."
) else (
    call :log "Confirmation skipped (-y supplied)."
)

call :log "-----------------------------------------------------------"
call :log "Removing the Vercel project %PROJECT_NAME% and all its deployments..."
set "TMPOUT=%TEMP%\vercel-remove-%TS%.txt"

call vercel remove "%PROJECT_NAME%" --yes --cwd "%PROJECT_DIR%" > "%TMPOUT%" 2>&1
set "RC=!ERRORLEVEL!"

type "%TMPOUT%"
type "%TMPOUT%" >> "%LOGFILE%"
del /q "%TMPOUT%" >nul 2>&1

if not "!RC!"=="0" (
    call :log "[ERROR] vercel remove failed with exit code !RC!"
    goto fail
)

call :log "-----------------------------------------------------------"
call :http_status "https://%PROJECT_NAME%.vercel.app"
call :log "HTTP check https://%PROJECT_NAME%.vercel.app = !HTTP!"
if "!HTTP!"=="200" (
    call :log "[WARN] The alias still answers 200 - DNS/edge cache may take a moment."
) else (
    call :log "[OK] Application is STOPPED (no longer serving)."
)

rem  The local link file now points at a project that no longer exists. Clearing
rem  it makes the next start-vercel.bat re-create and re-link the project under
rem  the same name, so the same URL comes back.
call :clear_link

if exist "%STATE_FILE%" del /q "%STATE_FILE%" >nul 2>&1
goto done


rem --------------------------------------------------------------- LOCAL ----
:stop_local
call :log "-----------------------------------------------------------"
call :log "Stopping the local Vercel dev server on port %LOCAL_PORT%..."

call :port_pid %LOCAL_PORT%
if not defined PORT_PID (
    call :log "[OK] Nothing is listening on port %LOCAL_PORT% - already stopped."
    if exist "%STATE_FILE%" del /q "%STATE_FILE%" >nul 2>&1
    goto done
)

rem  Only ever kill a process we recognise as the Vercel dev server. Port 3000
rem  is a popular port - something else of yours may be sitting on it, and this
rem  script must never terminate it.
call :proc_owner !PORT_PID!
if not "!PROC_OWNER!"=="VERCEL" (
    call :log "[ABORTED] Port %LOCAL_PORT% is held by PID !PORT_PID! ^(!PROC_OWNER!^),"
    call :log "          which was not started by start-vercel.bat. Nothing was killed."
    call :log "          Stop that process yourself if you really want the port back."
    goto fail
)

call :log "Found Vercel dev server on PID !PORT_PID! - terminating the process tree..."
taskkill /PID !PORT_PID! /T /F >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    call :log "[ERROR] taskkill could not terminate PID !PORT_PID!."
    goto fail
)

call :sleep2
call :port_pid %LOCAL_PORT%
if defined PORT_PID (
    call :log "[ERROR] Port %LOCAL_PORT% is still held by PID !PORT_PID!."
    goto fail
)

call :log "[OK] Local dev server is STOPPED. Port %LOCAL_PORT% is free."
if exist "%STATE_FILE%" del /q "%STATE_FILE%" >nul 2>&1
goto done


rem ----------------------------------------------------------- SUBROUTINES --
rem  Clears the local Vercel link. Scoped deliberately: it touches only the
rem  .vercel folder of this project, never anything above it.
:clear_link
if exist "%PROJECT_DIR%\.vercel\project.json" (
    rd /s /q "%PROJECT_DIR%\.vercel" >nul 2>&1
    call :log "Cleared the local .vercel link - the next start will re-link."
) else (
    call :log "No local .vercel link to clear."
)
exit /b 0

:load_token
if not exist "%ENV_FILE%" (
    call :log "[ERROR] .env not found at %ENV_FILE%"
    exit /b 1
)
set "VERCEL_TOKEN="
for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%ENV_FILE%") do (
    if /i "%%~A"=="VERCEL_TOKEN" set "VERCEL_TOKEN=%%~B"
)
if not defined VERCEL_TOKEN (
    call :log "[ERROR] VERCEL_TOKEN is not set in %ENV_FILE%"
    exit /b 1
)
rem The token is exported as an environment variable so that it never appears
rem on a command line, in the log file, or in the Windows process list.
call :log "Loaded VERCEL_TOKEN from .env (value masked: !VERCEL_TOKEN:~0,6!********)"
exit /b 0

:require_cli
where vercel >nul 2>&1
if errorlevel 1 (
    call :log "[ERROR] Vercel CLI not found. Run: npm install -g vercel"
    exit /b 1
)
for /f "usebackq delims=" %%V in (`call vercel --version 2^>nul`) do set "VCLI=%%V"
call :log "Vercel CLI present (version !VCLI!)"
exit /b 0

:http_status
set "HTTP=ERR"
for /f "usebackq delims=" %%S in (`powershell -NoProfile -Command "try{(Invoke-WebRequest -Uri '%~1' -UseBasicParsing -TimeoutSec 30).StatusCode}catch{if($_.Exception.Response){[int]$_.Exception.Response.StatusCode}else{'ERR'}}"`) do set "HTTP=%%S"
exit /b 0

:port_pid
set "PORT_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:"TCP.*:%~1 .*LISTENING"') do set "PORT_PID=%%P"
exit /b 0

rem  Waits about two seconds. "timeout /t" is deliberately not used - it aborts
rem  with "Input redirection is not supported" whenever stdin is not a console.
:sleep2
ping -n 3 127.0.0.1 >nul 2>&1
exit /b 0

rem  Returns VERCEL when the given PID is a Vercel process, GONE when it has
rem  already exited, otherwise the executable name of whatever owns the port.
:proc_owner
set "PROC_OWNER=UNKNOWN"
for /f "usebackq delims=" %%O in (`powershell -NoProfile -Command "$p = Get-CimInstance Win32_Process -Filter ('ProcessId=' + %~1) -ErrorAction SilentlyContinue; if (-not $p) { 'GONE' } elseif ($p.CommandLine -match 'vercel') { 'VERCEL' } else { $p.Name }"`) do set "PROC_OWNER=%%O"
exit /b 0

:timestamp
set "TS="
for /f "usebackq delims=" %%T in (`powershell -NoProfile -Command "(Get-Date).ToString('dd-MMM-yyyy-HH-mm-ss',[Globalization.CultureInfo]::InvariantCulture).ToUpper()"`) do set "TS=%%T"
if not defined TS (
    set "TS=%DATE:/=-%-%TIME::=-%"
    set "TS=!TS: =0!"
    set "TS=!TS:.=-!"
)
exit /b 0

rem  The message is echoed through a variable with delayed expansion on purpose.
rem  "echo %~1" would expand the text BEFORE cmd parses the line, so any | or >
rem  inside a message would be executed as a pipe or a redirection.
:log
set "MSG=%~1"
echo(!MSG!
>>"%LOGFILE%" echo([%TIME%] !MSG!
set "MSG="
exit /b 0

:fail
set "EXITCODE=1"
call :log "[FAILED] stop-vercel.bat did not complete successfully."

:done
call :log "-----------------------------------------------------------"
call :log "END    ::  mode=%MODE%  ::  exit code %EXITCODE%"
call :log "Log written to: %LOGFILE%"
endlocal & exit /b %EXITCODE%
