<#
.SYNOPSIS
    Fabrique le paquet d'installation Joomla du template cassiopeia_cdf.

.DESCRIPTION
    - met à jour le numéro de version (et la date) dans templateDetails.xml si -Version est fourni ;
    - crée dist\tpl_cassiopeia_cdf-<version>.zip, prêt à installer dans
      Système › Installer › Extensions.

.EXAMPLE
    .\build.ps1                  # reconstruit le zip avec la version actuelle
    .\build.ps1 -Version 1.0.5   # passe en 1.0.5 puis construit le zip
#>
param(
    [ValidatePattern('^\d+\.\d+\.\d+$')]
    [string]$Version
)

$ErrorActionPreference = 'Stop'

$root     = $PSScriptRoot
$source   = Join-Path $root 'template\cassiopeia_cdf'
$manifest = Join-Path $source 'templateDetails.xml'
$dist     = Join-Path $root 'dist'
$utf8     = New-Object System.Text.UTF8Encoding $false

$xml = [System.IO.File]::ReadAllText($manifest, $utf8)

if ($Version) {
    $xml = $xml -replace '<version>[^<]*</version>', "<version>$Version</version>"
    $xml = $xml -replace '<creationDate>[^<]*</creationDate>', ('<creationDate>' + (Get-Date -Format 'yyyy-MM') + '</creationDate>')
    [System.IO.File]::WriteAllText($manifest, $xml, $utf8)
    Write-Host "Version mise à jour : $Version"
} elseif ($xml -match '<version>([^<]*)</version>') {
    $Version = $Matches[1]
} else {
    throw 'Numéro de version introuvable dans templateDetails.xml'
}

New-Item -ItemType Directory -Force $dist | Out-Null
$zip = Join-Path $dist "tpl_cassiopeia_cdf-$Version.zip"
if (Test-Path $zip) {
    Remove-Item $zip -Confirm:$false
}

# tar.exe (intégré à Windows) produit des chemins avec « / », ce qu'attend
# l'installeur Joomla sous Linux (Compress-Archive de PowerShell 5.1 met des « \ »).
Push-Location $source
try {
    & "$env:SystemRoot\System32\tar.exe" -a -c -f $zip templateDetails.xml html media
    if ($LASTEXITCODE -ne 0) {
        throw "La création du zip a échoué (code $LASTEXITCODE)"
    }
} finally {
    Pop-Location
}

Write-Host "Paquet créé : $zip"
