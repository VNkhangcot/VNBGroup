param (
    [Parameter(Mandatory=$false)]
    [string]$RepoUrl,

    [Parameter(Mandatory=$false)]
    [string]$Token
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " VNB Group - Git Remote Connection Setup " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

if (-not (Test-Path ".git")) {
    git init
    Write-Host "✔ Da khoi tao Git repository." -ForegroundColor Green
}

if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Nhap URL Git Repo moi (vd: https://github.com/user/repo.git hoac git@github.com:user/repo.git)"
}

if ($RepoUrl -match "^https://" -and $Token) {
    # Embed token into https url
    $cleanUrl = $RepoUrl -replace "^https://", ""
    $targetUrl = "https://${Token}@${cleanUrl}"
} else {
    $targetUrl = $RepoUrl
}

# Set remote origin
git remote remove origin 2>$null
git remote add origin $targetUrl
Write-Host "✔ Da gan remote origin thanh cong: $RepoUrl" -ForegroundColor Green

# Configure branch to main
git branch -M main

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "San sang day code: git add . && git commit -m 'initial commit' && git push -u origin main" -ForegroundColor Yellow
