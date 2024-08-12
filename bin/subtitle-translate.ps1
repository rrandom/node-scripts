# bin/translate.ps1

$originalDirectory = Get-Location


$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
cd $PSScriptRoot


tsx ../src/subtitle-translate.ts $args

Set-Location -Path $originalDirectory
