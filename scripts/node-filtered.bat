@echo off
REM Wrapper batch file for node that filters Windows code page messages
REM This prevents "Active code page: XXXX" from appearing in output

REM Set UTF-8 code page silently
chcp 65001 >nul 2>&1

REM Execute node with all arguments, redirecting stderr to filter code page messages
node %* 2>&1 | findstr /V /C:"Active code page:"

REM Exit with node's exit code
exit /b %ERRORLEVEL%

