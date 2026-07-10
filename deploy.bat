@echo off
title Lumi Satellite - Deploy

echo ============================================
echo   LUMI SATELLITE - DEPLOY TO RAILWAY
echo ============================================
echo.

:: Check tools
where gh >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [STEP 1] GitHub CLI ^(gh^) not found.
    echo   Download from: https://cli.github.com/
    pause
    exit /b 1
)

where railway >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [STEP 1] Railway CLI not found. Installing...
    call npm install -g @railway/cli
)

:: Check env file
if not exist ".env" (
    echo [WARN] .env file not found.
    echo   Copy .env.example to .env and fill in secrets first.
    pause
    exit /b 1
)

:: Build check
echo [STEP 2] Verifying build...
call npx.cmd next build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed. Fix errors before deploying.
    pause
    exit /b 1
)
echo [OK] Build passes.

:: Test
echo [STEP 3] Running tests...
call npx.cmd vitest run
if %ERRORLEVEL% neq 0 (
    echo [WARN] Tests failed. Continue anyway?
    pause
)

:: Git status
echo [STEP 4] Preparing git...
git status 2>&1 | findstr "nothing to commit" >nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] Uncommitted changes found. Committing...
    git add .
    git commit -m "chore: deploy prep"
)

:: Check remote
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [STEP 5] No git remote found.
    echo   First, authenticate GitHub using: gh auth login
    echo.
    echo   Then create repo: gh repo create taont-wq/lumi-satellite --public --push --source=.
    echo.
    echo   Run those commands manually, then re-run this script.
    pause
    exit /b 1
)

:: Push
echo [STEP 5] Pushing to GitHub...
git push origin main
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Push failed. Check git remote and permissions.
    pause
    exit /b 1
)
echo [OK] Code pushed to GitHub.

:: Railway
echo [STEP 6] Deploying to Railway...
echo.
railway login
echo [INFO] After login, run: railway link
echo   Then: railway up --detach
echo.

echo ============================================
echo   DONE - Ready for Railway deploy
echo ============================================
pause
