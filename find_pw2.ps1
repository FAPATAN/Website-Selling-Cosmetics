
$hf = "C:\Users\HOME\AppData\Roaming\Code\User\History\38da71e6"
$entries = ([IO.File]::ReadAllText("$hf\entries.json") | ConvertFrom-Json).entries
Write-Output "Total versions: $($entries.Count)"

for ($i = $entries.Count-1; $i -ge 0; $i--) {
  $vf = Join-Path $hf $entries[$i].id
  if (Test-Path $vf) {
    $c = [IO.File]::ReadAllText($vf, [System.Text.Encoding]::UTF8)
    if ($c -match "rule|condition|requirement|indicator|strength|ความยาว|อย่างน้อย|ตัวพิมพ์ใหญ่|ตัวพิมพ์เล็ก|ตัวเลข|อักขระ|checklist|pwRule|pw_rule|passRule") {
      Write-Output "Found at version index $i, id=$($entries[$i].id)"
      # Show the relevant lines
      $lines = $c -split "`n"
      for ($j=0; $j -lt $lines.Count; $j++) {
        if ($lines[$j] -match "rule|condition|requirement|indicator|strength|ความยาว|อย่างน้อย|ตัวพิมพ์ใหญ่|ตัวพิมพ์เล็ก|ตัวเลข|อักขระ|checklist") {
          Write-Output "  Line $($j+1): $($lines[$j].Trim())"
        }
      }
      break
    }
  }
}
Write-Output "Done."
