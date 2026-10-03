param(
  [Parameter(Mandatory=$true)][ValidatePattern('^[A-Za-z0-9.-]+$')][string]$Domain,
  [Parameter(Mandatory=$true)][string]$LegalBusinessName,
  [Parameter(Mandatory=$true)][ValidatePattern('^[^@\s]+@[^@\s]+\.[^@\s]+$')][string]$PrivacyEmail,
  [Parameter(Mandatory=$true)][string]$RetentionPeriod,
  [Parameter(Mandatory=$true)][ValidatePattern('^https://')][string]$TallyFormUrl
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8 = New-Object System.Text.UTF8Encoding($false)
$releaseFiles = Get-ChildItem -Path $root -Recurse -File | Where-Object { $_.Extension -in '.html','.xml','.txt' }
foreach ($file in $releaseFiles) {
  $text = [System.IO.File]::ReadAllText($file.FullName)
  $text = $text.Replace('YOUR-REAL-DOMAIN', $Domain)
  $text = $text.Replace('[LEGAL BUSINESS NAME]', $LegalBusinessName)
  $text = $text.Replace('[PRIVACY-CONTACT EMAIL]', $PrivacyEmail)
  $text = $text.Replace('[BUSINESS CONTACT EMAIL]', $PrivacyEmail)
  $text = $text.Replace('[DATA-RETENTION PERIOD]', $RetentionPeriod)
  $text = $text.Replace('[EFFECTIVE DATE OF PRIVACY POLICY]', (Get-Date -Format 'dd MMMM yyyy'))
  [System.IO.File]::WriteAllText($file.FullName, $text, $utf8)
}

$mainJs = Join-Path $root 'static\js\main.js'
$scriptText = [System.IO.File]::ReadAllText($mainJs)
$safeUrl = $TallyFormUrl.Replace("'", "\'")
$scriptText = $scriptText.Replace("const tallyUrl='';", "const tallyUrl='$safeUrl';")
[System.IO.File]::WriteAllText($mainJs, $scriptText, $utf8)

Write-Host 'Release configuration completed.' -ForegroundColor Green
Write-Host 'Run the live tests in RELEASE-CHECKLIST.md before publishing.' -ForegroundColor Yellow
