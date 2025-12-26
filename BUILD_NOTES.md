# Android Build Notes

## Windows Code Page Issue

If you encounter the "Active code page: 1252" error when building on Windows, this is a known issue with Expo autolinking on Windows. The error occurs because Windows outputs code page messages that interfere with JSON parsing in Gradle.

## Solutions

### Option 1: Use EAS Build (Recommended - Cloud Build)
This avoids all Windows-specific issues:

```bash
npm run build:android:debug
```

This requires:
1. EAS CLI installed: `npm install -g eas-cli`
2. Expo account: `eas login`
3. Project configured: `eas build:configure` (first time only)

### Option 2: Direct Gradle Build (After Prebuild)
If you've already run prebuild, you can build directly with Gradle:

```bash
npm run build:android:apk:direct
```

This bypasses Expo's build process and uses Gradle directly.

### Option 3: Use Android Studio
1. Run `npx expo prebuild --platform android` to generate native code
2. Open `android` folder in Android Studio
3. Build > Build Bundle(s) / APK(s) > Build APK(s)

## Current Workarounds Applied

The following workarounds have been applied but may not fully resolve the issue:

1. **gradlew.bat** - Sets UTF-8 code page at startup
2. **build-android.bat** - Sets UTF-8 encoding and environment variables
3. **settings.gradle** - Filters code page messages from node command outputs
4. **gradle.properties** - Sets UTF-8 encoding in JVM arguments
5. **gradle/init.gradle** - Sets UTF-8 system properties

If the issue persists, the recommended solution is to use **EAS Build** (Option 1) which builds in the cloud and avoids all Windows-specific encoding issues.

