# Mobile App Setup

This branch wraps the existing Self Map web app with Capacitor.

## What is included

- `package.json` with Capacitor scripts
- `capacitor.config.json`
- `www/` generated from the current web files
- `android/` native project

The original web files remain at the repository root.

## Common Commands

```bash
npm run build
npm run cap:sync
npm run android:open
```

## Notes

- Android builds require Java and Android Studio / Android SDK.
- iOS builds require macOS and Xcode.
- In the native app, the PWA install prompt and service worker registration are skipped.
- Keep editing the root web files, then run `npm run build` or `npm run cap:sync`.
