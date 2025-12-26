@echo off
REM Batch script to build Android APK with proper encoding
REM This script sets UTF-8 encoding and suppresses Windows code page messages

REM Set UTF-8 code page first (this prevents code page messages in subsequent commands)
chcp 65001 >nul 2>&1

REM Set environment variables to suppress Windows code page messages
set JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8
set PYTHONIOENCODING=utf-8
set NODE_OPTIONS=--max-old-space-size=4096
set LANG=en_US.UTF-8

REM Set COMSPEC to use UTF-8 (this prevents code page messages when cmd.exe is invoked)
set COMSPEC=%SystemRoot%\System32\cmd.exe

cd /d "%~dp0\.."

echo Building Android Debug APK...

echo Running prebuild...
call npx expo prebuild --platform android
if errorlevel 1 (
    echo Prebuild failed!
    exit /b 1
)

echo Building APK...
echo Stopping any existing Gradle daemons to ensure clean UTF-8 environment...
cd android
call gradlew.bat --stop >nul 2>&1
cd ..

call npx expo run:android --variant debug
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

echo.
echo Build completed successfully!
echo APK location: android\app\build\outputs\apk\debug\app-debug.apk

