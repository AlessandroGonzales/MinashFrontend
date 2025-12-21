import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blackDeep">
        <p className="text-gold text-xl">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirige al login manteniendo la ruta a la que quería ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}