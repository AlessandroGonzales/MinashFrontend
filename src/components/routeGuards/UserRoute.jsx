// src/components/routeGuards/UserRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserRoute({ children }) {
  const { isAuthenticated, isUser, isAdmin, isCEO ,loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blackDeep">
        <p className="text-gold text-xl animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Cambiado: en vez de ir a /login, va a Home
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isUser || isAdmin || isCEO) {
    return children;
  }

  return <Navigate to="/" replace />;
}