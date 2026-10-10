"""Google Play subscription icons (512x512, 32-bit PNG): the AI Academy app
icon with a gold "MONTHLY" / "YEARLY" band, so each product has its own image
using only the app's own branding.
Run: python tool/brand/make_subscription_icons.py  (needs Pillow)."""
import os
from PIL import Image, ImageDraw, ImageFont

GREEN = (11, 61, 46)
GOLD = (209, 160, 84)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "docs/play-store/subscriptions")
AV = "/System/Library/Fonts/Avenir Next.ttc"
SIZE = 512

base = Image.open(os.path.join(ROOT, "assets/brand/app_icon.png")).convert("RGBA").resize((SIZE, SIZE), Image.LANCZOS)
for label in ("MONTHLY", "YEARLY"):
    img = base.copy()
    d = ImageDraw.Draw(img)
    band = 112
    d.rectangle((0, SIZE - band, SIZE, SIZE), fill=GOLD + (255,))
    f = ImageFont.truetype(AV, 64, index=0)  # Avenir Next Bold
    d.text((SIZE / 2, SIZE - band / 2), label, font=f, fill=GREEN + (255,), anchor="mm")
    path = os.path.join(OUT, f"{label.lower()}_512.png")
    img.save(path, "PNG")
    print(path, img.size, img.mode)
