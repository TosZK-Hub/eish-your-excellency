# Hadeda Flap

A one-tap portrait flyer. A hadeda ibis, a suburb, and a gap.

Open `index.html` in a browser. No build step. Paths are relative, so a static host works, including:

`https://raw.githack.com/TosZK-Hub/eish-your-excellency/<branch>/hadeda/index.html`

## Play

Tap, click, or press space to flap. Each gap you clear is one point. A 10c coin waits in some gaps; ten of them make one ZarBuck (Z$1). Old saves convert each koeksister into one 10c coin. Best score and coins stay in `localStorage` under `hadeda_flap_v1`.

Medals land at 10, 20, 40 and 80. The suburb changes with the score: dawn chorus, high sun, veld gold, stoep lights.

The wardrobe spends coins on scarves, hats, and wing sheen, plus a one-hit stoep shield, a wider opening for the first ten gaps, and more 10c coins. None of that is required to fly. "One more flap" plays a two-second stand-in card. No advert SDK is loaded.

## Query knobs

- `?bot=1` flies by itself
- `?scene=title|play|over|shop&still=1` holds a frame
- `?tod=dawn|day|sunset|night` picks the sky
- `?sheet=bird` is the model sheet
- `?hit=1` draws hitboxes
- `?fps=1` writes a frame rate onto the stage element
- `?scene=settings&still=1` opens settings

## Android

App id: `com.tosz.hadedaflap` (change it in `capacitor.config.json` and `android/app/build.gradle` before the first Play upload if you want a different id). App name: Hadeda Flap. Portrait only.

The web game stays at `index.html`. `node tools/sync-www.mjs` copies the web files into `www/` for Capacitor. That folder is not committed.

Debug APK (sideload, no upload key):

```
export ANDROID_HOME="$HOME/android-sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
cd hadeda
npm install
npm run apk:debug
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. GitHub Actions on this branch uploads the same file as the artifact `hadeda-flap-debug`.

### Upload key (do not commit it)

The release AAB is signed only when you provide a keystore. Generate one on your own machine and keep the file and passwords offline:

```
keytool -genkeypair -v -keystore hadeda-upload.keystore -alias hadeda -keyalg RSA -keysize 2048 -validity 10000
```

Then add GitHub Actions secrets on this repository:

- `ANDROID_KEYSTORE_BASE64` — `base64 -w0 hadeda-upload.keystore`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS` — `hadeda`, unless you chose another alias
- `ANDROID_KEY_PASSWORD`

Re-run the Hadeda Android workflow. It uploads `hadeda-flap-release` when those secrets exist. Without them it still uploads the debug APK and skips the release bundle.

Never commit `*.keystore` or `*.jks`. The `.gitignore` already excludes them.

Play Console, the paid developer account, the store listing, and any real AdMob account are yours to create. This repo does not submit the app. See `store/listing.md`.
