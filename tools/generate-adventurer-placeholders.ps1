Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$cardDir = Join-Path $root "assets/adventurers/cards"
$pixelDir = Join-Path $root "assets/adventurers/pixel"
$backDir = Join-Path $root "assets/adventurers/card-backs"
$placeholderDir = Join-Path $root "assets/adventurers/placeholders"
$uiDir = Join-Path $root "assets/ui"

@($cardDir, $pixelDir, $backDir, $placeholderDir, $uiDir) | ForEach-Object {
  New-Item -ItemType Directory -Path $_ -Force | Out-Null
}

$characters = @(
  @{ Id = "newbie-swordman-c-fire"; Name = "NEW SWORD"; Rarity = "C"; Element = "fire"; Job = "fighter" },
  @{ Id = "apprentice-archer-c-wood"; Name = "NEW ARCHER"; Rarity = "C"; Element = "wood"; Job = "archer" },
  @{ Id = "flame-fist-b-fire"; Name = "FLAME FIST"; Rarity = "B"; Element = "fire"; Job = "fighter" },
  @{ Id = "aqua-mage-b-water"; Name = "AQUA MAGE"; Rarity = "B"; Element = "water"; Job = "mage" },
  @{ Id = "forest-assassin-a-wood"; Name = "FOREST EDGE"; Rarity = "A"; Element = "wood"; Job = "assassin" },
  @{ Id = "light-pastor-a-light"; Name = "LIGHT GUIDE"; Rarity = "A"; Element = "light"; Job = "pastor" },
  @{ Id = "crimson-knight-s-fire"; Name = "RED KNIGHT"; Rarity = "S"; Element = "fire"; Job = "fighter" },
  @{ Id = "azure-sorcerer-s-water"; Name = "BLUE SAGE"; Rarity = "S"; Element = "water"; Job = "mage" },
  @{ Id = "holy-guardian-ss-light"; Name = "HOLY GUARD"; Rarity = "SS"; Element = "light"; Job = "guardian" },
  @{ Id = "shadow-hunter-ss-dark"; Name = "DARK HUNTER"; Rarity = "SS"; Element = "dark"; Job = "archer" },
  @{ Id = "alon-sss-fire"; Name = "ALON"; Rarity = "SSS"; Element = "fire"; Job = "fighter" },
  @{ Id = "star-dragonlord-sss-light"; Name = "STAR LORD"; Rarity = "SSS"; Element = "light"; Job = "fighter" }
)

$elementColors = @{
  fire = [System.Drawing.Color]::FromArgb(224, 72, 38)
  water = [System.Drawing.Color]::FromArgb(35, 157, 211)
  wood = [System.Drawing.Color]::FromArgb(60, 153, 81)
  light = [System.Drawing.Color]::FromArgb(241, 205, 100)
  dark = [System.Drawing.Color]::FromArgb(104, 65, 151)
}

$rarityColors = @{
  C = [System.Drawing.Color]::FromArgb(190, 198, 210)
  B = [System.Drawing.Color]::FromArgb(92, 180, 255)
  A = [System.Drawing.Color]::FromArgb(188, 118, 255)
  S = [System.Drawing.Color]::FromArgb(255, 211, 83)
  SS = [System.Drawing.Color]::FromArgb(255, 112, 74)
  SSS = [System.Drawing.Color]::FromArgb(255, 238, 121)
}

function New-Canvas([int]$width, [int]$height, [bool]$transparent = $false) {
  $bitmap = [System.Drawing.Bitmap]::new($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  if ($transparent) {
    $graphics.Clear([System.Drawing.Color]::Transparent)
  } else {
    $graphics.Clear([System.Drawing.Color]::FromArgb(9, 20, 47))
  }
  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Save-Canvas($canvas, [string]$path) {
  $canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
}

function New-GameFont([float]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
  try { return [System.Drawing.Font]::new("Microsoft JhengHei", $size, $style) }
  catch { return [System.Drawing.Font]::new("Arial", $size, $style) }
}

function New-CharacterCard($character, [string]$path) {
  $canvas = New-Canvas 360 520
  $g = $canvas.Graphics
  $element = $elementColors[$character.Element]
  $border = $rarityColors[$character.Rarity]
  $gradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Rectangle]::new(0, 0, 360, 520),
    [System.Drawing.Color]::FromArgb(255, 10, 24, 55),
    [System.Drawing.Color]::FromArgb(255, $element.R, $element.G, $element.B),
    70
  )
  $g.FillRectangle($gradient, 0, 0, 360, 520)
  $gradient.Dispose()

  $soft = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(55, 255, 255, 255))
  $g.FillEllipse($soft, 38, 74, 284, 284)
  $soft.Dispose()

  $body = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(225, 20, 29, 58))
  $accent = [System.Drawing.SolidBrush]::new($element)
  $skin = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 244, 214, 180))
  $g.FillEllipse($skin, 132, 105, 96, 104)
  $g.FillPolygon($body, @(
    [System.Drawing.Point]::new(180, 190),
    [System.Drawing.Point]::new(102, 365),
    [System.Drawing.Point]::new(258, 365)
  ))
  $g.FillRectangle($accent, 112, 238, 136, 36)
  $g.FillPolygon($accent, @(
    [System.Drawing.Point]::new(126, 126),
    [System.Drawing.Point]::new(180, 75),
    [System.Drawing.Point]::new(234, 126)
  ))
  if ($character.Job -match "mage|pastor") {
    $g.FillEllipse($accent, 272, 160, 28, 28)
    $g.FillRectangle($body, 282, 184, 8, 178)
  } elseif ($character.Job -match "archer") {
    $pen = [System.Drawing.Pen]::new($accent, 9)
    $g.DrawArc($pen, 250, 160, 66, 194, 95, 170)
    $pen.Dispose()
  } else {
    $g.FillRectangle($body, 268, 155, 18, 178)
    $g.FillPolygon($accent, @(
      [System.Drawing.Point]::new(277, 125),
      [System.Drawing.Point]::new(296, 163),
      [System.Drawing.Point]::new(258, 163)
    ))
  }
  $body.Dispose(); $accent.Dispose(); $skin.Dispose()

  $borderPen = [System.Drawing.Pen]::new($border, 10)
  $g.DrawRectangle($borderPen, 8, 8, 344, 504)
  $borderPen.Dispose()
  $innerPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(190, 255, 241, 186), 2)
  $g.DrawRectangle($innerPen, 20, 20, 320, 480)
  $innerPen.Dispose()

  $nameFont = New-GameFont 27 ([System.Drawing.FontStyle]::Bold)
  $smallFont = New-GameFont 18 ([System.Drawing.FontStyle]::Bold)
  $rarityFont = New-GameFont 34 ([System.Drawing.FontStyle]::Bold)
  $nameBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 244, 193))
  $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
  $g.DrawString($character.Name, $nameFont, $nameBrush, 28, 398)
  $g.DrawString("$($character.Element) / $($character.Job)", $smallFont, $whiteBrush, 29, 440)
  $g.DrawString($character.Rarity, $rarityFont, $nameBrush, 258, 36)
  $nameFont.Dispose(); $smallFont.Dispose(); $rarityFont.Dispose(); $nameBrush.Dispose(); $whiteBrush.Dispose()
  Save-Canvas $canvas $path
}

function New-PixelCharacter($character, [string]$action, [string]$path) {
  $canvas = New-Canvas 96 96 $true
  $g = $canvas.Graphics
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
  $element = $elementColors[$character.Element]
  $dark = [System.Drawing.Color]::FromArgb(255, 25, 28, 45)
  $skin = [System.Drawing.Color]::FromArgb(255, 245, 208, 173)
  $outline = [System.Drawing.SolidBrush]::new($dark)
  $color = [System.Drawing.SolidBrush]::new($element)
  $skinBrush = [System.Drawing.SolidBrush]::new($skin)
  $g.FillRectangle($outline, 30, 10, 36, 34)
  $g.FillRectangle($skinBrush, 34, 14, 28, 26)
  $g.FillRectangle($color, 26, 42, 44, 34)
  $g.FillRectangle($outline, 30, 76, 13, 14)
  $g.FillRectangle($outline, 54, 76, 13, 14)
  $g.FillRectangle($color, 22, 48, 8, 28)
  $g.FillRectangle($color, 68, 48, 8, 28)
  if ($action -eq "walk") {
    $g.FillRectangle($outline, 22, 78, 19, 11)
    $g.FillRectangle($outline, 58, 72, 12, 18)
  }
  if ($action -eq "attack") {
    $g.FillPolygon($color, @(
      [System.Drawing.Point]::new(74, 38),
      [System.Drawing.Point]::new(94, 52),
      [System.Drawing.Point]::new(76, 60)
    ))
  }
  $g.FillRectangle($outline, 40, 25, 5, 5)
  $g.FillRectangle($outline, 54, 25, 5, 5)
  $outline.Dispose(); $color.Dispose(); $skinBrush.Dispose()
  Save-Canvas $canvas $path
}

function New-CardBack([string]$variant, [System.Drawing.Color]$accent, [string]$path) {
  $canvas = New-Canvas 360 520
  $g = $canvas.Graphics
  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 12, 30, 70))
  $g.FillRectangle($brush, 0, 0, 360, 520)
  $brush.Dispose()
  $pen = [System.Drawing.Pen]::new($accent, 12)
  $g.DrawRectangle($pen, 10, 10, 340, 500)
  $g.DrawRectangle($pen, 30, 30, 300, 460)
  $g.DrawEllipse($pen, 85, 165, 190, 190)
  $g.DrawLine($pen, 180, 100, 180, 420)
  $g.DrawLine($pen, 75, 260, 285, 260)
  $pen.Dispose()
  $font = New-GameFont 32 ([System.Drawing.FontStyle]::Bold)
  $textBrush = [System.Drawing.SolidBrush]::new($accent)
  $g.DrawString("ADVENTURER", $font, $textBrush, 48, 438)
  $font.Dispose(); $textBrush.Dispose()
  Save-Canvas $canvas $path
}

function New-UiIcon([string]$kind, [string]$path) {
  $canvas = New-Canvas 128 128 $true
  $g = $canvas.Graphics
  $gold = [System.Drawing.Color]::FromArgb(255, 255, 210, 92)
  $navy = [System.Drawing.Color]::FromArgb(255, 25, 51, 104)
  $goldBrush = [System.Drawing.SolidBrush]::new($gold)
  $navyBrush = [System.Drawing.SolidBrush]::new($navy)
  $goldPen = [System.Drawing.Pen]::new($gold, 8)
  if ($kind -eq "guild") {
    $g.FillPolygon($goldBrush, @(
      [System.Drawing.Point]::new(20, 54),
      [System.Drawing.Point]::new(64, 18),
      [System.Drawing.Point]::new(108, 54)
    ))
    $g.FillRectangle($navyBrush, 27, 52, 74, 58)
    $g.DrawRectangle($goldPen, 27, 52, 74, 58)
    $g.FillEllipse($goldBrush, 51, 61, 26, 26)
    $g.FillRectangle($goldBrush, 45, 88, 38, 16)
  } else {
    $g.FillRectangle($goldBrush, 22, 34, 84, 60)
    $g.FillEllipse($navyBrush, 32, 48, 15, 15)
    $g.FillEllipse($navyBrush, 81, 66, 15, 15)
    $g.DrawLine($goldPen, 38, 21, 38, 38)
    $g.DrawLine($goldPen, 90, 91, 90, 108)
  }
  $goldBrush.Dispose(); $navyBrush.Dispose(); $goldPen.Dispose()
  Save-Canvas $canvas $path
}

foreach ($character in $characters) {
  New-CharacterCard $character (Join-Path $cardDir "$($character.Id).png")
  foreach ($action in @("idle", "walk", "attack")) {
    New-PixelCharacter $character $action (Join-Path $pixelDir "$($character.Id)-$action.png")
  }
}

foreach ($rarity in @("C", "B", "A", "S", "SS", "SSS")) {
  $sample = $characters | Where-Object { $_.Rarity -eq $rarity } | Select-Object -First 1
  New-CharacterCard $sample (Join-Path $placeholderDir "card-$($rarity.ToLower()).png")
}

New-CardBack "normal" $rarityColors.C (Join-Path $backDir "card-back-normal.png")
New-CardBack "rare" $rarityColors.S (Join-Path $backDir "card-back-rare.png")
New-CardBack "sss" $rarityColors.SSS (Join-Path $backDir "card-back-sss.png")
New-PixelCharacter $characters[0] "idle" (Join-Path $placeholderDir "pixel-character.png")
New-UiIcon "guild" (Join-Path $uiDir "nav-adventurer-guild.png")
New-UiIcon "ticket" (Join-Path $uiDir "icon-character-ticket.png")

Write-Output "Generated adventurer placeholder assets."
