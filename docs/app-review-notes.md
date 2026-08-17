# App Review Notes — Simple Best Calculator

Reference material for the "Notes for Review" field in App Store Connect, plus
a record of testing performed so it can be reused for future submissions.

## Paste into "Notes for Review"

> Simple Best Calculator is a basic four-function calculator (add, subtract,
> multiply, divide) for general consumer use — anyone who needs quick
> arithmetic, no specific niche audience.
>
> There is no account system, no login, and nothing to set up: launch the app
> and start calculating.
>
> The app makes no network calls and uses no external services, data
> providers, authentication services, payment processors, or AI services of
> any kind — it is fully self-contained and works offline. There is no
> in-app purchase or subscription.
>
> The app has no regional variation; it behaves identically everywhere. It
> does not operate in a regulated industry and includes no third-party
> protected material.
>
> Devices/OS tested: iPhone 17 Pro Max, physical device, iOS 26.5.2; and
> iPhone 17 Pro Simulator, iOS 26.5. See "Testing" below for the full
> record.

## Testing

### Automated — unit tests (`npm test`, Jest, `jest.logic.config.js`)

Run in a Linux CI-style sandbox (no simulator required — pure logic tests
against `src/logic/calculator.ts`).

- Date: 2026-08-17
- Result: **17/17 passed**
- Coverage: empty display on start, digit input, digit chaining, leading-zero
  handling, single decimal point, new-number-from-decimal, operator set +
  continued input, addition, subtraction, multiplication, division, division
  by zero → `Error`, chained operations, clear, decimal precision limiting,
  operator-replace on repeated operator press, recovery from `Error` by
  pressing an operator.

### Manual — iOS Simulator

- Date: 2026-08-17
- Device/OS: **iPhone 17 Pro Simulator, iOS 26.5** (Xcode Simulator app)
- Delivery method: `npx expo start --ios` → Expo Go 55.0.34 (SDK 54
  project; Expo Go prompted to install the SDK-54-recommended 54.0.7 build
  but 55.0.34 was used and ran the app without issue)
- Build note: `npx expo run:ios` (native build via CocoaPods/xcodebuild)
  failed on this machine because the CocoaPods CLI is not installed
  (`gem install cocoapods` and `brew install cocoapods` both failed —
  Homebrew itself is not installed either). Since the app has no custom
  native modules, Expo Go was used instead and is sufficient for
  functional verification. To exercise the true native build (recommended
  before archiving for release), install Homebrew and CocoaPods first:
  `brew install cocoapods`.
- Flows exercised and results, all correct:
  - Launch → display shows `0`
  - Chained addition: `7 + 5 =` → `12`
  - Decimal input + addition: `3 . 1 + 1 =` → `4.1`
  - Division by zero: `8 ÷ 0 =` → `Error`
  - Error recovery: pressing `−` after `Error` resets display to `0`
  - Clear (`C`) resets display to `0`

### Manual — physical device (iPhone 17 Pro Max, iOS 26.5.2)

- Date: 2026-08-17
- Device/OS: **iPhone 17 Pro Max, iOS 26.5.2** (real hardware, connected
  for testing; controlled via iPhone Mirroring on macOS)
- Delivery method: Expo Go native loading could not be used — the device
  did not auto-discover the Metro dev server (no LAN Bonjour listing
  under Expo Go's "Development servers"), and the terminal's QR code
  can't be scanned in a mirrored/remote session. As a working substitute,
  the same Metro dev server's **web bundle** was loaded directly in
  Mobile Safari at `http://192.168.4.30:8081`, which served and ran the
  identical React/TypeScript calculator code (`Web Bundled ... index.ts
  (220 modules)` in the Metro log). This exercises the real app logic on
  real hardware, but note it is Safari-hosted, not the native iOS host
  process — for the actual App Review screen recording, Expo Go should be
  used natively (see "Still open" below) or a TestFlight/native build.
- Flows exercised and results, all correct (mirrors the Simulator run):
  - Launch → display shows `0`
  - Chained addition: `7 + 5 =` → `12`
  - Division by zero: `8 ÷ 0 =` → `Error`
- Expo Go 55.0.34 (or later) was installed on the device from the App
  Store during this session (previously not installed).

### Still open for a future submission

- [ ] Install Homebrew + CocoaPods on the build machine and confirm
      `npx expo run:ios` succeeds as a true native build (not just Expo Go),
      then re-test on that build.
- [x] Test on a physical device — done 2026-08-17 on iPhone 17 Pro Max,
      iOS 26.5.2 (via Safari/Metro web bundle; see above). Still worth
      re-running natively in Expo Go once LAN discovery or a USB-connected
      `expo run:ios --device` build is working, since Apple's requested
      recording should show the real native app, not the Safari fallback.
- [ ] Capture the actual screen recording for App Review of: launch → a
      chained calculation → decimal input → divide-by-zero — ideally
      recorded natively (native build or Expo Go), not via Safari.
- [ ] Decide on `ios.supportsTablet` in `app.json` — it's currently `true`
      but no iPad screenshots exist yet (see `marketing/screenshots/README.md`).
      Either add iPad screenshots or set `supportsTablet: false`.
