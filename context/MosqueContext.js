import React, { createContext, useState, useEffect, useContext } from "react";
import { ref, set, onValue, push, remove, update } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "./AuthContext";

const MosqueContext = createContext();

export const useMosque = () => useContext(MosqueContext);

export const MosqueProvider = ({ children }) => {
  const [mosques, setMosques] = useState([]);
  const [recentMosques, setRecentMosques] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load saved mosques
  useEffect(() => {
    if (!user) {
      setMosques([]);
      setLoading(false);
      return;
    }

    const mosquesRef = ref(database, `users/${user.uid}/mosques`);
    const unsubscribe = onValue(mosquesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mosquesArray = Object.entries(data).map(([id, mosque]) => ({
          id,
          ...mosque,
        }));
        setMosques(mosquesArray);
      } else {
        setMosques([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Load recent mosques
  useEffect(() => {
    if (!user) {
      setRecentMosques([]);
      return;
    }

    const recentMosquesRef = ref(database, `users/${user.uid}/recentMosques`);
    const unsubscribe = onValue(recentMosquesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recentMosquesArray = Object.entries(data).map(([id, mosque]) => ({
          id,
          ...mosque,
        }));
        // Sort by most recent first
        recentMosquesArray.sort(
          (a, b) => new Date(b.lastVisited) - new Date(a.lastVisited)
        );
        setRecentMosques(recentMosquesArray);
      } else {
        setRecentMosques([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const addMosque = async (mosque) => {
    if (!user) return false;

    try {
      const mosquesRef = ref(database, `users/${user.uid}/mosques`);
      const newMosqueRef = push(mosquesRef);
      await set(newMosqueRef, {
        name: mosque.name,
        address: mosque.address,
        latitude: mosque.latitude,
        longitude: mosque.longitude,
        radius: mosque.radius || 100, // Default radius in meters
        action: mosque.action || "silent", // Default action
        createdAt: new Date().toISOString(),
      });

      // Also add to recent mosques
      await addToRecentMosques({
        name: mosque.name,
        address: mosque.address,
        latitude: mosque.latitude,
        longitude: mosque.longitude,
      });

      return true;
    } catch (error) {
      console.error("Error adding mosque:", error);
      return false;
    }
  };

  const addToRecentMosques = async (mosque) => {
    if (!user) return false;

    try {
      // Check if this mosque already exists in recent mosques
      const existingIndex = recentMosques.findIndex(
        (m) =>
          m.latitude === mosque.latitude && m.longitude === mosque.longitude
      );

      if (existingIndex >= 0) {
        // Update the existing entry
        const mosqueId = recentMosques[existingIndex].id;
        const recentMosqueRef = ref(
          database,
          `users/${user.uid}/recentMosques/${mosqueId}`
        );
        await update(recentMosqueRef, {
          lastVisited: new Date().toISOString(),
        });
      } else {
        // Add new entry
        const recentMosquesRef = ref(
          database,
          `users/${user.uid}/recentMosques`
        );
        const newRecentMosqueRef = push(recentMosquesRef);
        await set(newRecentMosqueRef, {
          name: mosque.name,
          address: mosque.address,
          latitude: mosque.latitude,
          longitude: mosque.longitude,
          lastVisited: new Date().toISOString(),
        });
      }

      return true;
    } catch (error) {
      console.error("Error adding to recent mosques:", error);
      return false;
    }
  };

  const removeMosque = async (mosqueId) => {
    if (!user) return false;

    try {
      const mosqueRef = ref(database, `users/${user.uid}/mosques/${mosqueId}`);
      await remove(mosqueRef);
      return true;
    } catch (error) {
      console.error("Error removing mosque:", error);
      return false;
    }
  };

  const updateMosqueAction = async (mosqueId, action) => {
    if (!user) return false;

    try {
      const mosqueRef = ref(database, `users/${user.uid}/mosques/${mosqueId}`);
      await update(mosqueRef, { action });
      return true;
    } catch (error) {
      console.error("Error updating mosque action:", error);
      return false;
    }
  };

  const updateMosqueDetails = async (mosqueId, updates) => {
    if (!user) return false;

    try {
      const mosqueRef = ref(database, `users/${user.uid}/mosques/${mosqueId}`);
      await update(mosqueRef, updates);
      return true;
    } catch (error) {
      console.error("Error updating mosque details:", error);
      return false;
    }
  };

  return (
    <MosqueContext.Provider
      value={{
        mosques,
        recentMosques,
        loading,
        addMosque,
        addToRecentMosques,
        removeMosque,
        updateMosqueAction,
        updateMosqueDetails,
      }}
    >
      {children}
    </MosqueContext.Provider>
  );
};
