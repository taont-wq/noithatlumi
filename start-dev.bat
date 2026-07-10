@echo off
chcp 65001 >nul 2>&1
title Lumi Satellite - Dev Server

echo.
echo ============================================
echo      LUMI SATELLITE - DEV SERVER
echo ============================================
echo.

:: ---------- Kill orphaned server on port 3000 ----------
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)
if %ERRORLEVEL% equ 0 (
    echo [OK] Freed port 3000 from orphaned process
) else (
    echo [INFO] Port 3000 is free
)
echo.

:: ---------- Check Node.js ----------
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 20+.
    pause
    exit /b 1
)

:: ---------- Install if needed ----------
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: ---------- Generate Prisma Client ----------
echo [INFO] Generating Prisma client...
call npx.cmd prisma generate >nul 2>&1

:: ---------- Push schema + seed ----------
if not exist "prisma\dev.db" (
    echo [INFO] First run - setting up database...
    call npx.cmd prisma db push --accept-data-loss >nul 2>&1
    call npm run prisma:seed
    echo [OK] Database seeded.
) else (
    call npx.cmd prisma db push --accept-data-loss >nul 2>&1
)

echo.
echo ============================================
echo   Starting dev server on http://localhost:3000
echo   Opening browser in 3 seconds...
echo ============================================
echo.
echo  Admin:      http://localhost:3000/login
echo  Landing:    http://localhost:3000
echo  API Health: http://localhost:3000/api/health
echo.
echo  Press Ctrl+C to stop the server.
echo.

:: ---------- Open browser after short delay ----------
timeout /t 3 /nobreak >nul 2>&1
start "" "http://localhost:3000"

:: ---------- Start dev server ----------
npx.cmd next dev -p 3000

pause
