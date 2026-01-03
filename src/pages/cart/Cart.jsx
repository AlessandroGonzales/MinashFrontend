import { useEffect, useState } from "react";
import { getDraftOrder } from "../../services/authService";
import { getDisplayImageUrl } from "../../Utils/ImageUtils";
import { ShoppingCart } from "lucide-react";

// Iconos SVG simples para no depender de librerías externas
const Icons = {
  Bag: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Arrow: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  Tag: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  ),
};

export default function Cart() {
  const [order, setOrder] = useState(null);
  const [detailsOrders, setDetailsOrders] = useState([]);
  const [customs, setCustoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getDraftOrder();
        setOrder(data);
        setDetailsOrders(data.detailsOrders ?? []);
        setCustoms(data.customs ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // --- UI STATES ---

  if (loading) {
    return (
      <div className="min-h-screen bg-blackDeep flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-t-2 border-gold rounded-full animate-spin"></div>
        <p className="text-ice tracking-widest uppercase text-xs animate-pulse">
          Cargando Sistema...
        </p>
      </div>
    );
  }

  const hasItems = detailsOrders.length > 0 || customs.length > 0;

  if (!hasItems) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="text-steel mb-6 opacity-50">
          <Icons.Bag />
        </div>
        <h2 className="text-2xl font-light text-primary mb-2">
          Tu bolsa está vacía
        </h2>
        <p className="text-ice text-sm mb-8 max-w-md">
          Parece que aún no has añadido nada a tu colección.
        </p>
        <button className="px-8 py-3 bg-transparent border border-steel text-primary text-sm uppercase tracking-wider hover:bg-white hover:text-blackDeep transition-all duration-300">
          Explorar Catálogo
        </button>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-blackDeep text-primary pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* HEADER */}
        <header className="mb-14 pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight">
              Tu <span className="text-gold font-normal">Carrito</span>
            </h1>
            <p className="text-steel text-sm mt-2">
              Revisa cada detalle antes de continuar
            </p>
          </div>

          <div className="flex items-center gap-3 text-ice text-sm">
            <ShoppingCart size={18} className="opacity-70" />
            <span className="tracking-widest uppercase">
              {detailsOrders.length + customs.length} productos
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
          <div className="lg:col-span-8 space-y-0 divide-y divide-steel/20">
            {/* 1. SERVICIOS (Standard Items) */}
            {detailsOrders.map((item) => (
              <div
                key={item.idDetailsOrder}
                className="py-8 px-2 rounded-xl transition-all duration-500
             hover:bg-white/5 hover:shadow-xl hover:shadow-blackDeep/40 group"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* IMAGEN DEL SERVICIO */}
                  <div className="w-full sm:w-40 aspect-square bg-graphite rounded-sm overflow-hidden border border-steel/20 shrink-0 relative">
                    {item.imageUrl ? (
                      <img
                        src={getDisplayImageUrl(item.imageUrl)}
                        alt={item.serviceName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-steel/40">
                        <Icons.Tag />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-medium text-primary tracking-wide uppercase">
                            {item.serviceName ||
                              `Servicio #${
                                item.idService ?? item.idGarmentService
                              }`}
                          </h3>
                          <p className="text-xs text-steel mt-1 uppercase tracking-widest">
                            ID Ref:{" "}
                            {item.idService
                              ? `SRV-${item.idService}`
                              : `GRM-${item.idGarmentService}`}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-gold font-bold text-lg">
                            ${item.subTotal?.toLocaleString("en-US")}
                          </p>
                          <p className="text-xs text-steel">
                            ${item.unitPrice?.toLocaleString("en-US")} unit
                          </p>
                        </div>
                      </div>

                      {/* ATRIBUTOS SELECCIONADOS */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <div
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-gradient-to-r from-gold/20 to-gold/5
                  border border-gold/30"
                        >
                          <span className="w-2 h-2 rounded-full bg-gold"></span>
                          <span className="text-xs uppercase tracking-wider text-ice">
                            {item.selectedColor}
                          </span>
                        </div>

                        {item.selectedSize && (
                          <div
                            className="px-3 py-1.5 rounded-full bg-steel/10 border border-steel/30
                    text-xs uppercase tracking-wider text-ice
                    animate-[fadeInUp_0.3s_ease-out_forwards]"
                          >
                            Talla {item.selectedSize}
                          </div>
                        )}
                      </div>

                      {/* DETALLES ADICIONALES */}
                      {item.details && (
                        <div className="bg-blackDeep/30 p-3 border-l mt-6 border-gold/50">
                          <p className="text-steel text-sm italic leading-relaxed line-clamp-2">
                            "{item.details}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CONTADOR DE ITEMS */}
                    <div className="mt-6 flex items-center justify-between border-t border-steel/10 pt-4">
                      <p className="text-xs text-ice uppercase tracking-widest">
                        Cantidad:{" "}
                        <span className="text-primary font-bold ml-1">
                          {item.count}
                        </span>
                      </p>

                      {/* Acción Opcional: Eliminar */}
                      <button className="text-[12px] text-steel hover:text-gold uppercase tracking-widest transition-colors">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 2. CUSTOMS (Productos Personalizados) */}
            {customs.map((custom) => (
              <div
                key={custom.idCustom}
                className="py-8 px-2 rounded-xl transition-all duration-500
             hover:bg-white/5 hover:shadow-xl hover:shadow-blackDeep/40 group"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Imagen del producto */}
                  <div className="w-full sm:w-40 aspect-square bg-graphite rounded-sm overflow-hidden border border-steel/20 shrink-0 relative">
                    {custom.imageUrl?.[0] ? (
                      <img
                        src={getDisplayImageUrl(custom.imageUrl[0])}
                        alt="Custom Product"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-steel/40">
                        <span className="text-xs uppercase">No IMG</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-medium text-primary tracking-wide">
                          Diseño Personalizado
                        </h3>
                        <div className="text-right">
                          <p className="text-gold font-bold text-lg">
                            ${custom.customTotal}
                          </p>
                          <p className="text-xs text-steel">
                            ${custom.totalPrice} unit
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <div
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-gradient-to-r from-gold/20 to-gold/5
                  border border-gold/30"
                        >
                          <span className="w-2 h-2 rounded-full bg-gold"></span>
                          <span className="text-xs uppercase tracking-wider text-ice">
                            {custom.selectedColor}
                          </span>
                        </div>

                        {custom.selectedSize && (
                          <div
                            className="px-3 py-1.5 rounded-full bg-steel/10 border border-steel/30
                    text-xs uppercase tracking-wider text-ice
                    animate-[fadeInUp_0.3s_ease-out_forwards]"
                          >
                            Talla {custom.selectedSize}
                          </div>
                        )}
                      </div>
                      {custom.customerDetails && (
                        <div className="bg-blackDeep/30 p-3 border-l mt-6 border-gold/50">
                          <p className="text-steel text-sm italic leading-relaxed line-clamp-2">
                            "{custom.customerDetails}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-steel/10 pt-4">
                      <p className="text-xs text-ice uppercase tracking-widest">
                        Items:{" "}
                        <span className="text-primary font-bold ml-1">
                          {custom.count}
                        </span>
                      </p>
                      <button className="text-[12px] text-steel hover:text-gold uppercase tracking-widest transition-colors">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: RESUMEN (Sticky) */}
          <div className="lg:col-span-4 ">
            <div className="sticky top-24 bg-graphite/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl ">
              <h3 className="text-lg font-light text-primary mb-6 border-b border-steel/30 pb-4">
                Resumen de Orden
              </h3>

              <div className="space-y-4 mb-8 ">
                <div className="flex justify-between text-ice text-sm">
                  <span>Subtotal</span>
                  <span>${order?.total?.toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between text-ice text-sm">
                  <span>Envío</span>
                  <span className="text-steel italic">Calculado al final</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-steel/30 pt-6 mb-8">
                <span className="text-primary text-lg font-medium">
                  Total Estimado
                </span>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-gold tracking-tight">
                    ${order?.total?.toLocaleString("en-US")}
                  </span>
                  <span className="text-xs text-steel uppercase tracking-wider">
                    Inc. Impuestos
                  </span>
                </div>
              </div>

              <button className="w-full bg-gold hover:bg-[#B89655] text-blackDeep font-bold py-4 px-6 rounded-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group">
                Checkout
                <span className="group-hover:translate-x-1 transition-transform">
                  <Icons.Arrow />
                </span>
              </button>

              <p className="mt-4 text-center text-steel text-xs">
                Pagos seguros y encriptados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
