@echo off
title Squareko Creator Tools
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install it from https://nodejs.org and run this again.
  pause
  exit /b 1
)

echo Starting Creator Tools...
echo The browser opens by itself in a moment. Keep this window open while you use the tools.
echo Close this window to stop.
echo.
node server.js --open
echo.
echo The server stopped.
pause
