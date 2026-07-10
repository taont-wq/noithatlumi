@echo off
echo Test start
where gh >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo gh not found
)
echo Test end