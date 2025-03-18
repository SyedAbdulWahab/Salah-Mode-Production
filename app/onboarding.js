import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to the name input screen
    router.push("/(onboarding)/name");
  };

  return (
    <View style={styles.container}>
      {/* 
        BACKGROUND IMAGE INSTRUCTIONS:
        
        1. From your Figma design, export the mosque silhouette with the gradient background
        2. Create a directory: assets/images/ in your project root
        3. Save the exported image as mosque-background.png in that directory
        4. Uncomment the ImageBackground component below and comment out the placeholder View
        5. The image should be a full-screen background with the mosque silhouette at the bottom
           and a gradient from dark teal to slightly lighter teal
      */}

      {/* <ImageBackground
        source={require("../assets/images/mosque-background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      > */}

      {/* This View serves as a placeholder until you add the background image */}
      <View style={styles.backgroundPlaceholder}>
        {/* Status bar - customize appearance */}
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor="transparent"
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Moon icon from the design */}
          <View style={styles.moonContainer}>
            <View style={styles.moon} />
          </View>

          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Salam! Welcome to Salah Mode</Text>
            <Text style={styles.description}>
              We automatically silence your phone when you enter a mosque, so
              you can focus on your prayer, reflect in peace, and strengthen
              your connection with Allah without distractions.
            </Text>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          {/* Home Indicator Line (for iOS) */}
          {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
        </SafeAreaView>
      </View>
      {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundPlaceholder: {
    flex: 1,
    backgroundColor: "#1a2e35", // Dark teal background as seen in the Figma design
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  moonContainer: {
    marginTop: height * 0.05, // Position the moon higher up as in the design
    alignItems: "flex-end",
    width: "100%",
    paddingRight: width * 0.1,
  },
  moon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff", // White moon
    opacity: 0.9,
    // Add a slight shadow to the moon
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    width: "90%",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -height * 0.1, // Move text up to center of screen
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.9,
  },
  button: {
    backgroundColor: "#00a86b", // Green button as in the design
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "80%",
    marginBottom: 40,
    // Add a slight shadow to the button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 3,
    marginBottom: 8,
  },
});
