$scriptName = "dir2todo.ts"

$projectDir = (Get-Item -Path $PSScriptRoot).Parent.FullName
$tsxPath = [System.IO.Path]::Combine($projectDir, "node_modules", ".bin", "tsx.ps1")
$scriptPath = [System.IO.Path]::Combine($projectDir, "src", $scriptName)
& $tsxPath $scriptPath @args