
function FixFile($path) {
    $c = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    # Current broken: {\ && !/\\.(jpg|...) -> correct: {detail && !/\.(jpg|...)
    $old1 = '{\ && !/\\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(detail) && <div className="card-desc">{detail}</div>}'
    $new1 = '{detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(detail) && <div className="card-desc">{detail}</div>}'
    $old2 = '{\.Product_detail && !/\\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(product.Product_detail) && <div className="card-desc">{product.Product_detail}</div>}'
    $new2 = '{product.Product_detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(product.Product_detail) && <div className="card-desc">{product.Product_detail}</div>}'
    $c2 = $c.Replace($old1, $new1).Replace($old2, $new2)
    if ($c2 -eq $c) {
        Write-Output "No match in: $path"
        # Debug: show what we're looking for vs what's there
        $idx = $c.IndexOf('{\ &&')
        if ($idx -ge 0) {
            Write-Output "  Found broken pattern at index $idx"
            Write-Output "  Snippet: $($c.Substring($idx, [Math]::Min(100, $c.Length - $idx)))"
        }
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
