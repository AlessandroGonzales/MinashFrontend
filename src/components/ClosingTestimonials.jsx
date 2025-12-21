// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export function ClosingTestimonials() {
  return (
    <section className="max-w-6xl mx-auto mt-32 px-6 sm:px-12 text-center">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-extrabold mb-6"
      >
        Comentarios de nuestros clientes
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-ice max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mb-16"
      >
        En <span className="text-gold font-semibold">Minash</span> trabajamos
        siempre para potenciar la creatividad de nuestros clientes. Creemos que
        las mejores ideas nacen del diálogo, por eso escuchamos cada crítica,
        cada sugerencia y cada detalle. Estas son algunas de las experiencias
        que construimos juntos.
      </motion.p>

      {/* TESTIMONIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-blackSoft border border-white/10 rounded-2xl p-8 text-left shadow-lg"
        >
          <p className="text-ice text-sm leading-relaxed mb-6">
            "Trabajar con Minash fue exactamente lo que buscaba. Supieron
            entender la idea desde el primer momento y el resultado superó
            completamente mis expectativas."
          </p>
          <span className="text-gold font-semibold">Sebastian Herrera</span>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-blackSoft border border-white/10 rounded-2xl p-8 text-left shadow-lg"
        >
          <p className="text-ice text-sm leading-relaxed mb-6">
            "Me gustó mucho la atención al detalle. No es solo estampar una
            prenda, es acompañarte en todo el proceso creativo. Se nota la
            pasión detrás de Minash."
          </p>
          <span className="text-gold font-semibold">Alessandro Gonzales</span>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blackSoft border border-white/10 rounded-2xl p-8 text-left shadow-lg"
        >
          <p className="text-ice text-sm leading-relaxed mb-6">
            "Rony me escucho atentamente. Cada comentario fue tomado en
            cuenta y eso se refleja en la calidad final. Sin dudas volvería a
            elegir Minash."
          </p>
          <span className="text-gold font-semibold">Claudia Pellegrini</span>
        </motion.div>
      </div>
    </section>
  );
}
