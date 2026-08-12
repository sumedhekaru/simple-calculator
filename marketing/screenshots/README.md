# App Store Screenshots

Apple only strictly requires screenshots for the **largest display size** in each device family you support — App Store Connect auto-scales them down for smaller devices. Verify exact current sizes in App Store Connect at submission time (Apple revises these when new hardware ships); the sizes below are current as of this writing.

## Required: iPhone 6.9" display

- Resolution: **1320 × 2868 px** (portrait)
- At least 1 screenshot, up to 10
- Suggested filenames: `iphone-6.9-01.png`, `iphone-6.9-02.png`, ...

## Conditionally required: iPad 13" display

`app.json` currently sets `ios.supportsTablet: true`, which means Apple will expect iPad screenshots too.

- Resolution: **2064 × 2752 px** (portrait)
- Suggested filenames: `ipad-13-01.png`, `ipad-13-02.png`, ...

**Decision needed:** either capture iPad screenshots, or set `supportsTablet: false` in `app.json` / restrict the App Store Connect listing to iPhone-only if the app isn't meant to be an iPad experience.

## How to capture

Easiest path is the iOS Simulator:

```bash
npx expo run:ios --device "iPhone 16 Pro Max"
```

Then in Simulator: `Cmd+S` saves a screenshot straight to your Desktop at the correct resolution for that device.

## Suggested shots (3–5 is plenty for a calculator app)

1. Default state, clean display
2. Mid-calculation with a chained operation entered
3. Division-by-zero showing the `Error` state
4. (optional) Result of a completed calculation
