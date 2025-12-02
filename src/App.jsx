import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Servicios from "./pages/services";
import Prendas from "./pages/garments";
import Contacto from "./pages/contact";
import Login from "./pages/login";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-blackDeep min-h-screen text-primary">
        <Navbar />

        <main className="pt-24">
          <Routes>
            <Route path="/services" element={<Servicios />} />
            <Route path="/garments" element={<Prendas />} />
            <Route path="/contact" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
