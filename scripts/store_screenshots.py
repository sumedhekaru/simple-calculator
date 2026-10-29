import asyncio, base64, os
from playwright.async_api import async_playwright

URL = 'http://127.0.0.1:8767/index.html'
OUT = 'store'
KEYMAP = {'*': '×', '/': '÷', '-': '−', 'C': 'AC', 'B': '⌫', 'P': '%', 'S': '±'}

SHOTS = [
    ('01', 'Every sum, on paper', 'A running tape keeps each calculation so you can check your work',
     list('12.5*4=') + list('+7.25=') + list('/5=') + ['C'] + list('1250*12=') + list('-2340.5=')),
    ('02', 'Percent that just works', '200 + 10% = 220, the way you would do it on paper',
     list('64.99*3=') + ['C'] + list('200+10') + ['P']),
    ('03', 'Big, calm, easy to read', 'Thousands separators and large ink numerals',
     list('1250*12=') + ['C'] + list('86400*7*')),
    ('04', 'Fix typos, not totals', 'Delete the last digit with ⌫ and keep going',
     list('19.99+5.5=') + ['C'] + list('3456') + ['B']),
]


async def press(pg, keys):
    for k in keys:
        await pg.get_by_test_id(f'button-{KEYMAP.get(k, k)}').click()


async def capture(browser, w, h, scale, prefix):
    paths = []
    for sid, _, _, keys in SHOTS:
        pg = await browser.new_page(viewport={'width': w, 'height': h}, device_scale_factor=scale)
        await pg.goto(URL)
        await pg.wait_for_timeout(1000)
        await press(pg, keys)
        await pg.wait_for_timeout(500)
        path = f'{OUT}/raw-{prefix}-{sid}.png'
        await pg.screenshot(path=path)
        paths.append(path)
        await pg.close()
    return paths


def uri(path):
    return 'data:image/png;base64,' + base64.b64encode(open(path, 'rb').read()).decode()


def frame_html(raw, title, sub, w, h, raw_w, raw_h, tablet=False):
    sh = int(h * (0.74 if tablet else 0.75))
    sw = int(sh * raw_w / raw_h)
    phone_top = int(h * (0.205 if tablet else 0.215))
    radius = int(sw * (0.05 if tablet else 0.12))
    bezel = int(sw * 0.022)
    title_px = int(w * (0.062 if tablet else 0.089))
    sub_px = int(w * (0.026 if tablet else 0.039))
    top = int(h * 0.05)
    left = (w - sw) // 2
    return f"""<div style="width:{w}px;height:{h}px;position:relative;overflow:hidden;
      background:radial-gradient(120% 70% at 50% 15%, #2B4E7A 0%, #1F3A5F 50%, #152A45 100%);
      font-family:'Inter Display','Inter',sans-serif">
      <div style="position:absolute;top:{top}px;left:0;right:0;text-align:center;padding:0 {int(w*0.07)}px">
        <div style="font-weight:800;font-size:{title_px}px;line-height:1.05;letter-spacing:-0.03em;color:#F6F1E7">{title}</div>
        <div style="font-weight:500;font-size:{sub_px}px;line-height:1.3;color:#9FD8CF;margin-top:{int(h*0.012)}px">{sub}</div>
      </div>
      <div style="position:absolute;left:{left-bezel}px;top:{phone_top-bezel}px;width:{sw+2*bezel}px;height:{sh+2*bezel}px;
        border-radius:{radius+bezel}px;background:#0E1B2C;box-shadow:0 40px 120px rgba(0,0,0,.45)"></div>
      <img src="{uri(raw)}" style="position:absolute;left:{left}px;top:{phone_top}px;width:{sw}px;height:{sh}px;border-radius:{radius}px"/>
    </div>"""


async def frame(browser, raws, w, h, raw_w, raw_h, name, tablet=False):
    for (sid, title, sub, _), raw in zip(SHOTS, raws):
        pg = await browser.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1)
        await pg.set_content('<html><body style="margin:0">' + frame_html(raw, title, sub, w, h, raw_w, raw_h, tablet) + '</body></html>')
        await pg.wait_for_timeout(200)
        await pg.screenshot(path=f'{OUT}/{name}-{sid}.png', clip={'x': 0, 'y': 0, 'width': w, 'height': h})
        await pg.close()


async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        phone = await capture(b, 440, 956, 3, 'iphone')
        tablet = await capture(b, 1032, 1376, 2, 'ipad')
        await frame(b, phone, 1320, 2868, 1320, 2868, 'iphone-6.9')
        await frame(b, phone, 1206, 2622, 1320, 2868, 'iphone-6.3')
        await frame(b, tablet, 2064, 2752, 2064, 2752, 'ipad-13', tablet=True)
        await b.close()

asyncio.run(main())
