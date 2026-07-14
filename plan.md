# Calculator App Plan

Simple cross-platform calculator app built with **Expo + React Native (TypeScript)**.

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Testing**: Jest + React Native Testing Library (TDD)
- **Styling**: React Native StyleSheet with a clean light/dark-friendly theme
- **Deployment**: Expo EAS / native builds for Android & iOS (optional final milestone)

## Design & UX

- Clean, modern calculator layout with large tap targets.
- Light theme by default; structure styles to allow dark mode later.
- Number formatting: limit decimal places, show `Error` for invalid results.
- Button grid: digits 0–9, decimal, operators (+, −, ×, ÷), equals, clear.

## Milestones (Bite-Size)

### 1. Project Setup
- Initialize Expo project with TypeScript template.
- Install and configure testing dependencies (Jest, React Native Testing Library).
- Verify the app runs on iOS simulator and Android emulator.

### 2. Core Calculator Logic (TDD)
- Define state shape: `currentInput`, `previousValue`, `operator`, `result`.
- Write unit tests for `add`, `subtract`, `multiply`, `divide`, `clear`, `equals`, and `input` parsing.
- Implement `calculator.ts` logic module to make tests pass.
- Handle edge cases: division by zero, chained operations, decimal input, invalid transitions.

### 3. UI Components
- Build `Button` component (reusable pressable button).
- Build `Display` component (shows current input/result).
- Build `Calculator` screen that wires buttons to logic.

### 4. Integration & E2E Tests
- Write tests for user flows: `2 + 2 = 4`, `10 / 0 = Error`, `C` clears display.
- Run tests and fix any issues.

### 5. Polish & Store Prep
- Add app icons and splash screen.
- Configure `app.json` for Android package name and iOS bundle ID.
- Build production APK / AAB / IPA via EAS.

## First Steps

1. Initialize Expo project in this repo.
2. Add `jest` and `@testing-library/react-native`.
3. Write first failing test for `calculate()` function.
4. Implement the function.

## Notes

- Keep changes small. One milestone at a time.
- User will help with manual testing on devices.
- No fancy features initially — basic arithmetic only.
- Keep logic pure and separate from UI components for easier testing.
