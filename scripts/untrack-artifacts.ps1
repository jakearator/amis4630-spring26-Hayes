param(
    [switch]$Apply
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

$artifactGlobs = @(
    "**/bin/**",
    "**/obj/**",
    "**/TestResults/**",
    "**/test-results/**",
    "**/playwright-report/**",
    "**/coverage/**",
    "**/*.db-shm",
    "**/*.db-wal"
)

$trackedFiles = New-Object System.Collections.Generic.List[string]
foreach ($glob in $artifactGlobs) {
    $matches = git -C $repoRoot ls-files -- $glob
    if ($matches) {
        foreach ($match in $matches) {
            $trackedFiles.Add($match)
        }
    }
}

$uniqueTracked = $trackedFiles | Sort-Object -Unique

if (-not $uniqueTracked -or $uniqueTracked.Count -eq 0) {
    Write-Host "No tracked artifact files found."
    exit 0
}

if (-not $Apply) {
    Write-Host "Tracked artifact files detected (preview):"
    $uniqueTracked | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "To untrack these files, run:"
    Write-Host "  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/untrack-artifacts.ps1 -Apply"
    exit 0
}

Write-Host "Untracking artifact files..."
$uniqueTracked | ForEach-Object {
    git -C $repoRoot rm --cached -- $_ | Out-Null
}

Write-Host "Done. Artifact files are now untracked (pending commit)."
