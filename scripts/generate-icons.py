from PIL import Image, ImageDraw, ImageFont
import os

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets')

def create_rounded_square(size, color, radius_ratio=0.22):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(size * radius_ratio)
    draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=color)
    return img

def create_icon(size):
    # Dark rounded square background
    img = create_rounded_square(size, '#1c1c1c')
    draw = ImageDraw.Draw(img)

    # Orange inner circle
    margin = int(size * 0.18)
    circle_box = [margin, margin, size - margin, size - margin]
    draw.ellipse(circle_box, fill='#ff9f0a')

    # White equals sign
    bar_width = int(size * 0.38)
    bar_height = int(size * 0.075)
    gap = int(size * 0.09)
    center_x = size // 2
    center_y = size // 2

    top_bar = [
        center_x - bar_width // 2,
        center_y - gap // 2 - bar_height // 2,
        center_x + bar_width // 2,
        center_y - gap // 2 + bar_height // 2,
    ]
    bottom_bar = [
        center_x - bar_width // 2,
        center_y + gap // 2 - bar_height // 2,
        center_x + bar_width // 2,
        center_y + gap // 2 + bar_height // 2,
    ]
    draw.rounded_rectangle(top_bar, radius=bar_height // 2, fill='#ffffff')
    draw.rounded_rectangle(bottom_bar, radius=bar_height // 2, fill='#ffffff')

    return img

def save(img, filename):
    path = os.path.join(ASSETS_DIR, filename)
    img.save(path)
    print(f'Saved {path}')

if __name__ == '__main__':
    icon = create_icon(1024)
    save(icon, 'icon.png')

    splash = create_icon(512)
    save(splash, 'splash-icon.png')

    favicon = create_icon(64)
    save(favicon, 'favicon.png')

    # Android foreground
    fg = create_icon(432)
    save(fg, 'android-icon-foreground.png')

    # Android background
    bg = Image.new('RGBA', (432, 432), '#1c1c1c')
    save(bg, 'android-icon-background.png')

    # Android monochrome
    mono = Image.new('RGBA', (432, 432), (0, 0, 0, 0))
    draw = ImageDraw.Draw(mono)
    margin = int(432 * 0.18)
    draw.ellipse([margin, margin, 432 - margin, 432 - margin], outline='#ffffff', width=24)
    bar_width = int(432 * 0.38)
    bar_height = int(432 * 0.075)
    gap = int(432 * 0.09)
    cx, cy = 432 // 2, 432 // 2
    draw.rounded_rectangle(
        [cx - bar_width // 2, cy - gap // 2 - bar_height // 2,
         cx + bar_width // 2, cy - gap // 2 + bar_height // 2],
        radius=bar_height // 2, outline='#ffffff', width=20
    )
    draw.rounded_rectangle(
        [cx - bar_width // 2, cy + gap // 2 - bar_height // 2,
         cx + bar_width // 2, cy + gap // 2 + bar_height // 2],
        radius=bar_height // 2, outline='#ffffff', width=20
    )
    save(mono, 'android-icon-monochrome.png')
