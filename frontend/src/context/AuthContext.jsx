// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export const AuthContext = createContext();

const useAuthFetcher = (setUser, setLoading) => {
  const API_URL = import.meta.env.VITE_API_URL;
  return useCallback(async (setContextLoading = false) => {
    if (setContextLoading) setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/api/auth/user`, {
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
  }, [setUser, setLoading, API_URL]);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchUserInternal = useAuthFetcher(setUser, setLoading);

  // 1. INITIAL LOAD
  useEffect(() => {
    fetchUserInternal(true); 
  }, [fetchUserInternal]);

  // 2. REFETCH (For Login/Signup)
  const refetchUser = useCallback(() => fetchUserInternal(true), [fetchUserInternal]);

  // 3. REFRESH (For Cart Updates)
  const refreshUser = useCallback(() => fetchUserInternal(false), [fetchUserInternal]); 
  
  // 4. LOGOUT
  const logout = useCallback(async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {}, 
        { withCredentials: true } 
      );
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  // Memoize the context value so re-renders don't create fresh references
  const contextValue = useMemo(() => ({
    user,
    setUser,
    loading,
    logout,
    refetchUser,
    refreshUser
  }), [user, loading, logout, refetchUser, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {/* CRITICAL FIX: 
        We only render the blocking spinner on the very first application boot-up.
        If a user is inside a form and state shifts, we DO NOT throw up a full-screen overlay 
        that breaks their keyboard focus.
      */}
      {loading && !user ? (
         <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <FaSpinner className="animate-spin text-indigo-600 w-8 h-8" />
         </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);