"""Draws the AI Academy logo and every derived asset from geometry.

Run:  python tool/brand/make_logo.py   (needs Pillow)
Outputs into assets/brand/: app_icon.png (1024, opaque, for iOS/Android/web),
icon_foreground.png (transparent, Android adaptive icon), splash_logo.png.
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter

GREEN_TOP = (16, 84, 64)      # lighter corner of the background gradient
GREEN = (11, 61, 46)          # AppColors.darkGreen  #0B3D2E
GREEN_DEEP = (6, 38, 29)
GOLD = (209, 160, 84)         # AppColors.accentGold #D1A054
GOLD_LIGHT = (232, 192, 120)
WHITE = (247, 249, 246)       # AppColors.nearWhite  #F7F9F6

SS = 4                        # supersampling factor for smooth edges
N = 1024 * SS


def p(x, y):
    """Design coordinates are on a 1024 grid."""
    return (x * SS, y * SS)


def background():
    """Diagonal green gradient with a soft glow behind the mark."""
    img = Image.new("RGB", (N, N))
    px = img.load()
    for y in range(0, N, SS):
        for x in range(0, N, SS):
            t = (x + y) / (2 * N)
            c = tuple(int(GREEN_TOP[i] * (1 - t) + GREEN_DEEP[i] * t) for i in range(3))
            for dy in range(SS):
                for dx in range(SS):
                    px[x + dx, y + dy] = c
    glow = Image.new("L", (N, N), 0)
    ImageDraw.Draw(glow).ellipse([*p(212, 190), *p(812, 790)], fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(90 * SS))
    img.paste(Image.new("RGB", (N, N), (40, 120, 90)), mask=glow)
    return img


def draw_mark(img):
    d = ImageDraw.Draw(img)

    # Mortarboard: top plate (rhombus) with a lighter top face.
    cx, cy = 512, 478
    top = [p(cx, cy - 150), p(cx + 330, cy), p(cx, cy + 150), p(cx - 330, cy)]
    d.polygon(top, fill=GOLD)
    inner = [p(cx, cy - 118), p(cx + 262, cy), p(cx, cy + 118), p(cx - 262, cy)]
    d.polygon(inner, fill=GOLD_LIGHT)

    # Cap body under the plate.
    body = [p(cx - 200, cy + 70), p(cx + 200, cy + 70),
            p(cx + 200, cy + 215), p(cx - 200, cy + 215)]
    d.polygon(body, fill=GOLD)
    d.ellipse([*p(cx - 200, cy + 160), *p(cx + 200, cy + 270)], fill=GOLD)
    # Re-draw the plate's front edge so it overlaps the body cleanly.
    d.polygon([p(cx - 330, cy), p(cx, cy + 150), p(cx + 330, cy),
               p(cx + 330, cy + 14), p(cx, cy + 164), p(cx - 330, cy + 14)], fill=GREEN_DEEP)
    d.polygon(top, fill=GOLD)
    d.polygon(inner, fill=GOLD_LIGHT)

    # Button at the centre of the plate.
    d.ellipse([*p(cx - 22, cy - 22), *p(cx + 22, cy + 22)], fill=GOLD)

    # Tassel cord becomes a small neural network (the "AI").
    w = 26 * SS
    a = (cx, cy)
    b = (cx + 250, cy + 60)
    n1 = (cx + 262, cy + 250)
    n2 = (cx + 180, cy + 330)
    n3 = (cx + 330, cy + 345)
    for (x1, y1), (x2, y2) in [(a, b), (b, n1), (n1, n2), (n1, n3), (n2, n3)]:
        d.line([p(x1, y1), p(x2, y2)], fill=GOLD, width=w)
    for (x, y), r in [(b, 18), (n1, 30), (n2, 24), (n3, 24)]:
        d.ellipse([*p(x - r, y - r), *p(x + r, y + r)], fill=GOLD)
        d.ellipse([*p(x - r * 0.45, y - r * 0.45), *p(x + r * 0.45, y + r * 0.45)],
                  fill=GREEN if r > 20 else GOLD_LIGHT)

    # Four-point spark (AI) above-left of the cap.
    sx, sy, R, r = 300, 250, 80, 21
    pts = []
    for k in range(8):
        ang = math.pi / 4 * k - math.pi / 2
        rad = R if k % 2 == 0 else r
        pts.append(p(sx + rad * math.cos(ang), sy + rad * math.sin(ang)))
    d.polygon(pts, fill=WHITE)
    sx2, sy2, R2, r2 = 398, 172, 36, 10
    pts = []
    for k in range(8):
        ang = math.pi / 4 * k - math.pi / 2
        rad = R2 if k % 2 == 0 else r2
        pts.append(p(sx2 + rad * math.cos(ang), sy2 + rad * math.sin(ang)))
    d.polygon(pts, fill=WHITE)


def main():
    out = os.path.join(os.path.dirname(__file__), "..", "..", "assets", "brand")
    os.makedirs(out, exist_ok=True)

    icon = background()
    draw_mark(icon)
    icon.resize((1024, 1024), Image.LANCZOS).save(os.path.join(out, "app_icon.png"))

    # Transparent mark only, shrunk into the adaptive-icon safe zone (66%).
    mark = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    draw_mark(mark)
    fg = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    small = mark.resize((int(N * 0.66), int(N * 0.66)), Image.LANCZOS)
    fg.paste(small, ((N - small.width) // 2, (N - small.height) // 2), small)
    fg.resize((1024, 1024), Image.LANCZOS).save(os.path.join(out, "icon_foreground.png"))

    # Splash: the mark on transparency (background colour set by the splash).
    mark.resize((768, 768), Image.LANCZOS).save(os.path.join(out, "splash_logo.png"))

    # Android 12+ crops the splash icon to a circle ~2/3 of its canvas, so
    # shrink the mark to fit inside it (otherwise the spark/tassel get cut).
    a12 = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    small = mark.resize((int(N * 0.60), int(N * 0.60)), Image.LANCZOS)
    a12.paste(small, ((N - small.width) // 2, (N - small.height) // 2), small)
    a12.resize((960, 960), Image.LANCZOS).save(os.path.join(out, "splash_logo_android12.png"))
    print("wrote", os.path.abspath(out))


if __name__ == "__main__":
    main()
