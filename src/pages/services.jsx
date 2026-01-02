import { useState } from "react";
import { ArrowRight, Shirt, Palette, Brush, Link } from "lucide-react"; // Iconos minimalistas (instala lucide-react)
import { useNavigate } from "react-router-dom";
const services = [
  {
    id: "custom",
    title: "Custom",
    description:
      "Diseño 100% personalizado. Tú defines cada detalle de la serigrafía en tus prendas.",
    icon: <Brush className="w-12 h-12 text-gold" />,
    hoverText: "Tu visión, nuestra aplicación precisa",
    comingSoon: false,
  },
  {
    id: "full",
    title: "Servicio Completo",
    description:
      "Desde el diseño inicial hasta la entrega final de prendas serigrafiadas listas para usar.",
    icon: <Shirt className="w-12 h-12 text-gold" />,
    hoverText:
      "Paquetes integrales • Diseños predefinidos y ejecución impecable",
    comingSoon: false,
  },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const navigations = () => {
    navigate("/fullServices")
  }
  return (
    <div className="min-h-screen bg-blackDeep text-primary py-16 md:py-14 px-6 md:px-12 lg:px-24">
      {/* Título principal con efecto sutil */}
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-satoshi font-bold ">
          Nuestros <span className="text-gold">Servicios</span>
        </h1>
        <p className="mt-6 text-steel text-lg md:text-xl max-w-2xl mx-auto">
          Dos caminos. Un objetivo: llevar tu prenda al siguiente nivel.
        </p>
      </div>

      {/* Contenedor de las dos cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            onMouseEnter={() => setHovered(service.id)}
            onMouseLeave={() => setHovered(null)}
            className={`
              group relative overflow-hidden rounded-3xl border border-steel/30 
              bg-graphite/40 backdrop-blur-xl transition-all duration-700
              hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/10
              cursor-pointer min-h-[520px] md:min-h-[550px]
              flex flex-col justify-between p-10 md:p-12
              ${service.comingSoon ? "opacity-60 pointer-events-none" : ""}
            `}
          >
            {/* Fondo con efecto futurista sutil */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
              <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_70%,rgba(201,168,106,0.12),transparent_50%)]" />
            </div>

            {/* Contenido principal */}
            <div className="relative z-10">
              {/* Icono grande */}
              <div className="mb-10 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                {service.icon}
              </div>

              <h2 className="text-4xl md:text-5xl font-satoshi font-bold mb-6 tracking-tight">
                {service.title}
                {service.comingSoon && (
                  <span className="ml-4 text-sm md:text-base font-normal text-steel align-middle">
                    (Próximamente)
                  </span>
                )}
              </h2>

              <p className="text-lg md:text-1xl text-ice/90 mb-10 leading-relaxed">
                {service.description}
              </p>

              {/* Texto que aparece al hover */}
              <div
                className={`
                  overflow-hidden transition-all duration-700
                  ${
                    hovered === service.id
                      ? "max-h-32 opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
              >
                <p className="text-gold text-lg md:text-lg font-medium">
                  {service.hoverText}
                </p>
              </div>
            </div>

            {/* Botón / llamada a acción */}
            {!service.comingSoon && (
              <div className="relative z-10 mt-auto">
                <button
                onClick={navigations}
                  className="
                    group/btn flex items-center gap-3 text-gold font-medium text-lg md:text-xl
                    transition-all duration-500 hover:text-primary
                  "
                >
                    <span className="relative">
                      Conocer más
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover/btn:w-full transition-all duration-500" />
                    </span>
                  <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover/btn:translate-x-2" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Texto inferior opcional */}
      <div className="text-center mt-16 md:mt-24 text-steel text-sm md:text-base">
        Personaliza tus prendas con serigrafía de alta calidad • 2026
      </div>
    </div>
  );
}
