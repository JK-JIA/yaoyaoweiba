<#
.SYNOPSIS
  生成不含 node_modules、.next、dist 等的大目录的部署 zip，便于上传服务器。

.EXAMPLE
  .\scripts\make-deploy-bundle.ps1
  .\scripts\make-deploy-bundle.ps1 -OutPath D:\dist\site.zip
#>
param(
  [string] $OutPath = ""
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$staging = Join-Path $env:TEMP "yaoyaoweiba-deploy-$stamp"
if (-not $OutPath) {
  $OutPath = Join-Path $Root "yaoyaoweiba-site-deploy-$stamp.zip"
}

New-Item -ItemType Directory -Path $staging | Out-Null

# /XD：排除目录名（任意深度）
robocopy $Root $staging /E /XD node_modules .next dist .git .npm-cache .cursor /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) {
  Remove-Item -Recurse -Force $staging -ErrorAction SilentlyContinue
  throw "robocopy failed with exit code $LASTEXITCODE"
}

if (Test-Path $OutPath) {
  Remove-Item -LiteralPath $OutPath -Force
}

Get-ChildItem -LiteralPath $staging | Compress-Archive -DestinationPath $OutPath -CompressionLevel Optimal
Remove-Item -Recurse -Force $staging

$mb = [math]::Round((Get-Item $OutPath).Length / 1MB, 2)
Write-Host "OK: $OutPath ($mb MB)"
Write-Host "On server: cd frontend / backend, run npm ci then npm run build (or docker compose build only)."
