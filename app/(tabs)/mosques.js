import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMosque } from "../../context/MosqueContext";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function MosquesScreen() {
  const router = useRouter();
  const { mosques, loading, addMosque, removeMosque } = useMosque();
  const [showAddForm, setShowAddForm] = useState(false);
  const params = useLocalSearchParams();

  // Check if showAddForm parameter is present in the URL
  useEffect(() => {
    if (params.showAddForm === "true") {
      setShowAddForm(true);
    }
  }, [params]);

  const [newMosque, setNewMosque] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const handleAddNewMosque = () => {
    // Navigate to the mosque search screen
    router.push("/(tabs)/mosque-search");
  };

  const handleAddMosque = async () => {
    // Basic validation
    if (
      !newMosque.name ||
      !newMosque.address ||
      !newMosque.latitude ||
      !newMosque.longitude
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setFormLoading(true);
    try {
      const success = await addMosque({
        ...newMosque,
        latitude: parseFloat(newMosque.latitude),
        longitude: parseFloat(newMosque.longitude),
      });

      if (success) {
        // Reset form and hide it
        setNewMosque({
          name: "",
          address: "",
          latitude: "",
          longitude: "",
        });
        setShowAddForm(false);
        Alert.alert("Success", "Mosque added successfully");
      } else {
        Alert.alert("Error", "Failed to add mosque");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveMosque = (mosqueId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this mosque?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMosque(mosqueId);
              Alert.alert("Success", "Mosque removed successfully");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Mosques</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddNewMosque}>
        <Ionicons name="add-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Mosque</Text>
      </TouchableOpacity>

      {showAddForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add New Mosque</Text>

          <Text style={styles.label}>Mosque Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Masjid Al-Noor"
            value={newMosque.name}
            onChangeText={(text) => setNewMosque({ ...newMosque, name: text })}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Full address"
            value={newMosque.address}
            onChangeText={(text) =>
              setNewMosque({ ...newMosque, address: text })
            }
          />

          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 24.7136"
            keyboardType="numeric"
            value={newMosque.latitude}
            onChangeText={(text) =>
              setNewMosque({ ...newMosque, latitude: text })
            }
          />

          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 46.6753"
            keyboardType="numeric"
            value={newMosque.longitude}
            onChangeText={(text) =>
              setNewMosque({ ...newMosque, longitude: text })
            }
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddMosque}
            disabled={formLoading}
          >
            {formLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Mosque</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00a86b"
            style={styles.loader}
          />
        ) : mosques.length > 0 ? (
          mosques.map((mosque) => (
            <View key={mosque.id} style={styles.mosqueCard}>
              <View style={styles.mosqueHeader}>
                <Text style={styles.mosqueName}>{mosque.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveMosque(mosque.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                </TouchableOpacity>
              </View>
              <Text style={styles.mosqueAddress}>{mosque.address}</Text>
              <View style={styles.mosqueDetails}>
                <Text style={styles.mosqueCoordinates}>
                  Lat: {mosque.latitude.toFixed(4)}, Long:{" "}
                  {mosque.longitude.toFixed(4)}
                </Text>
                <Text style={styles.mosqueAction}>
                  Action: {mosque.action === "silent" ? "Silent" : "Vibrate"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>
              You haven't added any mosques yet.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Add a mosque to automatically silence your phone when you arrive.
            </Text>
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#00a86b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#00a86b",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    marginTop: 50,
  },
  mosqueCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mosqueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  mosqueAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  mosqueDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  mosqueCoordinates: {
    fontSize: 12,
    color: "#888",
  },
  mosqueAction: {
    fontSize: 12,
    color: "#00a86b",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
