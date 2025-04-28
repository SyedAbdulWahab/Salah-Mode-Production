import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";
import { AuthProvider } from "../context/AuthContext";
import { UserSettingsProvider } from "../context/UserSettingsContext";
import { MosqueProvider } from "../context/MosqueContext";
import { useAuth } from "../context/AuthContext";
import { useUserSettings } from "../context/UserSettingsContext";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loaded) {
      // Hide the native splash screen as soon as fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserSettingsProvider>
          <MosqueProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <RootLayoutNav />
            </ThemeProvider>
          </MosqueProvider>
        </UserSettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { user, loading: userLoading } = useAuth();
  const { loading: settingsLoading } = useUserSettings();
  const router = useRouter();
  const segments = useSegments();

  const hasNavigated = useRef(false);

  // Reset navigation flag when dependencies change
  useEffect(() => {
    hasNavigated.current = false;
  }, [user, userLoading, settingsLoading]);

  // Simplified navigation effect with better guards
  useEffect(() => {
    // Don't navigate if still loading
    if (userLoading || settingsLoading) return;

    // Don't navigate if we've already navigated in this render cycle
    if (hasNavigated.current) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const isOnboardingScreen = segments[0] === "onboarding";
    const isWelcomeScreen = segments[0] === "";
    const isTabsGroup = segments[0] === "(tabs)";

    // Handle navigation based on auth state with more specific conditions
    if (
      !user &&
      !inAuthGroup &&
      !inOnboardingGroup &&
      !isOnboardingScreen &&
      !isWelcomeScreen
    ) {
      // User not authenticated and not on welcome, auth, or onboarding screens
      console.log("Not authenticated, redirecting to welcome screen");
      hasNavigated.current = true;
      router.replace("/login");
    } else if (user && (inAuthGroup || isWelcomeScreen) && !isTabsGroup) {
      // User is authenticated but on auth or welcome screen
      console.log("Authenticated, redirecting to tabs");
      hasNavigated.current = true;
      router.replace("/(tabs)");
    }
  }, [user, userLoading, settingsLoading, segments, router]);

  return (
    <>
      <Slot />
      <StatusBar style="auto" />
    </>
  );
}
