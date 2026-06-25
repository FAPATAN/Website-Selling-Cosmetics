
$c = [IO.File]::ReadAllText("C:\Website selling cosmetics\pw_version.js", [System.Text.Encoding]::UTF8)
$lines = $c -split "`n"
Write-Output "Total lines: $($lines.Count)"
# Search for password sections
for ($i=0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]
  if ($line -match "password|Password|passwd") {
    Write-Output "Line $($i+1): $($line.TrimEnd())"
  }
}
