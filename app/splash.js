import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Don't navigate if we're already navigating or still loading auth
    if (isNavigating || loading) return;

    // Simulate a loading delay (5 seconds for testing purposes)
    const timer = setTimeout(() => {
      setIsNavigating(true);
      // Navigate based on auth state after delay
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/");
      }
    }, 5000); // 5 seconds for testing

    return () => clearTimeout(timer);
  }, [loading, isNavigating, user, router]);

  return (
    <View style={styles.container}>
      {/* Logo placeholder - replace with your actual logo when available */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>logo</Text>
        {/* Uncomment and modify when you have the actual logo
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        */}
      </View>

      {/* Loading indicator at the bottom */}
      <ActivityIndicator style={styles.loader} size="small" color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00a86b", // Green background as shown in the image
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    color: "#000000",
  },
  logo: {
    width: 100,
    height: 100,
  },
  loader: {
    position: "absolute",
    bottom: 50,
  },
});
