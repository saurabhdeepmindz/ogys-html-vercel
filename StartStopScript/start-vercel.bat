@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem ===========================================================================
rem  start-vercel.bat
rem  Brings the OGYS FRD site (index.html + linked pages) UP. UP.
rem
rem  Usage:
rem     start-vercel.bat            Deploy to Vercel production (default)
rem     start-vercel.bat prod       Same as above
rem     start-vercel.bat local      Start a local Vercel dev server on port 3000
rem
rem  Reads VERCEL_TOKEN from the .env file in the project root.
rem  Writes a timestamped log to .\logs\start-<mode>-DD-MMM-YYYY-HH-MM-SS.log
rem ===========================================================================

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
for %%I in ("%SCRIPT_DIR%\..") do set "PROJECT_DIR=%%~fI"

set "LOG_DIR=%SCRIPT_DIR%\logs"
set "ENV_FILE=%PROJECT_DIR%\.env"
set "STATE_FILE=%SCRIPT_DIR%\last-deployment.txt"
set "PROJECT_NAME=ogys-html-vercel"
set "TEAM_SCOPE=saurabh-kumar-vermas-projects"
set "ENTRY_DOC=index.html"
set "LOCAL_PORT=3000"
set "EXITCODE=0"

set "MODE=%~1"
if not defined MODE set "MODE=prod"

if /i "%MODE%"=="prod"  goto mode_ok
if /i "%MODE%"=="local" goto mode_ok
echo [ERROR] Unknown mode "%MODE%". Use: start-vercel.bat [prod^|local]
exit /b 2
:mode_ok

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
call :timestamp
set "LOGFILE=%LOG_DIR%\start-%MODE%-%TS%.log"

call :log "==========================================================="
call :log "START  ::  mode=%MODE%  ::  %TS%"
call :log "==========================================================="
call :log "Project folder : %PROJECT_DIR%"
call :log "Vercel project : %PROJECT_NAME%"
call :log "Entry document : %ENTRY_DOC% (served at /)"
call :log "Log file       : %LOGFILE%"

call :require_files || goto fail
call :load_token    || goto fail
call :require_cli   || goto fail
call :ensure_link   || goto fail

if /i "%MODE%"=="local" goto start_local
goto start_prod


rem ---------------------------------------------------------------- PROD ----
:start_prod
call :log "-----------------------------------------------------------"
call :log "Deploying to Vercel production..."
set "TMPOUT=%TEMP%\vercel-deploy-%TS%.txt"

call vercel deploy --prod --yes --scope %TEAM_SCOPE% --cwd "%PROJECT_DIR%" > "%TMPOUT%" 2>&1 < NUL
set "RC=!ERRORLEVEL!"

type "%TMPOUT%"
type "%TMPOUT%" >> "%LOGFILE%"

if not "!RC!"=="0" (
    call :log "[ERROR] vercel deploy failed with exit code !RC!"
    del /q "%TMPOUT%" >nul 2>&1
    goto fail
)

rem -- pull the unique deployment URL out of the CLI summary ------------------
set "DEPLOY_URL="
for /f "usebackq delims=" %%U in (`powershell -NoProfile -Command "$t = Get-Content -Raw -LiteralPath '%TMPOUT%'; $m = [regex]::Match($t, 'url.\s*:\s*.(https://[A-Za-z0-9.-]+\.vercel\.app)'); if ($m.Success) { $m.Groups[1].Value }"`) do set "DEPLOY_URL=%%U"
del /q "%TMPOUT%" >nul 2>&1

set "LIVE_URL=https://%PROJECT_NAME%.vercel.app"

call :log "-----------------------------------------------------------"
call :log "Deployment finished."
call :log "Production alias : %LIVE_URL%"
if defined DEPLOY_URL call :log "Deployment URL   : !DEPLOY_URL!"

rem -- remember what we started, so stop-vercel.bat has something to report ---
> "%STATE_FILE%" echo project=%PROJECT_NAME%
>>"%STATE_FILE%" echo alias=%LIVE_URL%
if defined DEPLOY_URL >>"%STATE_FILE%" echo deployment=!DEPLOY_URL!
>>"%STATE_FILE%" echo started=%TS%

rem -- verify the site actually answers --------------------------------------
call :http_status "%LIVE_URL%"
call :log "HTTP check %LIVE_URL% = !HTTP!"
if "!HTTP!"=="200" (
    call :log "[OK] Application is LIVE."
) else (
    call :log "[WARN] Alias returned !HTTP! - checking the deployment URL instead."
    if defined DEPLOY_URL (
        call :http_status "!DEPLOY_URL!"
        call :log "HTTP check !DEPLOY_URL! = !HTTP!"
        if "!HTTP!"=="200" (
            call :log "[OK] Application is LIVE on the deployment URL."
        ) else (
            call :log "[WARN] Site did not return 200. It may still be propagating,"
            call :log "       or Deployment Protection may be enabled on the project."
        )
    )
)
goto done


rem --------------------------------------------------------------- LOCAL ----
:start_local
call :log "-----------------------------------------------------------"
call :log "Starting local Vercel dev server on port %LOCAL_PORT%..."

call :port_pid %LOCAL_PORT%
if defined PORT_PID (
    call :log "[WARN] Port %LOCAL_PORT% is already in use by PID !PORT_PID!."
    call :log "       Run stop-vercel.bat local first, then try again."
    set "EXITCODE=1"
    goto done
)

rem The dev server writes to its own log file. It keeps that file open for as
rem long as it runs, so it must not be the log this script is still writing to.
set "DEVLOG=%LOG_DIR%\dev-server-%TS%.log"

rem A tiny runner is used so the child window can redirect into the dev log.
rem It carries no secret - VERCEL_TOKEN is inherited from this process.
set "RUNNER=%TEMP%\vercel-dev-%TS%.cmd"
> "%RUNNER%" echo @echo off
>>"%RUNNER%" echo cd /d "%PROJECT_DIR%"
>>"%RUNNER%" echo call vercel dev --listen %LOCAL_PORT% ^>^> "%DEVLOG%" 2^>^&1

start "Vercel Dev - %PROJECT_NAME%" /min cmd /c "%RUNNER%"
call :log "Dev server launched in a background window."
call :log "Dev server log : %DEVLOG%"
call :log "Waiting for it to listen on port %LOCAL_PORT%..."

set /a TRIES=0
:wait_loop
set /a TRIES+=1
call :sleep2
call :port_pid %LOCAL_PORT%
if defined PORT_PID goto local_up
if !TRIES! lss 45 goto wait_loop

call :log "[ERROR] Dev server did not start listening on port %LOCAL_PORT% within 90s."
call :log "        See %DEVLOG% for the vercel dev output."
goto fail

:local_up
call :log "Dev server is listening. PID = !PORT_PID!"
set "LIVE_URL=http://localhost:%LOCAL_PORT%/"

> "%STATE_FILE%" echo project=%PROJECT_NAME%
>>"%STATE_FILE%" echo mode=local
>>"%STATE_FILE%" echo url=%LIVE_URL%
>>"%STATE_FILE%" echo pid=!PORT_PID!
>>"%STATE_FILE%" echo started=%TS%

call :http_status "%LIVE_URL%"
call :log "HTTP check %LIVE_URL% = !HTTP!"
call :log "[OK] Local application is running at %LIVE_URL%"
call :log "     Stop it with: stop-vercel.bat local"
goto done


rem ----------------------------------------------------------- SUBROUTINES --
rem  Checks the entry document AND every document it links to, so a broken pack
rem  is caught here rather than by the customer clicking a link on the live site.
:require_files
if not exist "%PROJECT_DIR%\%ENTRY_DOC%" (
    call :log "[ERROR] %ENTRY_DOC% not found in %PROJECT_DIR%"
    exit /b 1
)
call :log "Found %ENTRY_DOC%"

set "MISSING=0"
for %%F in (
    "Sparecare_OGYS_FRD-v1.0.html"
    "visuals\index.html"
    "workflows\index.html"
    "downloads\Sparecare_OGYS_Order_Statechart_UML.svg"
) do (
    if exist "%PROJECT_DIR%\%%~F" (
        call :log "  [ok]      %%~F"
    ) else (
        call :log "  [MISSING] %%~F"
        set /a MISSING+=1
    )
)
if not "!MISSING!"=="0" (
    call :log "[ERROR] !MISSING! linked document(s) missing - deployment aborted."
    exit /b 1
)
call :log "All linked documents present."
exit /b 0

rem  The folder must be linked to the Vercel project before a deploy, otherwise
rem  the CLI would invent a project named after the folder. stop-vercel.bat
rem  clears the link when it removes the project, so this re-creates it.
:ensure_link
if exist "%PROJECT_DIR%\.vercel\project.json" (
    call :log "Project already linked (.vercel\project.json present)."
    exit /b 0
)
call :log "No .vercel link found - linking this folder to the Vercel project %PROJECT_NAME%..."
set "TMPLINK=%TEMP%\vercel-link-%TS%.txt"
call vercel link --yes --scope %TEAM_SCOPE% --project %PROJECT_NAME% --cwd "%PROJECT_DIR%" > "%TMPLINK%" 2>&1 < NUL
set "LRC=!ERRORLEVEL!"
type "%TMPLINK%" >> "%LOGFILE%"
del /q "%TMPLINK%" >nul 2>&1
if not "!LRC!"=="0" (
    call :log "[ERROR] vercel link failed with exit code !LRC!"
    exit /b 1
)
call :log "Linked to %PROJECT_NAME%."
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
if not errorlevel 1 (
    for /f "usebackq delims=" %%V in (`call vercel --version 2^>nul`) do set "VCLI=%%V"
    call :log "Vercel CLI present (version !VCLI!)"
    exit /b 0
)
call :log "Vercel CLI not found - installing globally with: npm install -g vercel"
call npm install -g vercel >> "%LOGFILE%" 2>&1
where vercel >nul 2>&1
if errorlevel 1 (
    call :log "[ERROR] Could not install the Vercel CLI. Is Node.js/npm on PATH?"
    exit /b 1
)
call :log "Vercel CLI installed."
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
rem  with "Input redirection is not supported" whenever stdin is not a console,
rem  which would make the wait loop above spin instantly instead of waiting.
:sleep2
ping -n 3 127.0.0.1 >nul 2>&1
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
call :log "[FAILED] start-vercel.bat did not complete successfully."

:done
call :log "-----------------------------------------------------------"
call :log "END    ::  mode=%MODE%  ::  exit code %EXITCODE%"
call :log "Log written to: %LOGFILE%"
endlocal & exit /b %EXITCODE%
