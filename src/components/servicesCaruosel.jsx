// TeslaCarousel.jsx (Fix final)
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDisplayImageUrl } from "../Utils/ImageUtils";
import useFetchServices from "../hooks/useFetchServices";
import { Link } from "react-router-dom";

// Tarjeta de cada servicio
const ServiceCard = ({ service }) => {
  if (!service)
    return <div className="hidden sm:block flex-1 bg-gray-900/50"></div>;


  const baseClasses =
    "relative w-full h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer";

  const contentClasses =
    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12 text-white";

 
  return (
    <motion.div
      key={service?.idGarmentService}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={baseClasses}
    >
      <img
        src={getDisplayImageUrl(service.imageUrl)}
        alt={service.garmentServiceName ?? "Servicio"}
        className="w-full h-full object-cover"
      />

      <div className={contentClasses}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {service.garmentServiceName ?? "Servicio"}
        </h2>

        <p className="text-base mb-6 max-w-md">
          {service.garmentServiceDetails ||
            "Consulta más detalles sobre este servicio."}
        </p>

        <div className="flex gap-4">
          <Link to="/fullServices">
          <button className="px-5 py-3 rounded-md text-xs uppercase bg-transparent border border-gold text-gold hover:bg-gold/10 transition">
            SABER MAS
          </button>
          </Link>
          <button className="px-5 py-3 rounded-md text-xs uppercase bg-transparent border border-gold text-gold hover:bg-gold/10 transition">
            SOLICITAR
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function ServicesCarousel() {
  const { services, loading, error } = useFetchServices();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!services || services.length === 0) return; 

    const id = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (services.length > 0 ? (prev + 1) % services.length : prev));
    }, 4000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services?.length]);

  const next = () => {
    if (!services || services.length === 0) return;
    setDirection(1);
    setIndex((prev) => (prev + 1) % services.length);
  };

  const prev = () => {
    if (!services || services.length === 0) return;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + services.length) % services.length);
  };

    if (loading) {
    return (
      <div className=" bg-blackDeep flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-t-2 border-gold rounded-full animate-spin"></div>
        <p className="text-ice tracking-widest uppercase text-xs animate-pulse">
          Cargando Sistema...
        </p>
      </div>
    );
  }
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!services || services.length === 0) return <p className="text-center py-10">No hay servicios disponibles.</p>;

  const safeIndex = Number.isFinite(index) ? ((Math.floor(index) % services.length) + services.length) % services.length : 0;
  if (safeIndex !== index) setIndex(safeIndex);

  const leftIndex = (safeIndex - 1 + services.length) % services.length;
  const centerIndex = safeIndex;
  const rightIndex = (safeIndex + 1) % services.length;

  const leftService = services[leftIndex] ?? null;
  const centerService = services[centerIndex] ?? null;
  const rightService = services[rightIndex] ?? null;

  if (!leftService || !centerService || !rightService) {
    return <p className="text-center py-10">Cargando servicios…</p>;
  }

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 0,
    }),
  };

  return (
    <div className="relative w-full h-[65vh] lg:h-[80vh] bg-gray-900 ">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr] w-full h-full">
        <div className="relative hidden sm:block h-full opacity-70 transition-all">
          <ServiceCard service={leftService} />
        </div>

        <div className="relative h-full scale-105 z-10 overflow-hidden rounded-xl lg:rounded-2xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={centerService?.idGarmentService ?? centerIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <ServiceCard service={centerService} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative hidden sm:block h-full opacity-60 blur-[1px] transition-all">
          <ServiceCard service={rightService} />
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full text-white hover:bg-black/60 transition z-20"
      >
        <ChevronLeft size={26} />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full text-white hover:bg-black/60 transition z-20"
      >
        <ChevronRight size={26} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 ">
        {services.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > safeIndex ? 1 : -1);
              setIndex(i);
            }}
            className={`w-3 h-3 rounded-full ${
              i === safeIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ir al servicio ${i + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
