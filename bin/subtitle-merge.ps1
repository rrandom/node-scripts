
$currentDir = Get-Location


$projectDir = (Get-Item -Path $PSScriptRoot).Parent.FullName
Set-Location $projectDir


tsx src/merge-subtitle.ts @args

Set-Location $currentDir
