export default function Footer() {
  return (
    <footer className="bg-blackDeep text-primary py-7 border-t border-steel">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Text */}
        <div>
          <h2 className="text-3xl font-bold tracking-widest text-primary">
            MINASH
          </h2>
          <p className="mt-2 text-ice text-sm leading-relaxed">
            Sport Wear & Serigrafía profesional. Diseños premium para marcas y
            emprendedores.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gold">Navegación</h3>
          
          <ul className="space-y-1">
          <button><li className="hover:text-gold transition">Inicio</li></button>
          <br/>
          <button><li className="hover:text-gold transition">Serigrafia</li></button>
          <br/>
          <button><li className="hover:text-gold transition">Servicios</li></button>
          <br/>
          <button><li className="hover:text-gold transition">Contacto</li></button>
          </ul>
          
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gold">Contacto</h3>
          <p className="text-ice text-sm">Cordoba, Argentina</p>
          <p className="text-ice text-sm">ronygook95@gmail.com</p>
          <p className="text-ice text-sm">+54 351 350-1278</p>
        </div>
      </div>
      <div className="text-center text-ice mt-10  text-sm border-t border-steel pt-6">
        © {new Date().getFullYear()} MINASH — Todos los derechos reservados.
      </div>
    </footer>
  );
}
