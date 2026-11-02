"""
Run from your website root folder (the one that contains index.html and assets/):

    pip install pillow
    python optimize_images.py

It converts every .jpg/.jpeg/.png in assets/ to a smaller .webp, resizes big
photos, and updates the file names inside index.html, style.css and script.js.
Your original images are NOT deleted (delete them yourself after checking).
"""
import os, re
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(ROOT, "assets")
SKIP = ("output-image",)          # favicon stays as-is
MAX_PHOTO = 1400                  # px wide for big photos
MAX_ICON = 600                    # px wide for files in assets/wife/ (small icons)
QUALITY = 75

renames = {}
before = after = 0

for folder, _, files in os.walk(ASSETS):
    for name in files:
        base, ext = os.path.splitext(name)
        if ext.lower() not in (".jpg", ".jpeg", ".png") or any(k in base for k in SKIP):
            continue
        src = os.path.join(folder, name)
        dst = os.path.join(folder, base + ".webp")
        limit = MAX_ICON if os.path.basename(folder) == "wife" else MAX_PHOTO
        im = Image.open(src)
        if im.width > limit:
            im = im.resize((limit, round(im.height * limit / im.width)), Image.LANCZOS)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.mode else "RGB")
        im.save(dst, "WEBP", quality=QUALITY, method=6)
        before += os.path.getsize(src); after += os.path.getsize(dst)
        rel = os.path.relpath(src, ROOT).replace("\\", "/")
        renames[rel] = os.path.relpath(dst, ROOT).replace("\\", "/")
        print(f"{rel}: {os.path.getsize(src)//1024} KB -> {os.path.getsize(dst)//1024} KB")

for fname in ("index.html", "style.css", "script.js"):
    path = os.path.join(ROOT, fname)
    text = open(path, encoding="utf-8").read()
    for old, new in renames.items():
        text = text.replace(old, new)
    open(path, "w", encoding="utf-8").write(text)

print(f"\nDone. {before//1024} KB -> {after//1024} KB  (saved {(before-after)//1024} KB)")
