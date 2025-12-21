// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function WelcomeMessage({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
    >
      {/* FONDO DESENFOCADO */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />

      {/* CARTEL */}
      <div
        className="
          relative bg-graphite border border-gold/40
          px-12 py-7
          sm:px-12 sm:py-7
          lg:px-12 lg:py-8
          rounded-3xl shadow-2xl
          max-w-[95%] sm:max-w-lg md:max-w-xl   /* ← Cambio principal aquí */
          text-center
        "
      >
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gold sm:mb-3">
          ¡Bienvenido{ name ? `, ${name}` : "" } a Minash!
        </h3>

        <p className="text-sm sm:text-base text-ice leading-relaxed">
          Muchas gracias por elegirnos.
          <br />
          Ahora podrás crear lo inimaginable en tus prendas.
        </p>
      </div>
    </motion.div>
  );
}