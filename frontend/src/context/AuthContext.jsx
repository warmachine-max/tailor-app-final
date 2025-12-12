// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Example: used for a loading indicator

export const AuthContext = createContext();

// Private internal function to fetch the user (memoized)
// setContextLoading = true when we want to set the global 'loading' state (initial load/refetch)
const useAuthFetcher = (setUser, setLoading) => {
  return useCallback(async (setContextLoading = false) => {
    if (setContextLoading) setLoading(true);

    try {
      const res = await axios.get("http://localhost:5000/api/auth/user", {
        withCredentials: true,
      });

      const payload = res.data?.user ?? res.data ?? null;

      if (payload) {
        const normalized = {
          _id: payload._id || payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          cart: payload.cart || [],
        };
        setUser(normalized);
        return normalized;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      if (setContextLoading) setLoading(false);
    }
  }, [setUser, setLoading]);
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Use the custom hook to get the fetcher function
  const fetchUserInternal = useAuthFetcher(setUser, setLoading);

  // -------------------------------
  // 1. INITIAL LOAD
  // -------------------------------
  useEffect(() => {
    fetchUserInternal(true); // Initial load sets loading to true
  }, [fetchUserInternal]);

  // -------------------------------
  // 2. REFETCH (For Login/Signup)
  // -------------------------------
  // Triggers internal fetcher and sets the global loading state
  const refetchUser = () => fetchUserInternal(true);

  // -------------------------------
  // 3. REFRESH (For Cart Updates)
  // -------------------------------
  // Triggers internal fetcher WITHOUT setting the global loading state
  const refreshUser = () => fetchUserInternal(false); 
  
  // -------------------------------
  // 4. LOGOUT
  // -------------------------------
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        refetchUser,
        refreshUser,
      }}
    >
      {/* Optional: Add a subtle loading screen if loading is true */}
      {loading && !user && (
         <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <FaSpinner className="animate-spin text-indigo-600 w-8 h-8" />
         </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);