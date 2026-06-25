
$f = "C:\Website selling cosmetics\register-login\src\Frontend\new.js"
$c = [IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
$lines = $c -split "`n"
for ($i=338; $i -le 345; $i++) {
  $line = $lines[$i]
  $hex = ($line.ToCharArray() | Select-Object -First 30 | ForEach-Object { "{0:X2}" -f [int]$_ }) -join " "
  Write-Output "Line $($i+1): $hex"
  Write-Output "  TEXT: $line"
}
