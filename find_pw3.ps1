
$hf = "C:\Users\HOME\AppData\Roaming\Code\User\History\38da71e6"
$entries = ([IO.File]::ReadAllText("$hf\entries.json") | ConvertFrom-Json).entries
Write-Output "Total versions: $($entries.Count)"

for ($i = $entries.Count-1; $i -ge 0; $i--) {
  $vf = Join-Path $hf $entries[$i].id
  if (Test-Path $vf) {
    $c = [IO.File]::ReadAllText($vf, [System.Text.Encoding]::UTF8)
    if ($c -match "rule|condition|requirement|indicator|strength|hasUpper|hasLower|hasNumber|hasSpecial|minLength|checklist|pwRule|passRule|passwordCheck") {
      Write-Output "Found at version index $i, id=$($entries[$i].id)"
      $lines = $c -split "`n"
      for ($j=0; $j -lt $lines.Count; $j++) {
        if ($lines[$j] -match "rule|requirement|indicator|strength|hasUpper|hasLower|hasNumber|hasSpecial|minLength|checklist|passRule") {
          Write-Output "  Line $($j+1): $($lines[$j].Trim())"
        }
      }
      break
    }
  }
}
Write-Output "Done."
