
$histBase = "C:\Users\HOME\AppData\Roaming\Code\User\History"
$frontendDir = "C:\Website selling cosmetics\register-login\src\Frontend"

# Map: history folder hash -> destination filename (relative to Frontend/)
$histMap = @(
  @{ Folder="-3b96564";  Dest="Shipping.js" },
  @{ Folder="-3eff3142"; Dest="Payment.js" },
  @{ Folder="-43761ca8"; Dest="Information.js" },
  @{ Folder="-45bca4bc"; Dest="new.js" },
  @{ Folder="-388e829b"; Dest="Admin\AdminPromotions.js" },
  @{ Folder="-57e4e8cf"; Dest="Admin\AdminProducts.js" },
  @{ Folder="30fc3137";  Dest="Account.js" },
  @{ Folder="5537abb7";  Dest="best1.js" },
  @{ Folder="55382016";  Dest="best2.js" },
  @{ Folder="5b7ece96";  Dest="Cart.js" },
  @{ Folder="67b51ec5";  Dest="Orders.js" },
  @{ Folder="71105689";  Dest="Orders2.js" },
  @{ Folder="173251da";  Dest="Bestsellerform1.js" }
)

$restored = [System.Collections.ArrayList]@()
$skipped  = [System.Collections.ArrayList]@()

foreach ($entry in $histMap) {
  $histFolder = Join-Path $histBase $entry.Folder
  $ef = Join-Path $histFolder "entries.json"
  
  if (-not (Test-Path $ef)) {
    [void]$skipped.Add("$($entry.Dest) - history folder not found")
    continue
  }
  
  $entries = ([IO.File]::ReadAllText($ef) | ConvertFrom-Json).entries
  
  $foundFile = $null
  for ($i = $entries.Count - 1; $i -ge 0; $i--) {
    $vf = Join-Path $histFolder $entries[$i].id
    if (Test-Path $vf) {
      $c = [IO.File]::ReadAllText($vf, [System.Text.Encoding]::UTF8)
      # Check for Thai characters (any Thai Unicode range)
      if ($c -match "[\u0E00-\u0E7F]") {
        $foundFile = $vf
        $foundContent = $c
        break
      }
    }
  }
  
  if ($foundFile) {
    $destPath = Join-Path $frontendDir $entry.Dest
    [IO.File]::WriteAllText($destPath, $foundContent, [System.Text.Encoding]::UTF8)
    [void]$restored.Add($entry.Dest)
  } else {
    [void]$skipped.Add("$($entry.Dest) - no clean version found")
  }
}

Write-Output "=== RESTORED ==="
$restored | ForEach-Object { Write-Output $_ }
Write-Output ""
Write-Output "=== SKIPPED ==="
$skipped | ForEach-Object { Write-Output $_ }
Write-Output ""
Write-Output "Done. Restored: $($restored.Count) | Skipped: $($skipped.Count)"
