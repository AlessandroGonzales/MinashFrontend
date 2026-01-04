// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derivados útiles
  const isAuthenticated = Boolean(token && user);

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // 🔬 Función para decodificar y validar token
  const decodeAndValidateToken = (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      const currentTime = Date.now() / 1000;

      const rawRole =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        decoded.role ||
        decoded["role"];

      const normalizedRole = rawRole?.toLowerCase();

      if (decoded.exp && decoded.exp < currentTime) {
        return null; // Token expirado
      }

      // 🧠 Normalización científica del rol
      let role;
      switch (normalizedRole) {
        case "admin":
        case "administrator":
          role = "Admin";
          break;
        case "cliente":
          role = "Cliente";
          break;
        case "ceo":
          role = "CEO";
          break;
        default:
          role = "Cliente"; 
      }

      return {
        id:
          decoded[
            "http://schemas.xmlsoap.net/ws/2005/05/identity/claims/nameidentifier"
          ] ||
          decoded["nameid"] ||
          decoded.sub,
        name:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || decoded["name"],
        email:
          decoded[
            "http://schemas.xmlsoap.net/ws/2008/06/identity/claims/emailaddress"
          ] || decoded["email"],
        role,
        imageUrl: decoded.imageUrl,
      };
    } catch (error) {
      console.error("Token inválido o corrupto", error);
      return null;
    }
  };

  // 🧠 Inicialización
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const userData = decodeAndValidateToken(storedToken);
      if (userData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(storedToken);
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // 🚪 Login
  const login = (newToken) => {
    const decodedUser = decodeAndValidateToken(newToken);

    if (!decodedUser) {
      throw new Error("Token inválido recibido del servidor");
    }

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(decodedUser);
  };

  // 🚨 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth:logout"));
  };

  // 🎯 Flags
  const isAdmin = user?.role === "Admin";
  const isUser = user?.role === "Cliente";
  const isCEO = user?.role === "CEO";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isUser,
        isCEO,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
