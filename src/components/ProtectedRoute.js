import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  //  Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  Not admin but trying admin route
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  //  Allowed
  return children;
}

export default ProtectedRoute;