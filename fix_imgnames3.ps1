
function FixFile($path) {
    $c = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    # Fix broken content from previous bad script run
    $c2 = $c.Replace(
        '{\ && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(detail) && <div className="card-desc">{detail}</div>}',
        '{detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(detail) && <div className="card-desc">{detail}</div>}'
    ).Replace(
        '{\.Product_detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(product.Product_detail) && <div className="card-desc">{product.Product_detail}</div>}',
        '{product.Product_detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(product.Product_detail) && <div className="card-desc">{product.Product_detail}</div>}'
    )
    if ($c2 -eq $c) {
        Write-Output "No changes: $path"
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
