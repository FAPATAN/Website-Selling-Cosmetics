
$histBase = "C:\Users\HOME\AppData\Roaming\Code\User\History"
$frontendDir = "C:\Website selling cosmetics\register-login\src\Frontend"

# Fix Cart.js and Orders2.js
$pairs = @(
  [PSCustomObject]@{ Folder="-5b7ece96"; Dest="Cart.js" },
  [PSCustomObject]@{ Folder="-71105689"; Dest="Orders2.js" }
)

foreach ($p in $pairs) {
  $hf = Join-Path $histBase $p.Folder
  $ef = "$hf\entries.json"
  $entries = ([IO.File]::ReadAllText($ef) | ConvertFrom-Json).entries
  for ($i = $entries.Count-1; $i -ge 0; $i--) {
    $vf = Join-Path $hf $entries[$i].id
    if (Test-Path $vf) {
      $c = [IO.File]::ReadAllText($vf, [System.Text.Encoding]::UTF8)
      if ($c -match "[\u0E00-\u0E7F]") {
        $dest = Join-Path $frontendDir $p.Dest
        [IO.File]::WriteAllText($dest, $c, [System.Text.Encoding]::UTF8)
        Write-Output "Restored: $($p.Dest)"
        break
      }
    }
  }
}

# Search for missing files in ALL history entries
$missing = @("App.js","Home.jsx","face.js","Cheek.js","Eye.js","Lip.js","Promotion.js","Pay.js","AdminDashboard.js","AdminOrders.js","AdminPriceRange.js","AdminUsers.js")

Write-Output "`nSearching for missing files in history..."
Get-ChildItem $histBase -Filter "entries.json" -Recurse | ForEach-Object {
  $raw = [IO.File]::ReadAllText($_.FullName)
  $json = $raw | ConvertFrom-Json
  $name = ($json.resource -split "[/\\%]")[-1]
  # URL decode common chars
  if ($name -match "^(App|Home|face|Cheek|Eye|Lip|Promotion|Pay|AdminDashboard|AdminOrders|AdminPriceRange|AdminUsers)") {
    Write-Output "FOUND: $name -> $($_.DirectoryName)"
  }
}

Write-Output "Done."
