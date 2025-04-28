import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useUserSettings } from "../../context/UserSettingsContext";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const { userName } = useUserSettings();
  const router = useRouter();

  // Extract first name from userName
  const getFirstName = () => {
    if (!userName) return "User";
    // Split by space and take the first part
    return userName.split(" ")[0];
  };

  const handleAddMosque = () => {
    router.push("/(tabs)/MapScreen");
  };

  return (
    <View style={styles.container}>
      {/* Background with image */}
      <ImageBackground
        source={require("../../assets/images/home.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Mosque silhouette at the bottom */}
        <View style={styles.mosqueSilhouette} />

        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />

        <SafeAreaView style={styles.content}>
          {/* Greeting */}
          <Text style={styles.greeting}>Salam, {getFirstName()}</Text>

          {/* Add Mosque Button */}
          <TouchableOpacity
            style={styles.addMosqueButton}
            onPress={handleAddMosque}
            activeOpacity={0.9}
          >
            <View style={styles.mosqueIconContainer}>
              <FontAwesome5 name="mosque" size={24} color="#D89C60" />
            </View>
            <Text style={styles.addMosqueText}>Add Mosque</Text>
          </TouchableOpacity>

          {/* Instruction Text */}
          <Text style={styles.instructionText}>
            Add your favorite mosques here, and we'll automatically silence your
            phone when you arrive
          </Text>
        </SafeAreaView>
      </ImageBackground>
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
  mosqueSilhouette: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3, // Adjust height as needed
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for silhouette effect
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  addMosqueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingLeft: 10,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mosqueIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  addMosqueText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  instructionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 20,
    lineHeight: 24,
  },
});
