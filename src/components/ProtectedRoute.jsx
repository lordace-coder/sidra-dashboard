import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
