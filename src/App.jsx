import { BrowserRouter, Routes, Route } from "react-router-dom";
export const API_BASE_URL = "https://localhost:7082";

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
import Contacto from "./pages/contact";
import Login from "./pages/login";
import Serigraphy from "./pages/serigraphy";
import ServiceDetail from "./pages/ServiceDetail";
import Cart from "./pages/cart/cart";
import FullServices from "./pages/FullService";
import FullServiceDetails from "./pages/FullServiceDetails";
import CustomService from "./pages/custom";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./ScrollToTop";

// Pages privadas
import Profile from "./pages/user/Profile";
import MyOrders from "./pages/myOrders";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-blackDeep min-h-screen text-primary">
        <Navbar />
        <div className="mb-16"></div>
        <main className="">
          <Routes>
            {/* 🌍 RUTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/services" element={<Servicios />} />
            <Route path="/serigraphy" element={<Serigraphy />} />
            <Route path="/contact" element={<Contacto />} />
            <Route path="/serigraphy/:id" element={<ServiceDetail />} />
            <Route path="/fullServices" element={<FullServices />} />
            <Route path="/fullServices/:id" element={<FullServiceDetails />} />
            <Route path="/custom" element={<CustomService />} />
            

            {/* 🔐 RUTAS PRIVADAS (cualquier usuario logueado) */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/carrito"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="myordenes"
              element={
                <PrivateRoute>
                  <MyOrders />
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
