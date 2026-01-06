import { useEffect, useState } from "react";
import { getPaidOrder } from "../services/authService"
import { getDisplayImageUrl } from "../Utils/ImageUtils";
import { 
  PackageCheck, 
  MapPin, 
  Phone, 
  Mail, 
  UserCheck, 
  Clock, 
  ShieldCheck, 
  Loader2,
  CalendarDays,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getPaidOrder();
        // Ordenamos por fecha, el más reciente primero
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedData);
      } catch (error) {
        console.error("Error fetching paid orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- UI COMPONENTS INTERNOS ---

  const StatusBadge = () => (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(74,222,128,0.1)]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Pago Exitoso
    </div>
  );

  const OrderItem = ({ item, isCustom }) => {
    const image = isCustom 
        ? (item.imageUrl?.[0] ? getDisplayImageUrl(item.imageUrl[0]) : null)
        : (item.imageUrl ? getDisplayImageUrl(item.imageUrl) : null);
    
    const title = isCustom 
        ? "Diseño Personalizado" 
        : (item.serviceName || "Servicio de Confección");

    const subtitle = isCustom
        ? `CST-${item.idCustom}`
        : (item.idService ? `SRV-${item.idService}` : `GRM-${item.idGarmentService}`);

    return (
      <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-black shrink-0 relative">
            {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20"><PackageCheck size={20}/></div>
            )}
             {isCustom && (
                <div className="absolute top-1 right-1 text-purple-400">
                    <Sparkles size={10} fill="currentColor" />
                </div>
            )}
        </div>
        <div>
            <h4 className="text-sm font-medium text-ice">{title}</h4>
            <p className="text-[12px]  text-white/60 uppercase mb-1">{subtitle}</p>
            <div className="flex items-center gap-3 text-sm text-gold">
                <span>x{item.count}</span>
                <span className="text-white/40">|</span>
                <span>{item.selectedColor}</span>
                {item.selectedSize && (
                    <>
                        <span className="text-white/40">|</span>
                        <span>{item.selectedSize}</span>
                    </>
                )}
            </div>
        </div>
      </div>
    );
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-blackDeep flex flex-col items-center justify-center space-y-4 font-['Satoshi']">
        <Loader2 size={40} className="text-gold animate-spin" />
        <p className="text-gold/50 text-[10px] tracking-[0.3em] uppercase animate-pulse">Recuperando historial...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-blackDeep flex flex-col items-center justify-center px-6 text-center font-['Satoshi']">
        <div className="w-20 h-20 rounded-full bg-graphite border border-white/5 flex items-center justify-center mb-6">
            <PackageCheck size={32} className="text-white/30" />
        </div>
        <h2 className="text-2xl text-white font-medium mb-2">Aún no tienes pedidos activos</h2>
        <p className="text-white/40 text-sm max-w-md mb-8">
            Aquí aparecerán tus proyectos una vez que se haya confirmado el pago. Es el lugar donde la magia comienza.
        </p>
        <Link to="/services" className="text-gold text-xs uppercase tracking-widest hover:text-white transition-colors border-b border-gold hover:border-white pb-1">
            Comenzar un proyecto nuevo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blackDeep text-ice py-20 font-['Satoshi'] selection:bg-gold/30">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* HEADER DE BIENVENIDA */}
        <header className="mb-16 text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            MIS PEDIDOS
          </h1>
          <p className="text-white/70 max-w-2xl text-lg ">
            Gracias por ser parte de nuestra visión. Aquí puedes ver el estado de tus piezas exclusivas y los siguientes pasos.
          </p>
        </header>

        <div className="space-y-16">
          {orders.map((order) => (
            <div key={order.idOrder} className="relative group">
                {/* Decoración de fondo */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[2.5rem] -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="bg-graphite/20 border border-white/5 backdrop-blur-md rounded-[2rem] overflow-hidden p-6 md:p-10">
                    
                    {/* ENCABEZADO DE LA ORDEN */}
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-10 border-b border-white/15 pb-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                <h3 className="text-2xl text-white font-bold">Orden #{order.idOrder.toString().padStart(4, '0')}</h3>
                                <StatusBadge />
                            </div>
                            <div className="flex items-center gap-2 text-white/65 text-sm ">
                                <CalendarDays size={14} />
                                {new Date(order.createdAt).toLocaleDateString("es-ES", {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                                })}
                            </div>
                           
                        </div>
                        <div className="text-right">
                             <p className="text-[12px] uppercase tracking-widest text-white/65 mb-1">Total Pagado</p>
                             <p className="text-3xl font-black text-gold">${order.total?.toLocaleString("en-US")}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* COLUMNA IZQUIERDA: ITEMS */}
                        <div className="lg:col-span-7 space-y-6">
                            <h4 className="text-xs font-bold text-white/65 uppercase tracking-[0.2em] mb-4">Colección Adquirida</h4>
                            <div className="space-y-3">
                                {order.detailsOrders?.map((item) => (
                                    <OrderItem key={item.idDetailsOrder} item={item} isCustom={false} />
                                ))}
                                {order.customs?.map((item) => (
                                    <OrderItem key={item.idCustom} item={item} isCustom={true} />
                                ))}
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: INFO Y CONFIANZA */}
                        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
                            
                            {/* CAJA DE CONFIANZA (TEXTO IMPORTANTE) */}
                            <div className="bg-gold/5 border border-gold/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                
                                <div className="flex items-start gap-3 mb-3">
                                    <ShieldCheck className="text-gold shrink-0 mt-1" size={20} />
                                    <h5 className="text-gold font-bold uppercase tracking-wider text-sm">Pago Verificado & Seguro</h5>
                                </div>
                                <p className="text-sm text-ice leading-relaxed">
                                    Muchas gracias por tu compra. Tu transacción ha sido validada correctamente. 
                                    <br/><br/>
                                    <span className="text-white font-medium">Tu producto está oficialmente en preparación.</span>
                                    {" "}Queremos transmitirte tranquilidad: nuestro equipo ya tiene los detalles de tu diseño.
                                </p>
                            </div>

                            {/* INFORMACIÓN DE CONTACTO Y RETIRO */}
                            <div className="space-y-4">
                                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-ice">
                                            <UserCheck size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[12px] uppercase text-white/60 tracking-widest">Técnico Asignado</p>
                                            <p className="text-white font-medium">Rony Gonzales</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white mb-3 pl-11">
                                        Se comunicará contigo cuando tu producto inicie su producción y cuando esté listo.
                                    </p>
                                    <div className="pl-11 flex flex-col gap-2">
                                        <a href="mailto:ronygook95@gmail.com" className="flex items-center gap-2 text-sm text-gold hover:underline">
                                            <Mail size={15} /> ronygook95@gmail.com
                                        </a>
                                        <span className="flex items-center gap-2 text-sm text-white/60">
                                            <Phone size={15} /> +54 9 351 123 4567
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                                    <MapPin className="text-white/70 mt-1" size={18} />
                                    <div>
                                        <p className="text-[12px] uppercase text-white/60 tracking-widest mb-2">Punto de Retiro</p>
                                        <p className="text-sm text-white mb-1">Av. Colón 1234, Oficina 5B</p>
                                        <p className="text-sm text-white/70">Córdoba Capital, Argentina</p>
                                        <div className="flex items-center gap-2 mt-2 text-[11px] text-green-400/80 bg-green-900/10 w-fit px-2 py-1 rounded">
                                            <Clock size={15} />
                                            <span>Lunes a Viernes: 9:00 - 18:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}