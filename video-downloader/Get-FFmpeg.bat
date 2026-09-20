@echo off
title Get ffmpeg
cd /d "%~dp0"
echo.
echo  This downloads ffmpeg (about 90 MB) into the bin folder.
echo  ffmpeg is needed for 1080p+ YouTube downloads and MP3 conversion.
echo.
if not exist bin mkdir bin
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ProgressPreference='SilentlyContinue';" ^
  "$zip = Join-Path $env:TEMP 'ffmpeg-essentials.zip';" ^
  "Write-Host '  Downloading...';" ^
  "Invoke-WebRequest -Uri 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip' -OutFile $zip;" ^
  "Write-Host '  Unpacking...';" ^
  "$dest = Join-Path $env:TEMP 'ffmpeg-unpack';" ^
  "if (Test-Path $dest) { Remove-Item $dest -Recurse -Force };" ^
  "Expand-Archive -Path $zip -DestinationPath $dest -Force;" ^
  "Get-ChildItem -Path $dest -Recurse -Include ffmpeg.exe,ffprobe.exe | ForEach-Object { Copy-Item $_.FullName -Destination 'bin' -Force };" ^
  "Remove-Item $zip -Force; Remove-Item $dest -Recurse -Force;" ^
  "Write-Host '  Done. ffmpeg.exe and ffprobe.exe are in the bin folder.'"
echo.
echo  Now close the Video Downloader window (if open) and run Start.bat again.
pause
