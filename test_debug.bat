@echo off
title Lumi Satellite - Deploy
echo ============================================
echo   LUMI SATELLITE - DEPLOY TO RAILWAY
echo ============================================
echo.
where gh >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo gh not found
)
echo ok
