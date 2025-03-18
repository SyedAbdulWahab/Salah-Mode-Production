import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useMosque } from "../../context/MosqueContext";

// Mock data for mosque search results
const mockMosques = [
  {
    id: "1",
    name: "Masjid Al-Haram",
    address: "Mecca, Saudi Arabia",
    distance: "0.5 km",
    latitude: 21.4225,
    longitude: 39.8262,
  },
  {
    id: "2",
    name: "Masjid Al-Nabawi",
    address: "Medina, Saudi Arabia",
    distance: "1.2 km",
    latitude: 24.4672,
    longitude: 39.6111,
  },
  {
    id: "3",
    name: "Masjid Quba",
    address: "Medina, Saudi Arabia",
    distance: "2.3 km",
    latitude: 24.4408,
    longitude: 39.6168,
  },
  {
    id: "4",
    name: "Masjid Al-Qiblatayn",
    address: "Medina, Saudi Arabia",
    distance: "3.1 km",
    latitude: 24.4822,
    longitude: 39.5792,
  },
];

export default function MosqueSearchScreen() {
  const router = useRouter();
  const { addMosque } = useMosque();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(mockMosques);

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Filter the mock data based on search query
    if (text) {
      const filtered = mockMosques.filter(
        (mosque) =>
          mosque.name.toLowerCase().includes(text.toLowerCase()) ||
          mosque.address.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(mockMosques);
    }
  };

  const handleAddMosque = (mosque) => {
    // Add the mosque to the context
    addMosque({
      name: mosque.name,
      address: mosque.address,
      latitude: mosque.latitude,
      longitude: mosque.longitude,
      radius: 100, // Default radius in meters
      action: "silent", // Default action
    });

    // Navigate back to the mosques tab
    router.push("/(tabs)/mosques");
  };

  const handleBack = () => {
    router.back();
  };

  const renderMosqueItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mosqueItem}
      onPress={() => handleAddMosque(item)}
    >
      <View style={styles.mosqueIconContainer}>
        <FontAwesome5 name="mosque" size={20} color="#00a86b" />
      </View>
      <View style={styles.mosqueInfo}>
        <Text style={styles.mosqueName}>{item.name}</Text>
        <Text style={styles.mosqueAddress}>{item.address}</Text>
      </View>
      <Text style={styles.mosqueDistance}>{item.distance}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Mosque</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for mosques nearby"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={searchResults}
        renderItem={renderMosqueItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome5 name="mosque" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No mosques found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try a different search term
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 34, // Same width as back button for alignment
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20, // Reduced padding since we removed the button
  },
  mosqueItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mosqueIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 168, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  mosqueInfo: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  mosqueAddress: {
    fontSize: 14,
    color: "#666",
  },
  mosqueDistance: {
    fontSize: 14,
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
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    paddingHorizontal: 40,
  },
});
