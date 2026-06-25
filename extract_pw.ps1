
$hf = "C:\Users\HOME\AppData\Roaming\Code\User\History\38da71e6"
$vf = Join-Path $hf "iyRr.js"
$c = [IO.File]::ReadAllText($vf, [System.Text.Encoding]::UTF8)
[IO.File]::WriteAllText("C:\Website selling cosmetics\pw_version.js", $c, [System.Text.Encoding]::UTF8)
Write-Output "Saved. Length=$($c.Length)"
