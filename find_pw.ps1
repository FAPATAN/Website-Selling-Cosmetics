
$hf = "C:\Users\HOME\AppData\Roaming\Code\User\History\38da71e6"
$entries = ([IO.File]::ReadAllText("$hf\entries.json") | ConvertFrom-Json).entries
Write-Output "Total versions: $($entries.Count)"

for ($i = $entries.Count-1; $i -ge 0; $i--) {
  $vf = Join-Path $hf $entries[$i].id
  if (Test-Path $vf) {
    $c = [IO.File]::ReadAllText($vf, [System.Text.Encoding]::UTF8)
    if ($c -match "uppercase|lowercase|special|ตัวพิมพ์|อักขระพิเศษ|passwordRule|strength|minLength|hasUpper|hasLower|hasNumber|hasSpecial") {
      Write-Output "Found password rules at version index $i, id=$($entries[$i].id), source=$($entries[$i].source)"
    }
  }
}
Write-Output "Search complete."
