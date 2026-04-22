<#
.SYNOPSIS
  删除本仓库内体积最大的可再生成目录，便于缩小磁盘占用或打包上传前清理。

  会删除（若存在）：
  - 仓库根目录：node_modules、.next、.npm-cache
  - frontend：node_modules、.next
  - backend：node_modules、dist

  清理后请在 frontend / backend 内重新执行 npm ci（或 npm install）再开发或构建。
#>
$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")

$targets = @(
  (Join-Path $root "node_modules"),
  (Join-Path $root ".next"),
  (Join-Path $root ".npm-cache"),
  (Join-Path $root "frontend\node_modules"),
  (Join-Path $root "frontend\.next"),
  (Join-Path $root "backend\node_modules"),
  (Join-Path $root "backend\dist")
)

foreach ($p in $targets) {
  if (Test-Path -LiteralPath $p) {
    Remove-Item -LiteralPath $p -Recurse -Force
    Write-Host "Removed: $p"
  }
}

Write-Host "Done. Reinstall deps: cd frontend; npm ci   and   cd backend; npm ci"
