# PowerShell script to build Android APK with proper encoding
# This script sets UTF-8 encoding and suppresses Windows code page messages

$ErrorActionPreference = "Continue"

# Set console output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Set environment variables to suppress Windows code page messages
$env:PYTHONIOENCODING = "utf-8"
$env:JAVA_TOOL_OPTIONS = "-Dfile.encoding=UTF-8"
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:LANG = "en_US.UTF-8"
$env:CI = "false"

# Change code page to UTF-8 (65001) and suppress output
chcp 65001 | Out-Null

# Change to project root directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

Write-Host "Building Android Debug APK..." -ForegroundColor Green
Write-Host "Setting UTF-8 encoding..." -ForegroundColor Yellow

# Run prebuild using cmd.exe to avoid npx interactive mode issues
Write-Host "Running prebuild..." -ForegroundColor Yellow
$prebuildResult = cmd /c "npx expo prebuild --platform android"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Prebuild failed!" -ForegroundColor Red
    exit 1
}

# Run Android build using cmd.exe
Write-Host "Building APK..." -ForegroundColor Yellow
$buildResult = cmd /c "npx expo run:android --variant debug"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "APK location: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan

