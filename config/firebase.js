import 'react-native-get-random-values';
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyCdM67Eo_FlsCfiAyL3Ds_y0vFPweMucpY",
  authDomain: "salah-mode-e678b.firebaseapp.com",
  projectId: "salah-mode-e678b",
  storageBucket: "salah-mode-e678b.firebasestorage.app",
  messagingSenderId: "18453196035",
  appId: "1:18453196035:android:ce9865def0ca325786cd36",
  databaseURL: "https://salah-mode-e678b-default-rtdb.firebaseio.com"
};

// Initialize Firebase app first
let app;
let auth = null;
let database = null;

try {
  // Check if any Firebase apps have been initialized
  if (getApps().length === 0) {
    console.log("Initializing Firebase app for the first time");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("Firebase app already initialized, getting existing app");
    app = getApp();
  }

  // Initialize Auth with explicit AsyncStorage persistence for mobile
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
  database = getDatabase(app);
  console.log(`Firebase initialized successfully for ${Platform.OS} platform`);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, database };