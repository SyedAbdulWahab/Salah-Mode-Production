import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserSettings } from "../../context/UserSettingsContext";

export default function PhoneProfileScreen() {
  const { defaultPhoneMode, updateDefaultPhoneMode } = useUserSettings();
  const router = useRouter();

  const handleModeSelect = async (mode) => {
    await updateDefaultPhoneMode(mode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Phone Profile on Arrival</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => handleModeSelect("silent")}
        >
          <View style={styles.optionContent}>
            <Ionicons
              name="volume-mute-outline"
              size={24}
              color="#333"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Silent</Text>
          </View>
          {defaultPhoneMode === "silent" && (
            <Ionicons name="checkmark" size={24} color="#00a86b" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => handleModeSelect("vibrate")}
        >
          <View style={styles.optionContent}>
            <Ionicons
              name="phone-portrait-outline"
              size={24}
              color="#333"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Vibrate</Text>
          </View>
          {defaultPhoneMode === "vibrate" && (
            <Ionicons name="checkmark" size={24} color="#00a86b" />
          )}
        </TouchableOpacity>

        <Text style={styles.description}>
          Choose how you want your phone to behave when you arrive at the mosque
          – so you can stay focused on your prayer.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    lineHeight: 20,
  },
});
