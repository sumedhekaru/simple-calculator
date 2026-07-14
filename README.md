# Calculator

A simple, good-looking calculator app built with **Expo + React Native (TypeScript)**.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Decimal input and chained operations
- Division-by-zero handling with `Error` display
- Clean dark-themed UI with large tap targets

## Tech Stack

- Expo SDK 54
- React Native 0.81.5
- TypeScript
- Jest + ts-jest for unit tests

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
assets/            # App icons and splash images
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
