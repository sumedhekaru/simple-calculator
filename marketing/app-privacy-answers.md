# App Privacy Questionnaire — Answers

Apple requires this "Data collection" questionnaire in App Store Connect for every app (App Store Connect → App Privacy). Answers below are based on the app not making any network requests or using any tracking/analytics SDK — verify this still holds true at submission time (recheck `package.json` dependencies for anything added since).

## Do you or your third-party partners collect data from this app?

```
No, we do not collect data from this app.
```

That single answer covers it — Simple Best Calculator has no network calls, no analytics, no ads, no crash reporting SDK, and stores nothing outside the device. If any of those are added later (e.g. a crash reporter), this file and the App Store Connect answers must be updated to declare the relevant data types (e.g. Diagnostics → Crash Data) before the next submission.

## Reference: data types Apple asks about (for future changes)

If any of the following are ever added to the app, come back and update both this file and the App Store Connect questionnaire:

- Contact Info, Health & Fitness, Financial Info, Location, Sensitive Info
- Contacts, User Content, Browsing History, Search History
- Identifiers (User ID, Device ID)
- Purchases, Usage Data, Diagnostics (Crash Data, Performance Data)
