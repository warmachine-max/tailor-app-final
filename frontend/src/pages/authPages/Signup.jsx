import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaUserPlus, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

export default function Signup({ closeModal }) {
  const { refetchUser, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password },
        { withCredentials: true }
      );

      const payloadUser = res.data?.user ?? res.data ?? null;

      // Attempt to refetch user (cookie-based)
      try {
        await refetchUser();
      } catch (inner) {
        if (payloadUser) {
          setUser({
            _id: payloadUser._id,
            name: payloadUser.name,
            email: payloadUser.email,
            role: payloadUser.role,
          });
        }
      }

      setError("");
      if (typeof closeModal === "function") closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed. Please check your details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, type, value, onChange, placeholder, isPassword = false, required = true }) => {
    return (
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={loading}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-5 w-full max-w-sm bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
    >
      <h2 className="text-3xl font-extrabold text-gray-900 text-center flex items-center justify-center space-x-2">
        <FaUserPlus className="w-6 h-6 text-indigo-600" />
        <span>Create Account</span>
      </h2>

      {/* Error Message with Icon */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm font-medium transition duration-300">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-1">{error}</span>
        </div>
      )}

      {/* Name Input */}
      <InputField
        icon={FaUserPlus}
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Email Input */}
      <InputField
        icon={FaEnvelope}
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password Input with Toggle */}
      <InputField
        icon={FaLock}
        type={showPassword ? "text" : "password"}
        placeholder="Password (Min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isPassword={true}
      />

      {/* Submit Button with Loading State */}
      <button
        className="flex items-center justify-center bg-indigo-600 text-white p-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:shadow-none"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Sign Up Now"
        )}
      </button>

      {/* Privacy Note */}
      <p className="text-center text-xs text-gray-500 mt-2">
        By clicking "Sign Up Now", you agree to our Terms of Service.
      </p>
    </form>
  );
}