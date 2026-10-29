# Development Log

## 2026-07-14

### Initial Plan Review
- Reviewed `plan.md` for a simple Expo + React Native calculator app.
- Confirmed the project is at the planning stage — no code scaffolded yet.
- Strengthened the plan with:
  - `Design & UX` section (layout, theme, formatting, button grid).
  - State shape note for core logic: `currentInput`, `previousValue`, `operator`, `result`.
  - Deployment milestone marked as optional.
  - Note to keep logic pure and separate from UI components.

### Project Setup
- Initialized Expo SDK 57 project with TypeScript blank template.
- Installed testing dependencies: `jest`, `ts-jest`, `@types/jest`.
- Added web support dependencies: `react-dom`, `react-native-web`, `@expo/metro-runtime`.
- Configured Jest with `jest.logic.config.js` for pure logic tests.

### Core Logic (TDD)
- Created `src/logic/calculator.ts` with pure `calculate()` reducer.
- State shape: `display`, `previousValue`, `operator`, `isNewEntry`.
- Wrote 16 unit tests covering digits, decimals, operators, equals, clear, division by zero, chaining, and precision.
- All logic tests pass.

### UI Components
- Created `Button`, `Display`, and `Calculator` screen components.
- Implemented dark theme with orange operators/equals and grey clear button.
- Layout uses a classic calculator grid with a tall equals button spanning rows.

### Integration Testing
- Attempted to configure React Native component tests with `jest-expo` and `@testing-library/react-native`.
- Hit upstream issue: `jest-expo` SDK 57 setup file imports untransformed TypeScript from `expo-modules-core`.
- Worked around by relying on logic-level tests that exercise full user flows (`2 + 2 = 4`, `10 / 0 = Error`, clear).

### Verification
- Ran web preview successfully with `npx expo start --web`.
- TypeScript compiles cleanly (`npx tsc --noEmit`).

### App Configuration
- Added iOS bundle identifier and Android package name to `app.json`.
- Wrote `README.md` with setup, test, and deployment instructions.

### SDK Downgrade (Post-Verification)
- User's Expo Go app (v54.0.8) only supports SDK 54 projects.
- Downgraded from Expo SDK 57 to SDK 54.
- Updated compatible dependencies: `expo@~54.0.0`, `react@19.1.0`, `react-native@0.81.5`.
- Cleaned up dev dependencies to remove SDK 57-only packages.
- Reinstalled dependencies and verified tests + TypeScript still pass.
- Confirmed Metro starts cleanly with no Expo Go compatibility errors.

### Icon & Splash
- Generated custom calculator-themed icons with a Python/Pillow script (`scripts/generate-icons.py`).
- Replaced `icon.png`, `splash-icon.png`, `favicon.png`, and Android adaptive icon assets.
- Updated `app.json` splash and Android adaptive icon background color to match dark theme.

### Bug Fix
- Fixed recovery from `Error` state: pressing an operator after `Error` now resets and starts a fresh calculation instead of staying stuck on `Error`.
- Added regression test for the fix.

### Play Store Prep
- Updated app name to "Simple Calculator" and slug to `simple-calculator`.
- Added Android `versionCode: 1` and bundle/package identifiers.
- Created `eas.json` with `development`, `preview` (APK), and `production` (AAB) build profiles.
- Added `build:android` and `build:android:preview` npm scripts.
- Updated `README.md` with EAS build and Play Store submission steps.

### Android Navigation Bar Fix
- User reported bottom calculator row overlapped Android system navigation bar (S25 Ultra).
- Installed `react-native-safe-area-context`.
- Wrapped app in `SafeAreaProvider` and replaced outer `View` in `Calculator` with `SafeAreaView` using `edges={['bottom', 'left', 'right']}`.
- Verified TypeScript and tests still pass.

### Git Commit & Push
- Reviewed `.gitignore` and added `.eas/build/` entry.
- Committed all changes with message: "feat: complete calculator app with SDK 54, icons, bug fixes, and EAS config".
- Pushed to `origin/main` at `github.com:sumedhekaru/simple-calculator.git`.

### EAS Configuration
- Ran `npx eas build:configure` and linked project to EAS project `8ce8e5e3-2a9c-45e5-b692-ba51378ef3fd`.
- Committed and pushed updated `app.json` with EAS project ID.
- Removed local `eas-cli` dependency (per `expo-doctor` recommendation) and installed `eas-cli` globally.

### Local Android Build Setup
- Installed Android command line tools and Eclipse Temurin JDK 17 via Homebrew.
- Set `ANDROID_HOME` and `JAVA_HOME` environment variables in `~/.zshrc`.
- Installed Android SDK platform 36, build-tools 36.0.0, and NDK 27.1.12297006.
- Ran `npx expo prebuild --platform android` to generate the native Android project.
- Created `android/local.properties` pointing to the Android SDK.
- Built release AAB successfully with `./gradlew bundleRelease`.
- Output: `android/app/build/outputs/bundle/release/app-release.aab`.

### Play Store Signing Fix
- Play Console rejected first AAB because it was signed with the debug keystore.
- Generated release keystore at `android/app/release.keystore`.
- Created `android/keystore.properties` and configured `android/app/build.gradle` to use release signing config.
- Rebuilt AAB with release signing; verified with `jarsigner -verify`.
- Updated README with keystore backup warning.

## 2026-08-09

### App Store Submission Config
- Added `ios.buildNumber` and `ios.infoPlist.ITSAppUsesNonExemptEncryption: false` to `app.json` so App Store Connect skips the export-compliance prompt on each build.
- Added `cli.appVersionSource: "local"` to `eas.json`, required by recent EAS CLI versions and consistent with the existing local `versionCode` convention on Android.
- Added `build:ios` and `submit:ios` npm scripts mirroring the existing Android ones.
- Documented the App Store build/submit flow in `README.md`.
- Noted a blocker to resolve before submitting: `assets/icon.png` is RGBA with transparent corners (from `scripts/generate-icons.py`'s rounded-square mask), but Apple requires the 1024x1024 App Store icon to be fully opaque with no alpha channel. Needs a flattened opaque version before the first iOS build.

### Marketing Folder
- Created `marketing/` with App Store listing copy, privacy policy draft, App Privacy questionnaire answers, release notes, and a screenshots folder with required iOS device sizes.
- `marketing/README.md` has the full submission checklist, including the iPad screenshots decision (`app.json` currently has `supportsTablet: true`, which pulls in a 13" iPad screenshot requirement).
- `assets/icon.png` alpha-channel blocker noted last session is already resolved (found staged: flattened to opaque, 1024x1024, no alpha).
- Several fields left as `TODO` pending user input: subtitle, promotional text, support URL, marketing URL, privacy policy hosting URL, copyright line, and pricing.

## 2026-08-12

### App Renamed
- Renamed app from "Simple Calculator" to "Simple Best Calculator" everywhere (`app.json` display name, `README.md`, all `marketing/` docs) to match the name already registered in App Store Connect (the shorter name was unavailable).

### iPad Layout Bug Fix
- Found the calculator's number display was completely missing on iPad: `Button` sizes itself from row width via `aspectRatio: 1`, so on the much wider iPad screen the buttons grew into huge squares and pushed the display off the top of the screen.
- Fixed by capping the keypad+display column at `maxWidth: 480` and centering it horizontally in `Calculator.tsx`. No effect on iPhone (already narrower than the cap). Verified visually on iPhone 17 Pro Max and iPad Pro 13" simulators; `tsc --noEmit` still clean.

### Marketing & App Store Connect
- Filled in all remaining `TODO`s in `marketing/app-store-listing.md` and `marketing/privacy-policy.md` (subtitle, promo text, support/privacy URLs, copyright, pricing).
- Published privacy policy and support contact to a separate public repo: `github.com/lahirugmg/simple-best-cal-support`.
- Captured App Store screenshots (default, chained calculation, division-by-zero error, result) for iPhone 6.9" and iPad 13" via iOS Simulator.
- Filled in App Store Connect: screenshots, promotional text, description, keywords, support/privacy URLs, copyright, subtitle, category (Utilities), App Privacy questionnaire (published, no data collected), age rating (4+), pricing (Free, all regions), App Review contact info.
- Still open: build upload (`eas build:ios` / `eas submit:ios`) and the final "Add for Review" submission — not run this session.

## 2026-10-27 22:40

### Paper Tape redesign (App Review 5.2.5)
- Replaced the Apple-Calculator-like look (orange `#ff9f0a`, grey `#a5a5a5`, `#1c1c1c`) with a cream-and-ink "paper tape" design: `src/components/theme.ts`, new `Tape.tsx`, rewritten `Display.tsx`, `Button.tsx` and `Calculator.tsx`.
- Logic: running tape of finished calculations (capped at 100), plus backspace, percent (of running total for + and −) and change-sign; display grouping with thousands separators. Tests added in `calculator.test.ts`.
- New receipt icon via `scripts/generate-icons.py`; splash background `#F6F1E7`; build number 2 (iOS) / versionCode 2 (Android).
- Store copy and review notes updated (`marketing/`, `docs/app-review-notes.md`).
