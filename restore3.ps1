
$histBase = "C:\Users\HOME\AppData\Roaming\Code\User\History"
$frontendDir = "C:\Website selling cosmetics\register-login\src\Frontend"

# For files with multiple history matches, list all candidates and pick the right one
# by checking if the file content matches what we expect (React imports)
$filesToRestore = @(
  [PSCustomObject]@{ Dest="Home.jsx";            Candidates=@("-31b98173","6d4918f");       MustContain="import React" },
  [PSCustomObject]@{ Dest="App.js";              Candidates=@("-427a38d8","38da71e6","6e111b43"); MustContain="import React" },
  [PSCustomObject]@{ Dest="face.js";             Candidates=@("-20dee6d3");                 MustContain="import React" },
  [PSCustomObject]@{ Dest="Cheek.js";            Candidates=@("470912be");                  MustContain="import React" },
  [PSCustomObject]@{ Dest="Eye.js";              Candidates=@("755e5133");                  MustContain="import React" },
  [PSCustomObject]@{ Dest="Lip.js";              Candidates=@("-7f8c3a6f");                 MustContain="import React" },
  [PSCustomObject]@{ Dest="Promotion.js";        Candidates=@("195a33c1");                  MustContain="import React" },
  [PSCustomObject]@{ Dest="Pay.js";              Candidates=@("-79257ca4");                 MustContain="import React" },
  [PSCustomObject]@{ Dest="Admin\AdminDashboard.js";  Candidates=@("-1d525e7b");            MustContain="import React" },
  [PSCustomObject]@{ Dest="Admin\AdminOrders.js";     Candidates=@("270c3990");             MustContain="import React" },
  [PSCustomObject]@{ Dest="Admin\AdminPriceRange.js"; Candidates=@("7f52e1a1");             MustContain="import React" },
  [PSCustomObject]@{ Dest="Admin\AdminUsers.js";      Candidates=@("44c27a91");             MustContain="import React" }
)

$restored = [System.Collections.ArrayList]@()
$failed   = [System.Collections.ArrayList]@()

foreach ($item in $filesToRestore) {
  $found = $false
  foreach ($folder in $item.Candidates) {
    $hf = Join-Path $histBase $folder
    $ef = "$hf\entries.json"
    if (-not (Test-Path $ef)) { continue }
    
    $entries = ([IO.File]::ReadAllText($ef) | ConvertFrom-Json).entries
    
    for ($i = $entries.Count-1; $i -ge 0; $i--) {
      $vf = Join-Path $hf $entries[$i].id
      if (Test-Path $vf) {
        $c = [IO.File]::ReadAllText($vf, [System.Text.Encoding]::UTF8)
        # Must contain Thai AND expected content marker
        if (($c -match "[\u0E00-\u0E7F]") -and ($c.Contains($item.MustContain))) {
          $dest = Join-Path $frontendDir $item.Dest
          [IO.File]::WriteAllText($dest, $c, [System.Text.Encoding]::UTF8)
          [void]$restored.Add("$($item.Dest) (from $folder, ver $i)")
          $found = $true
          break
        }
      }
    }
    if ($found) { break }
  }
  if (-not $found) { [void]$failed.Add($item.Dest) }
}

Write-Output "=== RESTORED ==="
$restored | ForEach-Object { Write-Output $_ }
Write-Output ""
Write-Output "=== FAILED ==="
$failed | ForEach-Object { Write-Output $_ }
Write-Output ""
Write-Output "Done. Restored: $($restored.Count) | Failed: $($failed.Count)"
