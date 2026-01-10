import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CEORoute({ children }) {
  const { isCEO, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-blackDeep flex items-center justify-center"><p className="text-gold">Cargando...</p></div>;

  if (!isCEO) {
    return <Navigate to="/" />;
  }

  return children;
}