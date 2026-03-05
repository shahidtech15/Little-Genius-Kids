Write-Host "================================================="
Write-Host "  Auto-Deploy Watcher for Little Genius Kids     "
Write-Host "================================================="
Write-Host "This script will automatically commit and push any changes you make."
Write-Host "Checking for changes every 10 seconds..."
Write-Host "Press Ctrl+C to stop."
Write-Host "================================================="

while ($true) {
    # Check if there are any changes
    $status = git status --porcelain
    
    if ($status) {
        Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Changes detected! Auto-deploying..."
        
        # Add all changes
        git add .
        
        # Commit with a generic timestamp message
        $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        git commit -m "Auto-deploy: changes saved at $timestamp"
        
        # Push to GitHub
        git push
        
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Successfully deployed to GitHub!"
    }
    
    # Wait 10 seconds before checking again
    Start-Sleep -Seconds 10
}
