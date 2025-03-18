# Firebase Setup Guide for Salah Mode Android App

This guide will help you set up Firebase for your Salah Mode React Native Android app.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project" or select an existing project
3. Enter a project name (e.g., "Salah Mode")
4. Enable Google Analytics if you want (optional)
5. Accept the terms and click "Create project"

## Step 2: Register Your Android App

1. On your Firebase project dashboard, click on the Android icon to add an Android app
2. Enter your Android package name (typically in the format `com.yourcompany.salahmode`)
   - You can find this in your `app.json` file under `android.package`
   - If you haven't set it yet, you can use something like `com.yourusername.salahmode`
3. Enter a nickname for your app (e.g., "Salah Mode Android")
4. (Optional) Enter your app's SHA-1 signing certificate
   - This is only required for certain Firebase features like Google Sign-In
5. Click "Register app"

## Step 3: Download the Configuration File

1. Firebase will generate a `google-services.json` file
2. Download this file
3. For Expo projects, you don't need to place this file in your project yet, as we'll be using the web configuration

## Step 4: Register a Web App Too

1. Go back to your Firebase project dashboard
2. Click on the Web icon (`</>`) to add a web app
3. Enter a nickname for your web app (e.g., "Salah Mode Web")
4. Click "Register app"
5. Copy the `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "...", // This is optional
};
```

## Step 5: Set Up Realtime Database

1. In the Firebase Console, go to "Build" > "Realtime Database"
2. Click "Create Database"
3. Choose a location for your database (pick the one closest to your users)
4. Start in test mode (you can set up proper security rules later)
5. Click "Enable"
6. Note the database URL, which should look like: `https://your-project-id.firebaseio.com`

## Step 6: Enable Authentication

1. In the Firebase Console, go to "Build" > "Authentication"
2. Click "Get started"
3. Enable the "Email/Password" sign-in method
4. Click "Save"

## Step 7: Update Your Firebase Configuration

1. Open the `config/firebase.js` file in your project
2. Replace the placeholder values with your actual Firebase configuration
3. Make sure to include the correct `databaseURL` from Step 5

Your final configuration should look something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6",
  authDomain: "salah-mode.firebaseapp.com",
  databaseURL: "https://salah-mode.firebaseio.com",
  projectId: "salah-mode",
  storageBucket: "salah-mode.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0",
};
```

## Step 8: Test Your App

1. Save all changes
2. Restart your Expo development server with `npx expo start --clear`
3. Open the app on your Android device or emulator
4. Test the authentication and database features of your app

## Troubleshooting for Android

If you encounter issues with Firebase on Android:

1. Make sure your Android package name in Firebase matches the one in your `app.json`
2. For Expo projects, you're using the Firebase Web SDK, so the web configuration is what matters
3. If you're using Expo Go, some Firebase features might be limited
4. If you're building a standalone app, you might need to configure Firebase native modules

## Additional Android-Specific Setup (for Standalone Apps)

If you're building a standalone app (not using Expo Go), you'll need to:

1. Place the `google-services.json` file in the `android/app` directory
2. Update your Android build files to include Firebase
3. Follow the [React Native Firebase documentation](https://rnfirebase.io/) for more details

For Expo managed workflow, most of this is handled automatically when you build your app.
