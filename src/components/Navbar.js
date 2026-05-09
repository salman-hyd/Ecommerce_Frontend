import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  ShoppingCart,
  Heart,
  Moon,
  LayoutDashboard,
  Store
} from "lucide-react";

function Navbar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDark = () => {
    const isDark =
      document.documentElement.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );
  };

  return (

    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          <Store size={28} />
          <span>E-Commerce</span>
        </Link>

        {/* CENTER LINKS */}
        <div className="hidden md:flex items-center gap-8 font-medium">

          <Link
            to="/"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
          >
            <ShoppingCart size={20} />
            Cart
          </Link>

          <Link
            to="/wishlist"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-pink-500 transition"
          >
            <Heart size={20} />
            Wishlist
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-green-500 transition"
            >
              <LayoutDashboard size={20} />
              Admin
            </Link>
          )}

        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">

          {/* DARK MODE */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition"
          >
            <Moon
              size={20}
              className="text-gray-700 dark:text-yellow-300"
            />
          </button>

          {user ? (
            <div className="flex items-center gap-3">

              {/* PROFILE IMAGE */}
              <img
                src={
                  user.image ||
                  `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
              />

              {/* USER NAME */}
              <span className="hidden sm:block font-medium text-gray-700 dark:text-gray-200">
                {user.name}
              </span>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
              >
                Logout
              </button>

            </div>
          ) : (

            <Link
              to="/login"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl transition"
            >
              Login
            </Link>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;