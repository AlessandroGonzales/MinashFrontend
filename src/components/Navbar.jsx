import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/descarga.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-graphite bg-opacity-90 backdrop-blur-md shadow-lg border-b border-steel/40">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Minash Logo" className="h-10 w-auto brightness-200" />
        </Link>

        {/* ---- Menu Center (Desktop) ---- */}
        <ul className="hidden lg:flex gap-12 text-primary tracking-wide text-sm uppercase">
          <li><Link to="/" className="hover:text-gold transition">Inicio</Link></li>
          <li><Link to="/services" className="hover:text-gold transition">Servicios</Link></li>
          <li><Link to="/garments" className="hover:text-gold transition">Prendas</Link></li>
          <li><Link to="/contact" className="hover:text-gold transition">Contacto</Link></li>
        </ul>

        {/* ---- Login Icon (Desktop) ---- */}
        <Link to="/login" className="hidden lg:flex text-primary hover:text-gold transition">
          <User size={24} />
        </Link>

        {/* ---- Mobile Button ---- */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-primary"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* ---- Mobile Menu ---- */}
      {open && (
        <div className="lg:hidden bg-blackDeep text-primary px-6 py-6 border-t border-steel space-y-6">
          <Link to="/" onClick={() => setOpen(false)} className="block hover:text-gold">Inicio</Link>
          <Link to="/services" onClick={() => setOpen(false)} className="block hover:text-gold">Servicios</Link>
          <Link to="/garments" onClick={() => setOpen(false)} className="block hover:text-gold">Prendas</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="block hover:text-gold">Contacto</Link>
          <Link to="/login" onClick={() => setOpen(false)} className="block hover:text-gold flex items-center gap-2">
            <User size={20} /> Iniciar Sesión
          </Link>
        </div>
      )}
    </header>
  );
}
