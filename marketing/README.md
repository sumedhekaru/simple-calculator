# Marketing & App Store Submission

Everything needed to list **Simple Best Calculator** on the Apple App Store lives here. Fill in the blanks marked `TODO`, then copy the final values into App Store Connect when creating the version for submission.

## Files

- [`app-store-listing.md`](app-store-listing.md) — name, subtitle, description, keywords, URLs, category, copyright.
- [`privacy-policy.md`](privacy-policy.md) — privacy policy text. Must be hosted at a public URL (see TODO inside).
- [`app-privacy-answers.md`](app-privacy-answers.md) — answers for Apple's "App Privacy" data-collection questionnaire.
- [`release-notes.md`](release-notes.md) — "What's New in This Version" text, per version.
- [`screenshots/`](screenshots/) — App Store screenshot images, per device size. See [`screenshots/README.md`](screenshots/README.md) for required sizes and filenames.

## Submission checklist

Config already done in the app (see [devlog.md](../devlog.md)):
- [x] `ios.bundleIdentifier` set in `app.json`
- [x] `ios.buildNumber` and export-compliance flag set in `app.json`
- [x] `build:ios` / `submit:ios` scripts in `package.json`
- [x] App icon has no alpha channel — `assets/icon.png` is a flattened, fully opaque 1024x1024 PNG.

Still needed before/during submission:
- [ ] Apple Developer Program enrollment active
- [ ] App record created in App Store Connect (bundle ID `com.jarviskaru.calculator`)
- [ ] Privacy policy published at a public URL, linked in `privacy-policy.md`
- [ ] Support URL decided (can be a GitHub repo page if no dedicated site)
- [ ] Screenshots captured for required device sizes (`screenshots/README.md`)
- [ ] Listing copy filled in (`app-store-listing.md`)
- [ ] App Privacy questionnaire answered in App Store Connect (`app-privacy-answers.md` has the answers)
- [ ] Age rating questionnaire completed (expect 4+ — no objectionable content, no data collection)
- [ ] Pricing set (free) and territory availability chosen
- [ ] Build uploaded via `npm run build:ios` then `npm run submit:ios`
- [ ] Version submitted for review in App Store Connect

Apple periodically changes exact requirements (screenshot sizes, questionnaire wording) — verify against the live App Store Connect UI at submission time rather than trusting this folder as the final word.
