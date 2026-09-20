# Renders every HTML file in .\out to a 1080x1080 PNG using headless Edge.
# Usage: .\render-preview.ps1
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }

$outDir = Join-Path $PSScriptRoot "out"
Get-ChildItem $outDir -Filter *.html | ForEach-Object {
  $png = [System.IO.Path]::ChangeExtension($_.FullName, ".png")
  $url = "file:///" + ($_.FullName -replace '\\', '/')
  & $edge --headless=new --disable-gpu --hide-scrollbars --window-size=1080,1080 --virtual-time-budget=4000 --screenshot="$png" $url 2>$null | Out-Null
  Write-Output $png
}
