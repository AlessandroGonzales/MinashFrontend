// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Package,
  ShoppingCart,
  UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/descarga.png";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./auth/AuthModal";
import { getDisplayImageUrl } from "../Utils/ImageUtils";
import { toastBye } from "../Utils/toast";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowUserMenu(false);
    setOpen(false);
  }, [navigate]);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/", { replace: true });
    toastBye(`Esperamos verte pronto, ${user.name} `);
  };

  const closeUserMenu = () => setShowUserMenu(false);

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-50 h-16 bg-graphite/90 backdrop-blur-md shadow-lg border-b border-steel/40">
        <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Minash Logo"
              className="h-12 w-auto brightness-200"
            />
          </Link>

          {/* Menu Center (Desktop) */}
          <ul className="hidden lg:flex gap-12 text-primary tracking-wide text-sm uppercase font-satoshi">
            <li>
              <Link to="/" className="hover:text-gold transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/serigraphy" className="hover:text-gold transition">
                Serigrafia
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-gold transition">
                Servicios
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold transition">
                Contacto
              </Link>
            </li>
          </ul>

          {/* User Icon SOLO Desktop */}
          <div className="relative hidden lg:block">
            <button
              onClick={handleUserClick}
              className="flex items-center gap-2 text-primary hover:text-gold transition"
            >
              {isAuthenticated && user?.imageUrl ? (
                <img
                  src={getDisplayImageUrl(user.imageUrl)}
                  alt="Foto de perfil"
                  className="w-12 h-12 rounded-full object-cover "
                />
              ) : (
                <UserCircle size={35} />
              )}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-primary"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div className="lg:hidden bg-black/70 text-primary px-6 py-5 border-t border-steel space-y-6 ">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block hover:text-gold"
            >
              Inicio
            </Link>
            <Link
              to="/serigraphy"
              onClick={() => setOpen(false)}
              className="block hover:text-gold"
            >
              Serigrafia
            </Link>
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="block hover:text-gold"
            >
              Servicios
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block hover:text-gold"
            >
              Contacto
            </Link>

            {/* BOTÓN DE USUARIO EN MÓVIL – ahora con foto de perfil si existe */}
            <button
              onClick={() => {
                setOpen(false);
                handleUserClick();
              }}
              className="flex items-center gap-3 hover:text-gold transition "
            >
              <span className="text-lg">
                {isAuthenticated ? `${user.name}` : "Iniciar sesión"}
              </span>
              {isAuthenticated && user?.imageUrl ? (
                <img
                  src={getDisplayImageUrl(user.imageUrl)}
                  alt="Foto de perfil"
                  className="w-12 h-12 rounded-full object-cover "
                />
              ) : (
                <User size={24} />
              )}
            </button>
          </div>
        )}
      </header>

      {/* MENÚ DE USUARIO UNIFICADO – cambia estilo según pantalla */}
      {showUserMenu && isAuthenticated && (
        <>
          {/* Fondo desenfocado */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeUserMenu}
          />

          {/* Menú condicional: desktop pequeño a la derecha, móvil grande centrado */}
          <div
            className={`
              fixed z-50 bg-graphite rounded-2xl shadow-2xl border border-steel/50 overflow-hidden
              ${
                window.innerWidth >= 1024
                  ? "right-56 top-20 w-64"
                  : "inset-x-4 top-20 max-w-md mx-auto"
              }
            `}
          >
            <div
              className={`p-5 border-b border-steel/30 ${
                window.innerWidth < 1024 ? "text-center" : ""
              }`}
            >
              <p className="text-gold font-semibold text-lg">
                {user?.userName || user?.name}
              </p>
              <p className="text-ice text-sm">{user?.email}</p>
            </div>

            <ul className="py-2">
              <button
                onClick={closeUserMenu}
                className="absolute top-4 right-4 text-ice hover:text-gold transition"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
              <li>
                <Link
                  to="/profile"
                  onClick={closeUserMenu}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-steel/30 transition"
                >
                  <User size={18} /> Mi Perfil
                </Link>
              </li>
              <li>
                <Link
                  to="/misordenes"
                  onClick={closeUserMenu}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-steel/30 transition"
                >
                  <Package size={18} /> Mis Órdenes
                </Link>
              </li>
              <li>
                <Link
                  to="/carrito"
                  onClick={closeUserMenu}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-steel/30 transition"
                >
                  <ShoppingCart size={18} /> Mi Carrito
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-900/30 text-red-400 transition"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
