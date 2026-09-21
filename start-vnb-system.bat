@echo off
title VNB Business OS System Launcher

:: 1. Start MongoDB if not already running as service
net start MongoDB >nul 2>&1

:: 2. Start Nginx if not running
tasklist /fi "imagename eq nginx.exe" | findstr /i "nginx.exe" >nul
if errorlevel 1 (
    echo Starting Nginx...
    cd /d C:\nginx
    start "" nginx.exe
) else (
    echo Nginx is already running. Reloading configuration...
    cd /d C:\nginx
    nginx.exe -s reload
)

:: 3. Start Backend API
echo Starting VNB ERP Backend API (Port 5000)...
cd /d C:\dev\vnb\VNBGroup\vnb-erp\server
pm2 start dist/server.js --name vnb-erp-api || node dist/server.js
