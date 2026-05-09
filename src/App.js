import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Wishlist from "./pages/Wishlist";
import Success from "./pages/Success";



/* 🔥 Handles token from Google login */
function TokenHandler() {
  const navigate = useNavigate();
  const { login } = useAuth();
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const theme = localStorage.getItem("theme");

    if (token) {
      login(token); // ✅ store token + fetch user
      navigate("/", { replace: true }); // ✅ clean URL (no reload)
    }
    if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }
  }, []);

  return null;
}

/* Main App Content */
function AppContent() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <Navbar />

      <div className="p-6">
        <Routes>
           {/* Public */}
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Login />} />
           <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/success" element={<Success />} />
           <Route path="/wishlist" element={<Wishlist />} />
          {/* 🔐 Protected (login required) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
            />
              {/* 🔐 Admin only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

/* 🔥 Root App */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />

        {/* ✅ Handles token globally */}
        <TokenHandler />

        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;