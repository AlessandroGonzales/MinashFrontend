import { BrowserRouter, Routes, Route } from "react-router-dom";
export const API_BASE_URL = "https://localhost:7082"

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Guards
import PrivateRoute from "./components/routeGuards/PrivateRoute";
import AdminRoute from "./components/routeGuards/AdminRoute";
import UserRoute from "./components/routeGuards/UserRoute";

// Pages públicas
import Home from "./pages/home";
import Servicios from "./pages/services";
import Garments from "./pages/garments";
import Contacto from "./pages/contact";
import Login from "./pages/login";
import Serigraphy from "./pages/serigraphy";
import ServiceDetail from "./pages/ServiceDetail";

// Pages privadas
import Profile from "./pages/user/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-blackDeep min-h-screen text-primary">
        <Navbar />

        <main className="pt-24">
          <Routes>

            {/* 🌍 RUTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Servicios />} />
            <Route path="/garments" element={<Garments />} />
            <Route path="/serigraphy" element={<Serigraphy />} />
            <Route path="/contact" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/serigraphy/:id" element={<ServiceDetail />} />

            {/* 🔐 RUTAS PRIVADAS (cualquier usuario logueado) */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* 🧑‍💼 ADMIN (si tenías vistas exclusivas luego se agregan aquí) */}
            {/*
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            */}

          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
