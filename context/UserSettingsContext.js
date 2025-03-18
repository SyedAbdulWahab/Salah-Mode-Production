import React, { createContext, useState, useEffect, useContext } from "react";
import { ref, set, onValue, update } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "./AuthContext";

const UserSettingsContext = createContext();

export const useUserSettings = () => useContext(UserSettingsContext);

export const UserSettingsProvider = ({ children }) => {
  const [defaultPhoneMode, setDefaultPhoneMode] = useState("silent");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load user settings
    const settingsRef = ref(database, `users/${user.uid}/settings`);
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.defaultPhoneMode) {
          setDefaultPhoneMode(data.defaultPhoneMode);
        }
        if (data.userName) {
          setUserName(data.userName);
        } else if (user.displayName) {
          // If userName is not set but displayName is available, use that
          setUserName(user.displayName);
          // And save it to the database
          updateUserName(user.displayName);
        }
      } else {
        // Initialize settings if they don't exist
        initializeSettings();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const initializeSettings = async () => {
    if (!user) return;

    try {
      const settingsRef = ref(database, `users/${user.uid}/settings`);
      await set(settingsRef, {
        defaultPhoneMode: "silent",
        userName: user.displayName || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error initializing settings:", error);
    }
  };

  const updateDefaultPhoneMode = async (mode) => {
    if (!user) return false;

    try {
      const settingsRef = ref(database, `users/${user.uid}/settings`);
      await update(settingsRef, {
        defaultPhoneMode: mode,
        updatedAt: new Date().toISOString(),
      });
      setDefaultPhoneMode(mode);
      return true;
    } catch (error) {
      console.error("Error updating default phone mode:", error);
      return false;
    }
  };

  const updateUserName = async (name) => {
    if (!user) return false;

    try {
      const settingsRef = ref(database, `users/${user.uid}/settings`);
      await update(settingsRef, {
        userName: name,
        updatedAt: new Date().toISOString(),
      });
      setUserName(name);
      return true;
    } catch (error) {
      console.error("Error updating user name:", error);
      return false;
    }
  };

  return (
    <UserSettingsContext.Provider
      value={{
        defaultPhoneMode,
        userName,
        loading,
        updateDefaultPhoneMode,
        updateUserName,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
