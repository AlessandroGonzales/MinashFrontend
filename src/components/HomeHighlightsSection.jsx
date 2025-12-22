// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function HomeHighlightsSection() {
  return (
    <section className="relative w-full bg-blackDeep text-primary py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
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

      {/* ================= SERVICIO ESTRELLA ================= */}
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

          <button className="px-10 py-4 border border-gold text-gold font-semibold rounded-md hover:bg-gold/10 transition">
            Quiero mi custom
          </button>
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
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </motion.div>
      </div>

      {/* ================= COLLAGE CLIENTES ================= */}
      <div className="max-w-7xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl sm:text-4xl font-extrabold mb-12"
        >
          Clientes que ya lo vivieron
        </motion.h3>

        {/* MOBILE: layout simple */}
        <div className="flex flex-col items-center gap-6 sm:hidden">
          {["childrens.jpg", "shirt.jpg", "love.jpg", "family.jpg"].map(
            (img, i) => (
              <img
                key={i}
                src={`src/assets/${img}`}
                alt={`Cliente ${i + 1}`}
                className="w-64 rounded-xl shadow-lg"
              />
            )
          )}
        </div>

        {/* DESKTOP: collage artístico */}
        <div className="relative w-full h-[740px] hidden sm:block">
          <img
            src="src/assets/childrens.jpg"
            alt="Cliente 1"
            className="absolute top-10 left-5 w-56 lg:w-64 rounded-xl shadow-lg rotate-[-4deg]"
          />

          <img
            src="src/assets/shirt.jpg"
            alt="Cliente 2"
            className="absolute top-20 right-1 w-60 lg:w-72 rounded-xl shadow-lg "
          />

          <img
            src="src/assets/love.jpg"
            alt="Cliente 3"
            className="absolute bottom-20 left-1/4 w-64 lg:w-80 rounded-xl shadow-lg rotate-[2deg]"
          />

          <img
            src="src/assets/family.jpg"
            alt="Cliente 4"
            className="absolute bottom-2 right-28 w-56 lg:w-64 rounded-xl shadow-lg rotate-[2deg]"
          />
        </div>
      </div>
    </section>
  );
}
