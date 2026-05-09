import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  ShoppingBag,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    const t = toast.loading("Logging in...");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful ✅", { id: t });

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      console.log(err.response?.data || err.message);

      toast.error(
        err.response?.data?.message || "Login failed ❌",
        { id: t }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-500 p-4 rounded-2xl shadow-lg">
            <ShoppingBag className="text-white w-8 h-8" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-8">
          Login to continue shopping
        </p>

        {/* EMAIL */}
        <div className="relative mb-5">
          <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3 rounded-xl
              bg-gray-100 dark:bg-gray-800
              text-gray-900 dark:text-white
              border border-transparent
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/30
              outline-none transition-all
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full pl-11 pr-12 py-3 rounded-xl
              bg-gray-100 dark:bg-gray-800
              text-gray-900 dark:text-white
              border border-transparent
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/30
              outline-none transition-all
            "
          />

          {/* SHOW PASSWORD */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full bg-blue-500 hover:bg-blue-600
            text-white font-semibold py-3 rounded-xl
            transition-all duration-200
            hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-50
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>

          <span className="text-gray-400 text-sm">OR</span>

          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={() =>
            (window.location.href =
              "http://localhost:5000/api/auth/google")
          }
          className="
            w-full flex items-center justify-center gap-3
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-700 dark:text-gray-200
            py-3 rounded-xl
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-all
          "
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="google"
            className="w-5 h-5"
          />

          Continue with Google
        </button>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Don&apos;t have an account?{" "}

          <span
            onClick={() => navigate("/register")}
            className="
              text-blue-500 hover:text-blue-600
              font-semibold cursor-pointer
            "
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;