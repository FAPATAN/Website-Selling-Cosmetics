
$c = [IO.File]::ReadAllText("C:\Website selling cosmetics\pw_version.js", [System.Text.Encoding]::UTF8)
$lines = $c -split "`n"
Write-Output "Total lines: $($lines.Count)"
for ($i=0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]
  if ($line -match "rule|indicator|strength|hasUpper|hasLower|hasNumber|hasSpecial|minLength|checklist|requirement|condition") {
    Write-Output "Line $($i+1): $($line.TrimEnd())"
  }
}
