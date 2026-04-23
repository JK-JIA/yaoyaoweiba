<#
.SYNOPSIS
  删除本仓库内体积最大的可再生成目录，便于缩小磁盘占用或打包上传前清理。

  默认会删除（若存在）：
  - 仓库根目录：node_modules、.next、.npm-cache
  - frontend：node_modules、.next
  - backend：node_modules、dist

  -BuildArtifactsOnly：只删构建缓存（.next、dist、根 .next、.npm-cache），保留各端 node_modules。

  清理 node_modules 后请在 frontend / backend 内重新执行 npm ci（或 npm install）再开发或构建。
#>
param(
  [switch]$BuildArtifactsOnly
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")

$artifactTargets = @(
  (Join-Path $root ".next"),
  (Join-Path $root ".npm-cache"),
  (Join-Path $root "frontend\.next"),
  (Join-Path $root "backend\dist")
)

$fullTargets = @(
  (Join-Path $root "node_modules"),
  (Join-Path $root "frontend\node_modules"),
  (Join-Path $root "backend\node_modules")
) + $artifactTargets

$targets = if ($BuildArtifactsOnly) { $artifactTargets } else { $fullTargets }

foreach ($p in $targets) {
  if (Test-Path -LiteralPath $p) {
    Remove-Item -LiteralPath $p -Recurse -Force
    Write-Host "Removed: $p"
  }
}

if ($BuildArtifactsOnly) {
  Write-Host "Done. node_modules kept. Rebuild: cd frontend; npm run build"
} else {
  Write-Host "Done. Reinstall deps: cd frontend; npm ci   and   cd backend; npm ci"
}
