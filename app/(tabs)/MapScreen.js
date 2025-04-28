import "react-native-get-random-values";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import {
  FontAwesome5,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Modal from "react-native-modal"; // Import react-native-modal
import { AntDesign } from "@expo/vector-icons";
import Geolocation from "react-native-geolocation-service";
import { database } from "../../config/firebase";
import { ref, set, onValue, off } from "firebase/database";

const MapScreen = ({ navigation }) => {
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocationChange, setUserLocationChange] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null); // Track pin drop location
  const [selectedMode, setSelectedMode] = useState(null); // Track selected mode
  const mapRef = useRef(null); // Reference to the MapView

  const [mosques, setMosques] = useState([]);

  const [mosqueName, setMosqueName] = useState("");
  const [region, setRegion] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Get current location
  // const getCurrentLocation = () => {
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setCurrentLocation({ latitude, longitude });
  //         setRegion({
  //           latitude,
  //           longitude,
  //           latitudeDelta: 0.0922,
  //           longitudeDelta: 0.0421,
  //         });
  //       },
  //       (error) => Alert.alert('Error', error.message),
  //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //     );
  //   };
  useEffect(() => {
    // getCurrentLocation();

    const mosquesRef = ref(database, "mosques");

    const listener = onValue(mosquesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mosqueArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMosques(mosqueArray);
      }
    });

    return () => off(mosquesRef, "value", listener);
  }, []);
  useEffect(() => {
    // getCurrentLocation();
    console.log("Current location:", selectedLocation);
  }, [selectedLocation]);

  // Add new mosque
  const addMosque = () => {
    setModalVisible(false);

    if (!currentLocation) {
      Alert.alert(
        "Error",
        "Current location not available. Please wait for GPS fix or try again."
      );
      return;
    }

    // if (!mosqueName.trim()) {
    //   Alert.alert("Error", "Please enter a mosque name.");
    //   return;
    // }

    const newMosqueRef = ref(database, "mosques/" + Date.now());

    set(newMosqueRef, {
      //   name: mosqueName,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      createdAt: Date.now(),
    })
      .then(() => {
        Alert.alert("Success", "Mosque added successfully");
        setMosqueName("");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to use this feature. Please enable it in your device settings."
          );
          return; // Exit if permission is not granted
        }

        // Get the current location
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01, // Smaller delta for zooming in
          longitudeDelta: 0.01,
        });

        // Smoothly animate the map to the current location
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000 // Duration in milliseconds
          );
        }
      } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching location:", error);
        Alert.alert(
          "Error",
          "An error occurred while fetching your location. Please try again."
        );
      }
    };

    fetchLocation();
  }, []); // Empty dependency array ensures it runs only once when the component mounts // Empty dependency array ensures it runs only once when the component mounts


    // Fetch mosques in real-time
    useEffect(() => {
      const mosquesRef = ref(database, "mosques");
      const unsubscribe = onValue(mosquesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const mosqueArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMosques(mosqueArray);
        } else {
          setMosques([]);
        }
      });
  
      return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

  const handleConfirmLocation = () => {
    setModalVisible(true);
  };

  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarkers([...markers, coordinate]);

    // Show a toast message
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Mosque location marked successfully!",
        ToastAndroid.SHORT
      );
    } else {
      Alert.alert("Success", "Mosque location marked successfully!");
    }
  };

  const navigateToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01, // Smaller delta for zooming in
          longitudeDelta: 0.01,
        },
        1000 // Duration in milliseconds
      );
    }
  };
  const refMap = useRef();

  const handleRegionChange = (region) => {
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };
  return (
    <View style={styles.container}>
      <>
        {/* <Text>{text}</Text> */}

        <GooglePlacesAutocomplete
          ref={refMap}
          query={{
            // key: "AIzaSyAiuJvpwIAoDDNuxMv2Q-d_VoWP2Cqy-mc",
            key: "AIzaSyAiuJvpwIAoDDNuxMv2Q-d_VoWP2Cqy-mc",
            language: "en",
            type: "address",
          }}
          isRowScrollable={true}
          //   currentLocation={true}
          predefinedPlacesAlwaysVisible={true}
          enableHighAccuracyLocation={true}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            console.log("Location details:", lat);
            const region = {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            mapRef.current.animateToRegion(region, 1000); // Smoothly move to the searched location
          }}
          placeholder="Search for a Mosque"
          styles={{
            container: {
              position: "absolute", // Position it absolutely
              top: 70, // Place it at the top
              width: "90%", // Adjust width
              alignSelf: "center", // Center horizontally
              zIndex: 1, // Ensure it appears above the map
            },

            textInput: {
              backgroundColor: "#fff",
              borderRadius: 50,
              fontWeight: "700",
              marginTop: 7,
              fontSize: 14,
            },
            textInputContainer: {
              backgroundColor: "#fff",
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
            },
            listView: {
              backgroundColor: "white", // Ensure dropdown is visible
            },
          }}
          renderLeftButton={() => (
            <View style={{ marginLeft: 10 }}>
              <MaterialIcons name="location-on" size={24} color="#0FAD69" />
            </View>
          )}
          renderRightButton={() => (
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  marginRight: 10,
                  backgroundColor: "white",
                  padding: 9,
                  borderRadius: 30,
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="clockcircle"
                  size={11}
                  color="#0FAD69"
                  style={{ marginRight: 6 }}
                />
                <Text>Search</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <MapView
          ref={mapRef} // Attach the map reference
          style={styles.map}
          initialRegion={currentLocation}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChange}
          onUserLocationChange={(e) => {
            // console.log("onUserLocationChange", e.nativeEvent.coordinate);
            setUserLocationChange(e.nativeEvent.coordinate);
          }}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          zoomTapEnabled={true}
          toolbarEnabled={true}
        >
          {/* Show current location marker */}
          {/* {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="You are here"
            >
         
              <MaterialIcons name="my-location" size={24} color="#0FAD69" />
            </Marker>
          )} */}

          {/* Show mosque markers and radius */}
          {mosques.map((marker, index) => (
            <React.Fragment key={index}>
              <Marker coordinate={marker} title={`Mosque ${index + 1}`}>
                <FontAwesome5 name="mosque" size={24} color="#D89C60" />
              </Marker>
              <Circle
                center={marker}
                radius={15} // Radius in meters
                strokeColor="rgba(216, 156, 96, 0.5)"
                fillColor="rgba(216, 156, 96, 0.2)"
              />
            </React.Fragment>
          ))}
        </MapView>

        {/* Pin Drop (like Careem) */}
        <View style={styles.pinContainer}>
          <FontAwesome5 name="map-marker-alt" size={40} color="#0FAD69" />
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={navigateToCurrentLocation} // Call the function to navigate
        >
          <FontAwesome5 name="location-arrow" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
        >
          <Text style={styles.confirmButtonText}>Add Mosque</Text>
        </TouchableOpacity>

        {/* Bottom Sheet Modal */}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.bottomModal}
        >
          <View style={styles.modalContent}>
            {/* Modal Title */}
            <Text style={styles.modalTitle}>
              Hey, how would you like your phone to behave during prayer?
            </Text>

            {/* Silent and Vibrate Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.squareButton,
                  selectedMode === "Silent" && styles.selectedButtonBorder, // Change border color
                ]}
                onPress={() => setSelectedMode("Silent")} // Update state to "Silent"
              >
                <Feather
                  name="bell-off"
                  size={24}
                  color={selectedMode === "Silent" ? "#0FAD69" : "black"} // Change icon color
                />
                <Text
                  style={[
                    styles.squareButtonText,
                    selectedMode === "Silent" && styles.selectedButtonText, // Change text color
                  ]}
                >
                  Silent
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.squareButton,
                  selectedMode === "Vibrate" && styles.selectedButtonBorder, // Change border color
                ]}
                onPress={() => setSelectedMode("Vibrate")} // Update state to "Vibrate"
              >
                <MaterialCommunityIcons
                  name="bell-ring-outline"
                  size={24}
                  color={selectedMode === "Vibrate" ? "#0FAD69" : "black"} // Change icon color
                />
                <Text
                  style={[
                    styles.squareButtonText,
                    selectedMode === "Vibrate" && styles.selectedButtonText, // Change text color
                  ]}
                >
                  Vibrate
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description Below Buttons */}
            <Text style={styles.modalDescription}>
              Select your preferred mode when you're at the mosque.
            </Text>

            {/* Done Button */}
            <TouchableOpacity style={styles.doneButton} onPress={addMosque}>
              <Text style={styles.doneButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -40,
    zIndex: 1,
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",

    backgroundColor: "#0FAD69",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: "90%", // Make the button span the full width
    alignItems: "center", // Center the text inside the button
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  squareButton: {
    width: "45%",
    backgroundColor: "#F0F0F0", // Constant background color
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2, // Add a border
    borderColor: "#ffff", // Default border color
  },
  squareButtonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "black", // Default text color
  },
  selectedButtonBorder: {
    borderColor: "#0FAD69", // Change border color when selected
  },
  selectedButtonText: {
    color: "#0FAD69", // Change text color when selected
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: "#0FAD69",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: "100%", // Make the button span the full width
    alignItems: "center", // Center the text inside the button
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 90, // Position above the "Add Mosque" button
    right: 20, // Align to the right
    backgroundColor: "#0FAD69",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default MapScreen;

// com.ihasnainbhutta.MyReactNativeApp
