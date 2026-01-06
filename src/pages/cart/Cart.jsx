import { useEffect, useState } from "react";
import {
  getDraftOrder,
  deleteDetailsOrderById,
  deleteCustomById,
  createMercadoPagoPreference,
} from "../../services/authService";
import { getDisplayImageUrl } from "../../Utils/ImageUtils";
import { toastSuccess } from "../../Utils/toast";
import {
  Trash2,
  Package,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [order, setOrder] = useState(null);
  const [detailsOrders, setDetailsOrders] = useState([]);
  const [customs, setCustoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
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

  const handleDeleteDetailsOrder = async (id) => {
    try {
      await deleteDetailsOrderById(id);
      const data = await getDraftOrder();
      setOrder(data);
      setDetailsOrders(data.detailsOrders ?? []);
      setCustoms(data.customs ?? []);
      toastSuccess(`Producto eliminado!`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCustom = async (id) => {
    try {
      await deleteCustomById(id);
      const data = await getDraftOrder();
      setOrder(data);
      setDetailsOrders(data.detailsOrders ?? []);
      setCustoms(data.customs ?? []);
      toastSuccess(`Producto Personalizado eliminado!`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = async () => {
    if (!order || !order.idOrder) {
      console.error("No hay orden válida para procesar");
      return;
    }

    setIsPaymentProcessing(true);

    try {
      // 1. Llamamos al endpoint que creaste en C#
      const response = await createMercadoPagoPreference(order.idOrder);

      // 2. Obtenemos el initPoint (Manejo ambos casos: mayúscula/minúscula por si acaso el serializador JSON cambia)
      const urlMercadoPago = response.initPoint || response.InitPoint;

      if (urlMercadoPago) {
        // 3. Redirigimos al usuario a Mercado Pago
        window.location.href = urlMercadoPago;
      } else {
        console.error("No se recibió el Link de pago", response);
        setIsPaymentProcessing(false);
      }
    } catch (error) {
      console.error("Error al crear preferencia de pago:", error);
      // Aquí podrías poner un toastError("Hubo un problema al iniciar el pago")
      setIsPaymentProcessing(false);
    }
  };

  // --- COMPONENTES UI INTERNOS PARA MANTENER EL ARCHIVO LIMPIO ---

  const CartItem = ({
    image,
    title,
    subtitle,
    price,
    unitPrice,
    color,
    size,
    details,
    count,
    onDelete,
    isCustom,
  }) => (
    <div className="group relative flex flex-col sm:flex-row gap-6 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-500 last:border-0">
      {/* Indicador de Tipo (Solo visual) */}
      <div
        className={`absolute left-0 top-6 bottom-6 w-0.5 rounded-r-full transition-all duration-300 ${
          isCustom
            ? "bg-purple-500/50 group-hover:bg-purple-500"
            : "bg-gold/50 group-hover:bg-gold"
        }`}
      ></div>

      {/* Imagen */}
      <div className="relative w-full sm:w-32 aspect-[3/4] sm:aspect-square rounded-xl overflow-hidden bg-white/5 shadow-2xl shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Package size={24} />
          </div>
        )}
        {isCustom && (
          <div className="absolute top-2 right-2 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 p-1.5 rounded-full text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles size={12} />
          </div>
        )}
      </div>

      {/* Info Principal */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-lg font-medium text-ice tracking-wide">
                {title}
              </h3>
              <p className="text-[12px] font-mono text-white/60 uppercase tracking-widest mt-1">
                {subtitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl text-gold tracking-tight">
                ${price?.toLocaleString("en-US")}
              </p>
              <p className="text-[15px] text-white/60 text-right">x {count}</p>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="flex flex-wrap gap-4 mt-4">
            {/* Color */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
              <span className="text-[10px] uppercase text-white/40 font-bold tracking-wider">
                Color
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full ring-1 ring-white/20"
                  style={{ backgroundColor: "white" }}
                ></span>
                {/* Nota: En un caso real usaría el color hexadecimal real, aquí uso white/text por simplicidad o un mapa de colores */}
                <span className="text-sm text-ice/80">{color}</span>
              </div>
            </div>

            {/* Talla */}
            {size && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase text-white/40 font-bold tracking-wider">
                  Size
                </span>
                <span className="text-sm text-ice/80 font-mono">{size}</span>
              </div>
            )}
          </div>

          {/* Detalles adicionales */}
          {details && (
            <div className="mt-3 p-3 bg-white/[0.03] rounded-lg border border-white/5 mb-8">
              <p className="text-xs text-ice/70 italic leading-relaxed line-clamp-2">
                "{details}"
              </p>
            </div>
          )}
        </div>

        {/* Acciones (Bottom) */}
        <div className="flex justify-between items-end mt-4 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 text-red-400/60 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-bold group/btn"
          >
            <Trash2
              size={14}
              className="group-hover/btn:scale-110 transition-transform"
            />
            <span>Remover Item</span>
          </button>
          <div className="text-[13px] text-white/6 q0 ">
            UNIT: ${unitPrice?.toLocaleString("en-US")}
          </div>
        </div>
      </div>
    </div>
  );

  // --- MAIN RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-blackDeep flex flex-col items-center justify-center space-y-4 font-['Satoshi']">
        <div className="relative">
          <div className="w-16 h-16 border border-gold/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-0 border-t border-gold rounded-full animate-spin"></div>
        </div>
        <p className="text-gold/50 text-[10px] tracking-[0.3em] uppercase animate-pulse">
          Sincronizando Inventario...
        </p>
      </div>
    );
  }

  const totalItems = detailsOrders.length + customs.length;

  if (totalItems === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-blackDeep px-6 font-['Satoshi']">
        <div className="w-24 h-24 rounded-full bg-graphite border border-white/5 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <Package size={32} className="text-white/70" />
        </div>
        <h2 className="text-3xl font-light text-white mb-2">
          Inventario Vacío
        </h2>
        <p className="text-white/40 text-sm mb-10 text-center max-w-sm">
          Tu colección digital no tiene items. Comienza un proyecto para verlo
          aquí.
        </p>
        <Link to="/services">
          <button className="px-6 py-3 rounded-md text-sm uppercase bg-transparent border border-gold text-gold hover:bg-gold/25 transition">
            Explorar Catálogo
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blackDeep text-ice pb-20 pt-10 font-['Satoshi'] selection:bg-gold/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* HEADER FUTURISTA */}
        <header className="mb-16 pb-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
              <span className="text-[10px] text-green-500 font-mono uppercase tracking-widest">
                Sistema Activo
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight flex items-center gap-4">
              CARRITO <ShoppingCart className="text-gold" size={40} />
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">
              Total Items
            </p>
            <p className="text-2xl font-mono text-white">
              {totalItems.toString().padStart(2, "0")}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
          {/* LEFT: ITEM LIST */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-white/10 bg-graphite/20 overflow-hidden backdrop-blur-sm">
              {/* Standard Items */}
              {detailsOrders.map((item) => (
                <CartItem
                  key={item.idDetailsOrder}
                  title={
                    item.serviceName ||
                    `Service Node ${item.idService ?? item.idGarmentService}`
                  }
                  subtitle={
                    item.idService
                      ? `ID: SRV-${item.idService}`
                      : `ID: GRM-${item.idGarmentService}`
                  }
                  price={item.subTotal}
                  unitPrice={item.unitPrice}
                  image={
                    item.imageUrl ? getDisplayImageUrl(item.imageUrl) : null
                  }
                  color={item.selectedColor}
                  size={item.selectedSize}
                  details={item.details}
                  count={item.count}
                  isCustom={false}
                  onDelete={() => handleDeleteDetailsOrder(item.idDetailsOrder)}
                />
              ))}

              {/* Custom Items */}
              {customs.map((custom) => (
                <CartItem
                  key={custom.idCustom}
                  title="Diseño Customizado"
                  subtitle={`PROJECT ID: CST-${custom.idCustom}`}
                  price={custom.customTotal}
                  unitPrice={custom.totalPrice}
                  image={
                    custom.imageUrl?.[0]
                      ? getDisplayImageUrl(custom.imageUrl[0])
                      : null
                  }
                  color={custom.selectedColor}
                  size={custom.selectedSize}
                  details={custom.customerDetails}
                  count={custom.count}
                  isCustom={true}
                  onDelete={() => handleDeleteCustom(custom.idCustom)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: SUMMARY PANEL */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="relative p-8 rounded-[2rem] bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 overflow-hidden group">
                {/* Background glow effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/20 transition-all duration-700"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <h3 className="text-xl  text-white mb-8 flex items-center gap-2">
                  Resumen <span className="text-white/20">/</span> Finanzas
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-baseline group/row cursor-default">
                    <span className="text-sm text-white/40 group-hover/row:text-white/60 transition-colors">
                      Subtotal
                    </span>
                    <span className=" text-ice">
                      ${order?.total?.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline group/row cursor-default">
                    <span className="text-sm text-white/40 group-hover/row:text-white/60 transition-colors">
                      Impuestos
                    </span>
                    <span className=" text-ice/60 text-xs">
                      Calculado en checkout
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline group/row cursor-default">
                    <span className="text-sm text-white/40 group-hover/row:text-white/60 transition-colors">
                      Envío
                    </span>
                    <span className=" text-ice/60 text-xs">Por definir</span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-sm font-bold uppercase tracking-widest text-gold">
                    Total Estimado
                  </span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-white tracking-tight">
                      ${order?.total?.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isPaymentProcessing}
                  className={`relative w-full overflow-hidden py-4 px-6 rounded-xl font-bold uppercase tracking-[0.2em] text-xs duration-300 flex items-center justify-center gap-4 group/btn 
                            ${
                              isPaymentProcessing
                                ? "bg-gold/10 border-gold/30 text-gold/50 cursor-not-allowed"
                                : "bg-transparent border border-gold text-gold hover:bg-gold/25 hover:border-gold/80 transition-all"
                            }`}
                >
                  {isPaymentProcessing ? (
                    <>
                      <span className="relative z-10 animate-pulse">
                        Procesando...
                      </span>
                      <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Proceder al pago</span>
                      <ArrowRight
                        size={16}
                        className="relative z-10 group-hover/btn:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <div className="mt-6 flex justify-center items-center gap-2 text-white/60">
                  <ShieldCheck size={20} />
                  <span className="text-[11px] uppercase tracking-widest">
                    Pagos Encriptados SSL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
