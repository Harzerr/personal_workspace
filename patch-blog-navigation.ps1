$ErrorActionPreference = 'Stop'

function Decode-Utf8([string]$value) {
    [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($value))
}

$bundlePath = Join-Path $PSScriptRoot 'frontend-dist\static\js\index.single-login.blog.20260817.js'
$bundle = [IO.File]::ReadAllText($bundlePath)
$blogWorkspace = Decode-Utf8 '5Y2a5paH5bel5L2c5Y+w'

$menuAnchor = '{itemKey:"personal-workspace",text:"' + (Decode-Utf8 '5Liq5Lq6IEFJIOW3peS9nOWPsA==') + '",icon:(0,m.jsx)(ek.A,{})},'
$menuReplacement = $menuAnchor + '{itemKey:"blog-workspace",text:"' + $blogWorkspace + '",icon:(0,m.jsx)(eI.A,{})},'
$handlerAnchor = '"personal-workspace"===r?s("/personal-workspace"):null==a||a(r)'
$handlerReplacement = '"personal-workspace"===r?s("/personal-workspace"):"blog-workspace"===r?location.href="/ai-agent-station/blog.html":null==a||a(r)'

foreach ($replacement in @(@($menuAnchor, $menuReplacement), @($handlerAnchor, $handlerReplacement))) {
    $old = $replacement[0]
    $new = $replacement[1]
    $count = ([regex]::Matches($bundle, [regex]::Escape($old))).Count
    if ($count -ne 1) {
        throw "Expected one navigation fragment, found $count."
    }
    $bundle = $bundle.Replace($old, $new)
}

[IO.File]::WriteAllText($bundlePath, $bundle, [Text.UTF8Encoding]::new($false))
