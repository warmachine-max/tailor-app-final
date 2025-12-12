import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaLock, FaEnvelope, FaSignInAlt, FaTimes, FaSpinner } from "react-icons/fa"; // Added FaSpinner for clarity

export default function Login({ closeModal, toggleModalType }) {
  const { refetchUser, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // AXIOS automatically throws for 4xx/5xx status codes, so this check is mostly redundant 
      // but kept for safety if the backend configuration returns non-throwing errors.
      if (res.status >= 400) {
        throw new Error(res.data?.message || "Login failed due to server error.");
      }

      const payloadUser = res.data?.user ?? res.data ?? null;

      // 1. Primary Method: Re-fetch user data to validate cookie and get fresh context data
      let userContextSet = false;
      try {
        const refetchedUser = await refetchUser();
        if (refetchedUser) {
            userContextSet = true;
        }
      } catch (inner) {
        // Log the failure to refetch, but proceed to check fallback
        console.warn("Cookie validation (refetchUser) failed after successful login post:", inner);
      }
      
      // 2. Fallback: If refetch failed but the login response provided user data
      if (!userContextSet && payloadUser) {
        setUser({
          _id: payloadUser._id,
          name: payloadUser.name,
          email: payloadUser.email,
          role: payloadUser.role,
        });
        userContextSet = true;
      }
      
      // 3. Final Check: If context wasn't set by refetch or fallback, throw a specific error
      if (!userContextSet) {
          // This ensures the user knows something went wrong even if the API post succeeded
          throw new Error("Login succeeded but user session could not be established. Please try refreshing the page.");
      }

      // Success: Close modal
      setError("");
      if (typeof closeModal === "function") closeModal();

    } catch (err) {
      // Catch backend/network errors or custom errors thrown above
      const msg = err.response?.data?.message || err.message || "Login failed. Please check your credentials or network connection.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full">
      
      {/* Close Button: Added focus ring for accessibility */}
      <button 
        onClick={closeModal} 
        className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type="button"
        disabled={isSubmitting} // Disable close during submission
      >
        <FaTimes size={20} />
      </button>

      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center justify-center">
        <FaSignInAlt className="mr-2" /> Welcome Back
      </h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        {/* Error Message */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-300">
            {error}
          </p>
        )}

        {/* Email Input */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            className="border border-gray-300 p-3 pl-10 rounded-xl w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            className="border border-gray-300 p-3 pl-10 rounded-xl w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button
          className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold text-lg transition duration-200 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
                <FaSpinner className="animate-spin mr-3" /> Verifying...
            </span>
          ) : (
            <span className="flex items-center">
                <FaSignInAlt className="mr-2" /> Login
            </span>
          )}
        </button>

        {/* Forgot Password link (Good UX practice) */}
        <p className="text-right text-sm">
            <button 
                type="button" 
                className="text-gray-500 hover:text-indigo-600 transition"
                onClick={() => console.log('Navigate to forgot password flow')} // Replace with navigation logic
            >
                Forgot Password?
            </button>
        </p>

        {/* Link to Signup */}
        <p className="text-center text-sm text-gray-600 mt-2 border-t pt-4">
            New here? 
            <button 
                type="button" 
                onClick={() => toggleModalType("signup")}
                className="text-indigo-600 hover:text-indigo-800 font-bold ml-1 transition"
            >
                Create Account
            </button>
        </p>

      </form>
    </div>
  );
}