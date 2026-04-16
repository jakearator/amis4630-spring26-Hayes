$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

$pathsToRemove = @(
    "BuckeyeMarketplaceBackend/bin",
    "BuckeyeMarketplaceBackend/obj",
    "BuckeyeMarketplaceBackend.Tests/bin",
    "BuckeyeMarketplaceBackend.Tests/obj",
    "BuckeyeMarketplaceFrontend/test-results",
    "BuckeyeMarketplaceFrontend/playwright-report",
    "BuckeyeMarketplaceFrontend/coverage",
    "test-results"
)

foreach ($relativePath in $pathsToRemove) {
    $fullPath = Join-Path $repoRoot $relativePath
    $trackedEntries = git -C $repoRoot ls-files -- $relativePath 2>$null

    if ($trackedEntries) {
        Write-Host "Skipping $relativePath because it contains tracked files."
        Write-Host "Run scripts/untrack-artifacts.ps1 once, then rerun cleanup."
        continue
    }

    if (Test-Path $fullPath) {
        Write-Host "Removing $relativePath"
        Remove-Item -Recurse -Force $fullPath
    }
}

Write-Host "Artifact cleanup complete."
