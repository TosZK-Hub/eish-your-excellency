# EISH! Ways to Go: Android and Play Store notes (v1.0)

## What exists now
- `android/`: a small native Android project with a single fullscreen WebView Activity. It loads the game **offline** from bundled assets (`file:///android_asset/www/index.html`). There are no network permissions and the only permission is `VIBRATE`. Package `za.eish.waystogo`, minSdk 21, targetSdk 34, portrait.
- `android/build-apk.sh` builds a **debug-signed** APK (about 420 KB) using JDK 17 with Android build-tools 34 (aapt2, d8, zipalign, apksigner). It needs no Gradle. It copies `index.html`, `game.js`, `style.css`, `art/` and `icons/` from the repo root, so run `./build.sh` first.
- It was verified with `apksigner verify` and `aapt dump badging`. The bundled page was smoke-tested from `file://` in desktop Chrome: a bot win with no console errors. **It has not been run on a real phone or emulator yet** because the build box has no KVM access.

## Path A (recommended for Play): Trusted Web Activity
A TWA wraps the live PWA (https://toszk-hub.github.io/eish-your-excellency/), so web updates ship without a store update. Use Bubblewrap (`npx @bubblewrap/cli init --manifest <url>/manifest.webmanifest`) or PWABuilder.
- Needs a Digital Asset Links file. The TWA origin must serve `/.well-known/assetlinks.json` with the app's signing-cert SHA-256. On a GitHub *project* page, `/.well-known/` sits at the **domain root** (`toszk-hub.github.io`), not under the repo. That means either a custom domain for the game (best) or a `toszk-hub.github.io` user-site repo that serves the file.

## Path B: the bundled WebView app in `android/`
This works fully offline from first launch. Updates need a new store release. For Play it needs a release build (AAB) signed with an upload key. The simplest route is to import `android/` into Android Studio, which generates Gradle, then use Build > Generate Signed Bundle.

## Needs Jesse (cannot be done by the bot)
1. **Google Play Console developer account**: registration, one-time fee (check the current amount on the Console sign-up page) and identity verification.
2. **Account type rules**: new *personal* developer accounts must run a closed test with a minimum number of testers for a minimum period before production access. Check the current numbers in Play Console Help. An organisation account needs a D-U-N-S number.
3. **Signing**: create and keep safe an upload keystore, and enrol in Play App Signing. Never commit the keystore.
4. **Decide the package name** (proposed `za.eish.waystogo`; it can't change after the first upload) and the store **app name**.
5. **Privacy policy URL** (required). The game collects nothing: it has no accounts and no analytics, and progress lives only in on-device localStorage. A one-page policy saying so can be hosted in this repo.
6. **Data safety form**: "No data collected/shared" (true for v1.0 with no ads).
7. **Content rating (IARC questionnaire)**: cartoon slapstick, no blood or gore, no real people or brands.
8. **Target audience**: picking under-13 ages brings in the Families policy and restricts ads and SDKs. Recommend 13+ unless kids are a goal.
9. **Monetisation choice**, if any. Rewarded ads need an ad network account and an updated Data safety form. Cosmetic IAP needs a payments profile and merchant setup.
10. **Store listing assets**: hi-res icon 512x512 (`icons/icon-512.png`), feature graphic 1024x500 (still to make), phone screenshots (`shots/v1-*.png`), and optionally the promo video (`shots/v1-trailer.mp4`, which needs uploading to YouTube for the listing).
11. Test the debug APK on a low-end Android phone (enable "Install unknown apps") and report anything odd.

## Draft listing copy (edit freely)
- **Short description:** 24 silly South African microgames. One thumb, five seconds, endless EISH!
- **Full description:** Help Gogo, Tannie, Boet, Uncle Fanie and the gang survive everyday chaos in quick microgames. Feed the uncle, swat the mozzie, fan the braai, hop the taxi lanes, and remember the spaza list! Every slip-up becomes a sticker for your album. Play the daily set, collect hats, and share your best run. It is free, works offline and runs on small phones.
