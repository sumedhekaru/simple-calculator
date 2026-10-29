from PIL import Image, ImageDraw
import os

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets')

INK = '#1F3A5F'
PAPER = '#F6F1E7'
FAINT = '#9AA5B1'
ACCENT = '#2A9D8F'
SUPERSAMPLE = 4


def receipt_outline(box, teeth):
    left, top, right, bottom = box
    tooth_w = (right - left) / teeth
    tooth_h = tooth_w * 0.55
    points = [(left, top), (right, top), (right, bottom)]
    for i in range(teeth):
        x_right = right - i * tooth_w
        points.append((x_right - tooth_w / 2, bottom - tooth_h))
        points.append((x_right - tooth_w, bottom))
    points.append((left, top))
    return points


def draw_receipt(draw, size, paper, line, total, accent, inset=0.0):
    def px(v):
        return v * size

    scale = 1 - 2 * inset

    def sx(v):
        return px(inset + v * scale)

    left, right = sx(0.22), sx(0.78)
    top, bottom = sx(-0.06), sx(0.80)
    draw.polygon(receipt_outline((left, top, right, bottom), 7), fill=paper)

    bar_h = px(0.045 * scale)
    radius = bar_h / 2
    rows = [(0.17, 0.24), (0.29, 0.18), (0.41, 0.22)]
    for y, width in rows:
        draw.rounded_rectangle(
            (sx(0.29), sx(y), sx(0.29 + width), sx(y) + bar_h), radius=radius, fill=line
        )
        draw.rounded_rectangle(
            (sx(0.61), sx(y), sx(0.71), sx(y) + bar_h), radius=radius, fill=total
        )

    dash_y = sx(0.515)
    x = sx(0.29)
    while x < sx(0.71):
        draw.rounded_rectangle(
            (x, dash_y, min(x + px(0.03 * scale), sx(0.71)), dash_y + px(0.012 * scale)),
            radius=px(0.006 * scale),
            fill=line,
        )
        x += px(0.05 * scale)

    for y in (0.585, 0.645):
        draw.rounded_rectangle(
            (sx(0.29), sx(y), sx(0.41), sx(y) + bar_h), radius=radius, fill=accent
        )
    draw.rounded_rectangle(
        (sx(0.47), sx(0.575), sx(0.71), sx(0.69)), radius=px(0.02 * scale), fill=total
    )


def render(size, background, paper, line, total, accent, inset=0.0, rounded=False):
    big = size * SUPERSAMPLE
    img = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    if background:
        if rounded:
            draw.rounded_rectangle((0, 0, big, big), radius=int(big * 0.22), fill=background)
        else:
            draw.rectangle((0, 0, big, big), fill=background)
    draw_receipt(draw, big, paper, line, total, accent, inset)
    if rounded:
        mask = Image.new('L', (big, big), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, big, big), radius=int(big * 0.22), fill=255)
        img.putalpha(Image.composite(img.getchannel('A'), mask, mask))
    return img.resize((size, size), Image.LANCZOS)


def save(img, filename):
    path = os.path.join(ASSETS_DIR, filename)
    img.save(path)
    print(f'Saved {path}')


if __name__ == '__main__':
    icon = render(1024, INK, PAPER, FAINT, INK, ACCENT).convert('RGB')
    save(icon, 'icon.png')

    save(render(512, INK, PAPER, FAINT, INK, ACCENT, rounded=True), 'splash-icon.png')
    save(render(64, INK, PAPER, FAINT, INK, ACCENT, rounded=True), 'favicon.png')

    save(render(432, None, PAPER, FAINT, INK, ACCENT, inset=0.17), 'android-icon-foreground.png')
    save(Image.new('RGBA', (432, 432), INK), 'android-icon-background.png')

    mono = render(432, None, '#FFFFFF', (0, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0), inset=0.17)
    save(mono, 'android-icon-monochrome.png')
