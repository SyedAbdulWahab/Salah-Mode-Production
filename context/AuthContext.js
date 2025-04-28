import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Check if auth is initialized
    if (!auth) {
      console.error("Auth is not initialized");
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      
      try {
        if (user) {
          console.log("User details:", user.email);
          setUser(user);
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          setUser(null);
          await AsyncStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error handling auth state change:", error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Auth state observer error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Define functions outside of the context value to prevent recreating them on every render
  const login = async (email, password) => {
    console.log("Login function called with email:", email);
    try {
      console.log("Calling Firebase signInWithEmailAndPassword");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Firebase login successful");
      return userCredential.user;
    } catch (error) {
      console.error("Firebase login error:", error.code, error.message);
      throw error;
    }
  };

  const register = async (email, password, displayName) => {
    console.log("Register function called with email:", email);
    try {
      console.log("Calling Firebase createUserWithEmailAndPassword");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name if provided
      if (displayName) {
        console.log("Updating user profile with displayName:", displayName);
        await updateProfile(userCredential.user, { displayName });
      }

      console.log("Registration successful");
      return userCredential.user;
    } catch (error) {
      console.error("Firebase registration error:", error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    console.log("Logout function called");
    try {
      console.log("Calling Firebase signOut");
      await signOut(auth);
      console.log("Firebase logout successful");
    } catch (error) {
      console.error("Firebase logout error:", error.code, error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    console.log("updateUserProfile function called with updates:", updates);
    try {
      if (auth.currentUser) {
        console.log("Calling Firebase updateProfile");
        await updateProfile(auth.currentUser, updates);
        // Force refresh the user object
        console.log("Firebase updateProfile successful");
        setUser({ ...auth.currentUser });
      } else {
        console.log("No current user to update profile");
      }
    } catch (error) {
      console.error("Firebase updateProfile error:", error.code, error.message);
      throw error;
    }
  };

  // Memoize the context value to prevent unnecessary rerenders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};