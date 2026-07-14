# Simple Calculator

A simple, good-looking calculator app built with **Expo + React Native (TypeScript)**.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Decimal input and chained operations
- Division-by-zero handling with `Error` display
- Clean dark-themed UI with large tap targets
- Safe area handling for iOS and Android system navigation bars

## Tech Stack

- Expo SDK 54
- React Native 0.81.5
- TypeScript
- Jest + ts-jest for unit tests
- react-native-safe-area-context for safe area insets

## Getting Started

```bash
npm install
npx expo start
```

Then press `w` for web, `i` for iOS simulator, or `a` for Android emulator.

## Running Tests

```bash
npm test
```

## Project Structure

```
src/
  components/      # Button, Display, Calculator screen
  logic/           # Pure calculator logic and tests
  test/mocks/      # Jest mocks for native modules
assets/            # App icons and splash images
scripts/           # Icon generation script
```

## Building for Stores

### Prerequisites

- An Expo account (free at https://expo.dev/signup)
- For Google Play Store: a Google Play Console account ($25 one-time fee)

### Configure EAS

```bash
npx eas build:configure
```

This creates an EAS project and sets the `extra.eas.projectId` in `app.json`.

### Build Android AAB for Play Store

```bash
npm run build:android
```

This uploads the build to EAS and returns a downloadable AAB file. Upload that AAB to the Google Play Console.

### Build Android APK for Testing

```bash
npm run build:android:preview
```

This builds an installable APK for internal testing.

### Build Locally (Skip EAS Queue)

If EAS cloud builds are queued too long, you can build on your Mac:

```bash
# One-time: prebuild native Android project
npx expo prebuild --platform android

# Build release AAB
cd android
./gradlew bundleRelease
```

The output AAB will be at:
`android/app/build/outputs/bundle/release/app-release.aab`

**Important:** keep your release keystore (`android/app/release.keystore`) and its password safe. If you lose it, you cannot publish updates to the Play Store.

Requirements:
- Android SDK command line tools
- Java 17 (e.g. Eclipse Temurin)
- Set `ANDROID_HOME` to your Android SDK path
