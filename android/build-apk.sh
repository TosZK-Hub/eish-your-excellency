#!/bin/bash
set -e
cd "$(dirname "$0")"
# Needs: JDK 17, Android SDK platform 34 + build-tools 34.0.0. Override paths with JAVA_HOME / SDK.
SDK=${SDK:-/workspace/android/sdk}; ROOT=..
for d in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do mkdir -p res/mipmap-${d%:*}; cp $ROOT/icons/icon-${d#*:}.png res/mipmap-${d%:*}/ic_launcher.png; done
rm -rf assets && mkdir -p assets/www/art assets/www/icons
cp $ROOT/index.html $ROOT/game.js $ROOT/style.css $ROOT/manifest.webmanifest $ROOT/icon.svg $ROOT/sw.js assets/www/
cp -a $ROOT/art/. assets/www/art/
cp $ROOT/icons/*.png assets/www/icons/
export JAVA_HOME=${JAVA_HOME:-/workspace/android/jdk-17.0.21+9}; export PATH=$JAVA_HOME/bin:$PATH
BT=$SDK/build-tools/34.0.0; AJ=$SDK/platforms/android-34/android.jar
rm -rf out && mkdir -p out/c out/cls out/dex
$BT/aapt2 compile --dir res -o out/res.zip
$BT/aapt2 link -o out/base.apk -I $AJ --manifest AndroidManifest.xml -A assets out/res.zip --java out/gen --auto-add-overlay
javac -source 8 -target 8 -bootclasspath $AJ -classpath $AJ -d out/cls $(find src out/gen -name '*.java') 2>&1 | grep -v "warning" || true
$BT/d8 --min-api 21 --lib $AJ --output out/dex $(find out/cls -name '*.class')
cp out/base.apk out/unsigned.apk && python3 -c "import zipfile;z=zipfile.ZipFile('out/unsigned.apk','a');z.write('out/dex/classes.dex','classes.dex');z.close()"
$BT/zipalign -f 4 out/unsigned.apk out/aligned.apk
[ -f debug.keystore ] || keytool -genkeypair -keystore debug.keystore -storepass android -keypass android -alias androiddebugkey -dname "CN=Android Debug,O=Android,C=US" -keyalg RSA -keysize 2048 -validity 10000
$BT/apksigner sign --ks debug.keystore --ks-pass pass:android --key-pass pass:android --out out/eish-ways-to-go-v1.0-debug.apk out/aligned.apk
$BT/apksigner verify out/eish-ways-to-go-v1.0-debug.apk && ls -la out/*.apk
