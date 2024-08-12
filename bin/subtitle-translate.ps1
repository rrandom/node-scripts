# bin/translate.ps1

# 保存当前工作目录
$originalDirectory = Get-Location

# 确保脚本的工作目录是脚本所在的目录
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
cd $PSScriptRoot

# 运行 TypeScript 脚本使用 tsx
tsx ../src/translate.ts $args

# 返回到原始工作目录
Set-Location -Path $originalDirectory
