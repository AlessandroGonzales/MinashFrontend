// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const GalleryItem = ({ src, alt, title, subtitle, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className={`group relative overflow-hidden rounded-3xl border border-white/10 ${className}`}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
    {/* Overlay Gradiente */}
    <div className="absolute inset-0 bg-gradient-to-t from-blackDeep/90 via-transparent to-transparent opacity-80" />

    {/* Texto Flotante */}
    <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
      <p className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
        {subtitle}
      </p>
      <p className="text-white text-lg font-bold leading-tight">{title}</p>
    </div>
  </motion.div>
);

export default function HomeHighlightsSection() {
  return (
    <section className="relative w-full bg-blackDeep text-primary py-24 px-6 sm:px-12 lg:px-20 overflow-hidden font-['Satoshi']">
      {/* ================= DIFERENCIACIÓN ================= */}
      <div className="max-w-7xl mx-auto text-center mb-28">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-3xl lg:text-5xl font-extrabold mb-10 pt-20"
        >
          ¿Por qué elegirnos?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-ice max-w-3xl mx-auto text-base sm:text-xl leading-relaxed mb-40 "
        >
          Combinamos precisión, velocidad y una obsesión casi científica por el
          detalle. Cada prenda pasa por un proceso optimizado para garantizar
          resultados consistentes, duraderos y visualmente impactantes.
        </motion.p>
      </div>

      {/* ================= SERVICIO ESTRELLA (CUSTOM) ================= */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-gold text-sm uppercase tracking-widest mb-4">
            Servicio más popular
          </h3>

          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            El Custom
          </h2>

          <p className="text-ice text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
            Haz realidad tus ideas en tus prendas favoritas. Convertimos
            conceptos en piezas únicas que reflejan identidad, actitud y estilo
            propio.
          </p>

          <Link to="/custom">
            <button className="px-6 py-3 rounded-md text-sm uppercase bg-transparent border border-gold text-gold hover:bg-gold/10 transition">
              Quiero mi custom
            </button>
          </Link>
        </motion.div>

        {/* Imagen destacada del custom (placeholder) */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden"
        >
          <img
            src="src/assets/mascotas.webp"
            alt="Servicio Custom"
            className="w-full h-full object-cover"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </motion.div>
      </div>

      {/* ================= COLLAGE CLIENTES (BENTO GRID) ================= */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between  mb-12 px-2">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            Resultados
          </motion.h3>
          <p className="text-ice/60 text-sm font-mono pt-4 md:mt-0 uppercase tracking-widest ">
            Galería de clientes verificada
          </p>
        </div>

        {/* BENTO GRID LAYOUT 
            Mobile: 1 columna o 2 columnas pequeñas
            Desktop: Grid compleja asimétrica
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
          {/* Item 1: Destacado Grande (Vertical en desktop) */}
          <GalleryItem
            src="src/assets/childrens.jpg"
            alt="Niños"
            title="Kids Collection"
            subtitle="Suavidad & Color"
            className="col-span-2 row-span-2 md:col-span-2 md:row-span-2"
            loading="lazy"
          />

          {/* Item 2: Horizontal */}
          <GalleryItem
            src="src/assets/shirt.jpg"
            alt="Camiseta detalle"
            title="High Detail"
            subtitle="Definición"
            className="col-span-2 md:col-span-2 md:row-span-1"
            loading="lazy"

          />

          {/* Item 3: Cuadrado */}
          <GalleryItem
            src="src/assets/love.jpg"
            alt="Pareja"
            title="Duo Sets"
            subtitle="Matching"
            className="col-span-1 md:col-span-1 md:row-span-1"
            loading="lazy"
          />

          {/* Item 4: Cuadrado */}
          <GalleryItem
            src="src/assets/family.jpg"
            alt="Familia"
            title="Family Packs"
            subtitle="Unión"
            className="col-span-1 md:col-span-1 md:row-span-1"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
