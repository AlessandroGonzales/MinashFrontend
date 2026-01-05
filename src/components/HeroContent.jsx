import logo from "../assets/descarga.png";
import { Link } from "react-router-dom";

export default function HeroContent() {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-36 md:py-48 lg:py-56">
      <div className="absolute inset-0 pointer-events-none"></div>

      <img src={logo} alt="MINASH Logo" className="h-24 w-auto mb-6" />

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase">
        MINASH SportWear
      </h1>

      <p className="max-w-2xl mt-4 text-lg sm:text-xl text-ice">
        Serigrafía, estampado, sublimado y bordado profesional. Transformamos tus ideas en prendas con calidad premium.
      </p>

      <div className="mt-6 flex gap-4">
        <Link to="/services" className="px-6 py-3 border border-steel rounded-md text-sm uppercase hover:bg-gold hover:text-blackDeep transition">
          Ver Servicios
        </Link>
        <Link to="/contact" className="px-6 py-3 rounded-md text-sm uppercase bg-transparent border border-gold text-gold hover:bg-gold/10 transition">
          Contactar
        </Link>
      </div>
    </div>
  );
}
