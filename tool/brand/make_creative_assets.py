"""App Store creative assets: product page header (3840x1646) and search
results asset (3840x2560), in the AI Academy brand, from real screenshots.
Run: python tool/brand/make_creative_assets.py  (needs Pillow)."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

GREEN = (11, 61, 46)
DEEP = (6, 38, 29)
GOLD = (209, 160, 84)
CREAM = (247, 249, 246)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "docs/app-store/creative")
SHOTS = {
    "tutor": "docs/app-store/screenshots/ios/v2/07_ai_tutor.png",
    "exam": "docs/us-k12/screenshots/c3_exam_marked.png",
    "course": "docs/app-store/screenshots/ios/v2/03_course.png",
}
AV = "/System/Library/Fonts/Avenir Next.ttc"


def font(size, weight="Bold"):
    idx = {"Regular": 7, "Medium": 5, "Demi": 2, "Bold": 0, "Heavy": 8}.get(weight, 0)
    for i in (idx, 0):
        try:
            f = ImageFont.truetype(AV, size, index=i)
            if weight.lower() in f.getname()[1].lower() or i == 0:
                return f
        except OSError:
            pass
    return ImageFont.truetype(AV, size)


def background(w, h, network=True):
    img = Image.new("RGB", (w, h), GREEN)
    # Soft radial glow behind the phones and a darker edge.
    glow = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(glow)
    d.ellipse((int(w * 0.35), int(-h * 0.3), int(w * 1.15), int(h * 1.2)), fill=170)
    glow = glow.filter(ImageFilter.GaussianBlur(w // 10))
    img = Image.composite(Image.new("RGB", (w, h), (24, 96, 72)), img, glow)
    edge = Image.new("L", (w, h), 0)
    ImageDraw.Draw(edge).rectangle((0, 0, w, h), fill=0)
    vign = Image.new("L", (w, h), 255)
    ImageDraw.Draw(vign).rounded_rectangle((w * 0.04, h * 0.06, w * 0.96, h * 0.94), radius=h // 3, fill=0)
    vign = vign.filter(ImageFilter.GaussianBlur(w // 14))
    img = Image.composite(Image.new("RGB", (w, h), DEEP), img, vign)
    if not network:
        return img
    # Fine gold network lines (echoes the logo's node tassel).
    d = ImageDraw.Draw(img)
    pts = [(0.08, 0.18), (0.16, 0.10), (0.24, 0.22), (0.12, 0.82), (0.22, 0.90), (0.30, 0.78),
           (0.92, 0.12), (0.97, 0.30), (0.88, 0.86)]
    P = [(int(x * w), int(y * h)) for x, y in pts]
    for a, b in [(0, 1), (1, 2), (0, 2), (3, 4), (4, 5), (3, 5), (6, 7)]:
        d.line([P[a], P[b]], fill=(64, 104, 82), width=max(2, w // 900))
    for p in P:
        r = max(5, w // 420)
        d.ellipse((p[0] - r, p[1] - r, p[0] + r, p[1] + r), fill=(120, 110, 70))
    return img


def phone(path, height):
    """A screenshot in a rounded phone frame with a soft shadow, as RGBA."""
    shot = Image.open(os.path.join(ROOT, path)).convert("RGB")
    sw = int(height * shot.width / shot.height)
    shot = shot.resize((sw, height), Image.LANCZOS)
    bezel = max(14, height // 55)
    W, H = sw + 2 * bezel, height + 2 * bezel
    r_out, r_in = int(W * 0.16), int(sw * 0.14)
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(frame).rounded_rectangle((0, 0, W - 1, H - 1), radius=r_out, fill=(18, 20, 20, 255))
    mask = Image.new("L", (sw, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, sw - 1, height - 1), radius=r_in, fill=255)
    frame.paste(shot, (bezel, bezel), mask)
    pad = H // 6
    out = Image.new("RGBA", (W + 2 * pad, H + 2 * pad), (0, 0, 0, 0))
    sh = Image.new("L", out.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle((pad, pad + H // 40, pad + W, pad + H + H // 40), radius=r_out, fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(H // 30))
    out.paste((0, 0, 0, 255), (0, 0), sh)
    out.alpha_composite(frame, (pad, pad))
    return out, pad


def place(canvas, path, height, cx, top, angle=0):
    ph, pad = phone(path, height)
    if angle:
        ph = ph.rotate(angle, resample=Image.BICUBIC, expand=True)
    canvas.alpha_composite(ph, (int(cx - ph.width / 2), int(top - pad)))


def text_block(d, x, y, lines, anchor="la"):
    for txt, f, color, gap in lines:
        d.text((x, y), txt, font=f, fill=color, anchor=anchor)
        y += f.size + gap
    return y


def chips(d, x, y, labels, f, center=False, total_w=None):
    padx, pady, gap = int(f.size * 0.7), int(f.size * 0.38), int(f.size * 0.55)
    widths = [d.textlength(t, font=f) + 2 * padx for t in labels]
    if center:
        x = x - (sum(widths) + gap * (len(labels) - 1)) / 2
    for t, wdt in zip(labels, widths):
        h = f.size + 2 * pady
        d.rounded_rectangle((x, y, x + wdt, y + h), radius=h // 2, outline=GOLD, width=max(3, f.size // 14))
        d.text((x + wdt / 2, y + h / 2), t, font=f, fill=CREAM, anchor="mm")
        x += wdt + gap


def header():
    W, H = 3840, 1646
    img = background(W, H).convert("RGBA")
    # Phones on the right, inside the central safe area.
    place(img, SHOTS["course"], 1040, 2470, 350, angle=6)
    place(img, SHOTS["exam"], 1040, 3200, 350, angle=-6)
    place(img, SHOTS["tutor"], 1230, 2835, 205)
    d = ImageDraw.Draw(img)
    x = 470
    y = text_block(d, x, 440, [
        ("AI ACADEMY", font(62, "Demi"), GOLD, 40),
        ("Learn AI.", font(150, "Bold"), CREAM, 8),
        ("Ace your curriculum.", font(150, "Bold"), CREAM, 56),
        ("Practical AI courses with a personal AI Tutor,", font(60, "Medium"), (214, 226, 219), 16),
        ("plus Cambridge and US curriculum practice.", font(60, "Medium"), (214, 226, 219), 64),
    ])
    chips(d, x, y, ["180+ courses", "AI Tutor", "Exam practice", "Certificates"], font(50, "Demi"))
    img.convert("RGB").save(os.path.join(OUT, "header_3840x1646.png"))


def search():
    W, H = 3840, 2560
    img = background(W, H, network=False).convert("RGBA")
    d = ImageDraw.Draw(img)
    y = text_block(d, W // 2, 250, [
        ("AI ACADEMY", font(78, "Demi"), GOLD, 46),
        ("Learn AI. Ace your curriculum.", font(190, "Bold"), CREAM, 50),
        ("A personal AI Tutor, 180+ practical courses and Cambridge & US exam practice", font(74, "Medium"), (214, 226, 219), 60),
    ], anchor="ma")
    chips(d, W // 2, y, ["AI Tutor", "180+ courses", "IGCSE & A Level", "US grades 8–12", "Certificates"], font(60, "Demi"), center=True)
    place(img, SHOTS["course"], 1350, W // 2 - 900, 1050, angle=5)
    place(img, SHOTS["exam"], 1350, W // 2 + 900, 1050, angle=-5)
    place(img, SHOTS["tutor"], 1520, W // 2, 930)
    img.convert("RGB").save(os.path.join(OUT, "search_3840x2560.png"))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    header()
    search()
    print("written to", OUT)
