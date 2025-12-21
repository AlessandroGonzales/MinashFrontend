// src/components/routeGuards/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-blackDeep flex items-center justify-center"><p className="text-gold">Cargando...</p></div>;

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}