import { MapPin, Mail, Phone, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blackDeep text-primary py-7 border-t border-steel">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Text */}
        <div>
          <h2 className="text-3xl font-bold tracking-widest text-primary glow">
            MINASH
          </h2>
          <p className="mt-2 text-ice text-base leading-relaxed">
            Sport Wear & Serigrafía profesional. Diseños premium para marcas y
            emprendedores.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gold">
            ¿Listo para tu marca?
          </h3>

          <p className="text-ice text-sm">
            Diseñamos prendas únicas para tu negocio.
          </p>
          <Link to={"/contact"}>
            <button className="px-3 py-2 rounded-md text-sm uppercase bg-transparent border border-gold text-gold hover:bg-gold/30 transition inline-block mt-3">
              Cotizar ahora
            </button>
          </Link>
        </div>
        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gold">Contacto</h3>

          {/* Ubicación */}
          <div className="flex items-center gap-3 text-ice text-base">
            <MapPin className="text-gold" size={22} strokeWidth={1.5} />
            <span>Córdoba, Argentina</span>
          </div>

          {/* Email */}
          <a
            href="mailto:ronygook95@gmail.com"
            className="flex items-center gap-3 text-ice text-base hover:text-gold transition"
          >
            <Mail className="text-gold" size={22} strokeWidth={1.5} />
            <span>ronygook95@gmail.com</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/543513501278"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-ice text-base hover:text-green-400 transition"
          >
            <FaWhatsapp
              className="text-green-500"
              size={22}
              strokeWidth={1.5}
            />
            <span>+54 351 350-1278</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/minashsportwear"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-ice text-base hover:text-pink-400 transition"
          >
            <Instagram className="text-pink-500" size={22} strokeWidth={1.5} />
            <span>@minashsportwear</span>
          </a>
        </div>
      </div>

      <div className="text-center text-ice mt-10  text-sm border-t border-steel pt-6">
        © {new Date().getFullYear()} MINASH — Todos los derechos reservados.
      </div>
    </footer>
  );
}
