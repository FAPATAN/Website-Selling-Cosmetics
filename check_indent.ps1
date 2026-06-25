
$f = "C:\Website selling cosmetics\register-login\src\Frontend\new.js"
$c = [IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
$lines = $c -split "`n"
for ($i=0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]
  if ($line -match "card-desc") {
    $prefix = $line -replace "[\S].*", ""
    $hex = ($prefix.ToCharArray() | ForEach-Object { "{0:X2}" -f [int]$_ }) -join " "
    Write-Output "Line $($i+1): [$line]"
    Write-Output "  Prefix hex: $hex len=$($prefix.Length)"
  }
}
