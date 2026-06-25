
$dir = "C:\Website selling cosmetics\register-login\src\Frontend"
$files = Get-ChildItem $dir -Recurse -Include "*.js","*.jsx"

$replacements = @(
  # getItem (single quotes)
  [string[]]("localStorage.getItem('Member_id')", "sessionStorage.getItem('Member_id')"),
  [string[]]("localStorage.getItem('userEmail')", "sessionStorage.getItem('userEmail')"),
  [string[]]("localStorage.getItem('username')",  "sessionStorage.getItem('username')"),
  [string[]]("localStorage.getItem('userRole')",  "sessionStorage.getItem('userRole')"),
  # getItem (double quotes)
  [string[]]('localStorage.getItem("Member_id")', 'sessionStorage.getItem("Member_id")'),
  [string[]]('localStorage.getItem("userEmail")', 'sessionStorage.getItem("userEmail")'),
  [string[]]('localStorage.getItem("username")',  'sessionStorage.getItem("username")'),
  [string[]]('localStorage.getItem("userRole")',  'sessionStorage.getItem("userRole")'),
  # setItem (double quotes)
  [string[]]('localStorage.setItem("userEmail"',  'sessionStorage.setItem("userEmail"'),
  [string[]]('localStorage.setItem("Member_id"',  'sessionStorage.setItem("Member_id"'),
  [string[]]('localStorage.setItem("username"',   'sessionStorage.setItem("username"'),
  [string[]]('localStorage.setItem("userRole"',   'sessionStorage.setItem("userRole"'),
  # removeItem (double quotes)
  [string[]]('localStorage.removeItem("userEmail")', 'sessionStorage.removeItem("userEmail")'),
  [string[]]('localStorage.removeItem("Member_id")', 'sessionStorage.removeItem("Member_id")'),
  # removeItem (single quotes)
  [string[]]("localStorage.removeItem('userEmail')", "sessionStorage.removeItem('userEmail')"),
  [string[]]("localStorage.removeItem('Member_id')", "sessionStorage.removeItem('Member_id')")
)

$totalChanged = 0

foreach ($file in $files) {
  $content = [IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  $changed = $false
  foreach ($pair in $replacements) {
    if ($content.Contains($pair[0])) {
      $content = $content.Replace($pair[0], $pair[1])
      $changed = $true
    }
  }
  if ($changed) {
    [IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    $totalChanged++
    Write-Output "Updated: $($file.Name)"
  }
}

Write-Output ""
Write-Output "Done. $totalChanged files updated."
