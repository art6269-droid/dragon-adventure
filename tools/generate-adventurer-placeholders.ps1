$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$node = Get-Command node -ErrorAction Stop

Push-Location $root
try {
  & $node.Source "tools/migrate-adventurers.mjs"
  & $node.Source "tools/build-adventurer-index.mjs"
  Write-Output "Generated rarity-first adventurer placeholders and index."
}
finally {
  Pop-Location
}
