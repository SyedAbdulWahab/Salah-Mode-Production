import React, { createContext, useState, useEffect, useContext } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../config/firebase";

const MosqueContext = createContext();

export const useMosques = () => useContext(MosqueContext);

export const MosqueProvider = ({ children }) => {
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make sure database is initialized
    if (!database) {
      setError("Firebase database not initialized");
      setLoading(false);
      return;
    }

    try {
      const mosquesRef = ref(database, "mosques");
      
      // Set up listener
      const unsubscribe = onValue(mosquesRef, (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            const mosquesList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setMosques(mosquesList);
          } else {
            setMosques([]);
          }
          setLoading(false);
        } catch (innerError) {
          console.error("Error processing mosque data:", innerError);
          setError("Error loading mosque data");
          setLoading(false);
        }
      }, (fetchError) => {
        console.error("Firebase fetch error:", fetchError);
        setError(fetchError.message);
        setLoading(false);
      });
      
      // Clean up
      return () => {
        if (mosquesRef) {
          off(mosquesRef);
        }
      };
    } catch (err) {
      console.error("Error setting up mosque listener:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const value = {
    mosques,
    loading,
    error
  };

  return (
    <MosqueContext.Provider value={value}>
      {children}
    </MosqueContext.Provider>
  );
};