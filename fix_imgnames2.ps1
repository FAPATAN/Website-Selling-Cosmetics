
$t13 = [string]::new([char]9, 13)

function FixFile($path) {
    $c = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $oldDetail   = $t13 + '<div className="card-desc">{detail}</div>'
    $oldPDetail  = $t13 + '<div className="card-desc">{product.Product_detail}</div>'
    $newDetail   = $t13 + '{detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(detail) && <div className="card-desc">{detail}</div>}'
    $newPDetail  = $t13 + '{product.Product_detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(product.Product_detail) && <div className="card-desc">{product.Product_detail}</div>}'
    $c2 = $c.Replace($oldDetail, $newDetail).Replace($oldPDetail, $newPDetail)
    if ($c2 -eq $c) {
        Write-Output "No changes in: $path"
    } else {
        [IO.File]::WriteAllText($path, $c2, [System.Text.Encoding]::UTF8)
        Write-Output "Fixed: $path"
    }
}

$base = "C:\Website selling cosmetics\register-login\src\Frontend"
FixFile "$base\new.js"
FixFile "$base\face.js"
FixFile "$base\Eye.js"
Write-Output "Done."
