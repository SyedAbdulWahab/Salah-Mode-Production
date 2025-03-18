import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// TODO: Replace with your actual Firebase project credentials
// To get these credentials:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Register both an Android app and a Web app
// 4. For the Android app, download the google-services.json file (you'll need it later for standalone builds)
// 5. For the Web app, copy the firebaseConfig object and replace the values below
// 6. Make sure to set up Realtime Database and Authentication in the Firebase Console
// 7. For the databaseURL, use the format: https://your-project-id.firebaseio.com

const firebaseConfig = {
  apiKey: "AIzaSyClpJxX3wumw3ZzcP08UGEFQM7E3cmgOjc",
  authDomain: "salah-mode.firebaseapp.com",
  databaseURL:
    "https://salah-mode-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "salah-mode",
  storageBucket: "salah-mode.firebasestorage.app",
  messagingSenderId: "758968858476",
  appId: "1:758968858476:web:5fc953bd3514f2f5f92549",
  measurementId: "G-JY081N267Y",
};

// Initialize Firebase app first
let app;
// Check if any Firebase apps have been initialized
if (getApps().length === 0) {
  console.log("Initializing Firebase app for the first time");
  app = initializeApp(firebaseConfig);
} else {
  console.log("Firebase app already initialized, getting existing app");
  app = getApp();
}

// Initialize Auth with explicit AsyncStorage persistence for mobile
let auth;
if (Platform.OS === "web") {
  console.log("Initializing Firebase Auth for web");
  auth = getAuth(app);
} else {
  console.log(
    "Initializing Firebase Auth for mobile with explicit AsyncStorage persistence"
  );
  // For mobile, always use initializeAuth with AsyncStorage persistence
  try {
    // Force initialization with AsyncStorage persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log("Successfully initialized Auth with AsyncStorage persistence");
  } catch (error) {
    console.error("Error initializing Auth with persistence:", error.message);
    // If initialization with persistence fails, check if it's because Auth is already initialized
    if (error.code === "auth/already-initialized") {
      console.log("Auth already initialized, getting existing instance");
      auth = getAuth(app);
    } else {
      // For other errors, fallback to default auth as last resort
      console.log("Falling back to default Auth initialization");
      auth = getAuth(app);
    }
  }
}

// Initialize Realtime Database
const database = getDatabase(app);

console.log(`Firebase initialized successfully for ${Platform.OS} platform`);

export { auth, database };
