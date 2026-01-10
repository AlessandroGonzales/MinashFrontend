/* eslint-disable no-constant-condition */
import { useEffect, useState } from "react";
import { getAllPaidORder, patchOrderField } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  User,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  X,
  PackageCheck,
  ArrowLeft
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { toastSuccess } from "../../Utils/toast";
import { Link } from "react-router-dom";
import { getDisplayImageUrl } from "../../Utils/ImageUtils";

const CeoPaidOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllPaidORder();
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
      } catch (err) {
        setError("Error al cargar las órdenes del CEO.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const openConfirmationModal = (id) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleCompleteOrder = async () => {
    if (!selectedOrderId) return;

    setIsUpdating(true);
    try {
      await patchOrderField(selectedOrderId, { state: "Completed" });

      setOrders((prevOrders) =>
        prevOrders.filter((o) => o.idOrder !== selectedOrderId)
      );

      toastSuccess("Order completada")

      closeConfirmationModal();
    } catch (error) {
      console.error("Error al completar orden", error);
      // toast.error("Error al actualizar la orden");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blackDeep flex items-center justify-center text-gold">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="ml-4 font-satoshi text-xl tracking-widest">
          CARGANDO DATA...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blackDeep flex items-center justify-center text-red-500 font-satoshi">
        {error}
      </div>
    );
  }

  if(orders.length === 0)
  {
    return (
      <div className="min-h-screen bg-blackDeep flex flex-col items-center justify-center px-6 text-center font-['Satoshi']">
        <div className="w-20 h-20 rounded-full bg-graphite border border-white/5 flex items-center justify-center mb-6">
          <PackageCheck size={32} className="text-white/30" />
        </div>
        <h2 className="text-2xl text-white font-medium mb-2">
          No hay nada en produccion
        </h2>
        <p className="text-white/40 text-sm max-w-md mb-8">
          Aquí aparecerán los productos una vez que se haya confirmado el pago.
          Es el lugar donde la magia comienza.
        </p>
        <Link
          to="/ "
          className="text-gold text-xs uppercase tracking-widest hover:text-white transition-colors border-b border-gold hover:border-white pb-1"
        >
           Atras
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blackDeep text-primary font-satoshi p-4 md:p-8">
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={!isUpdating ? closeConfirmationModal : undefined}
          ></div>
          
          <div className="bg-graphite border border-steel rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gold/10 p-4 rounded-full mb-4">
                <AlertTriangle className="text-gold w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                ¿Finalizar Producción?
              </h3>
              
              <p className="text-ice/70 mb-8 text-sm leading-relaxed">
                Estás a punto de cambiar el estado de la Orden <span className="text-gold font-mono font-bold">#{selectedOrderId?.toString().padStart(4, "0")}</span> a <span className="text-green-400 font-bold">Completado</span>. 
                <br/><br/>
                Esto notificará que el trabajo está terminado y moverá la orden fuera de esta lista.
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={closeConfirmationModal}
                  disabled={isUpdating}
                  className="flex-1 py-3 rounded-lg border border-steel text-ice hover:bg-steel/20 transition font-bold uppercase text-xs tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isUpdating}
                  className="flex-1 py-3 rounded-lg bg-gold text-blackDeep hover:bg-white transition font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle size={16}/>}
                  {isUpdating ? "Procesando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header Futurista */}
      <header className="mb-12 border-b border-steel pb-8 flex flex-col items-center justify-center w-full">
        {/* Contenedor de Títulos */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2 ">
            CEO <span className="text-gold">/ ÓRDENES</span>
          </h1>
          <p className="text-ice opacity-60 text-xs md:text-sm uppercase tracking-[0.3em] mb-6">
            Registro de Órdenes Pagadas
          </p>
        </div>

        {/* Contador Centrado (Badge Futurista) */}
        <div className="flex flex-col items-center bg-graphite border border-steel px-6 py-2 rounded-full">
          <p className="text-gold font-mono font-bold text-xl leading-none">
            {orders.length.toString().padStart(2, "0")}
          </p>
          <p className="text-[12px] uppercase tracking-tighter text-ice/70">
            Órdenes Totales
          </p>
        </div>
      </header>

      {/* Grid de Ordenes */}
      <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto mb-20 ">
        {orders.map((order) => (
          <div
            key={order.idOrder}
            className="group bg-graphite border border-steel rounded-xl p-6  relative overflow-hidden mb-16"
          >
            {/* Pequeño acento decorativo en hover */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gold/0  "></div>

            {/* Fila Superior: ID, Estado, Fecha, Total */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-steel/50 pb-4">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="bg-blackDeep px-4 py-2 rounded-lg border border-steel text-gold font-mono font-bold text-lg">
                  #{order.idOrder.toString().padStart(4, "0")}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-ice opacity-70 uppercase tracking-wider">
                    Fecha de Creación
                  </span>
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-gold" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Badge de Estado */}
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gold/10 text-gold border border-gold/20">
                  {(order.state = "Paid" ? "Pagado" : "")}
                </span>
                <div className="text-right">
                  <span className="block text-xs text-ice opacity-50 uppercase">
                    Total Pagado
                  </span>
                  <span className="block text-2xl font-bold text-primary">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
              {/* Columna 1: Información del Cliente (Para envíos o contacto) */}
              <div className="space-y-3">
                <h3 className="text-ice text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <User size={16} /> Cliente
                </h3>
                <div className="bg-blackDeep/50 p-4 rounded-lg border border-steel/30">
                  <p className="text-lg font-bold text-white mb-1">
                    {order.user?.userName} {order.user?.lastName}
                  </p>

                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-steel/30">
                    {/* Botón de acción rápida para el CEO */}
                    {order.user?.phone && (
                      <a
                        href={`https://wa.me/${order.user.phone.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600/20 text-green-500 text-xs font-bold py-2 rounded transition-all uppercase tracking-tighter"
                      >
                        <FaWhatsapp color="#25D366" size={20} />
                        Contactar por WhatsApp
                      </a>
                    )}
                    {order.user?.email ? (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${
                          order.user.email
                        }&su=${encodeURIComponent(
                          `Información del Pedido #${order.idOrder
                            .toString()
                            .padStart(4, "0")}`
                        )}&body=${encodeURIComponent(
                          `Hola ${
                            order.user.userName
                          },\n\nTe contacto desde la administración por tu pedido #${order.idOrder
                            .toString()
                            .padStart(4, "0")}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-bold py-2.5 rounded  transition-all uppercase tracking-tighter"
                      >
                        <SiGmail color="#EA4335" size={16} />
                        Gmail
                      </a>
                    ) : (
                      <div className="opacity-30 flex items-center justify-center bg-steel/10 text-steel text-[10px] py-2.5 rounded border border-steel/20 uppercase">
                        Sin Email
                      </div>
                    )}
                    {order.user?.email && (
                      <a
                        href={`mailto:${order.user.email}`}
                        className="text-[12px] text-ice/40 hover:text-gold text-center transition-colors uppercase tracking-widest mt-1"
                      >
                        O correo local
                      </a>
                    )}
                  </div>

                  {/* Dirección */}
                  <div className="flex items-start gap-2 text-sm text-ice mt-3 pt-3 border-t border-steel/30">
                    <MapPin size={16} className="text-gold min-w-[16px] mt-1" />
                    <div>
                      <p className="font-medium text-white">
                        {order.user?.fullAddress}
                      </p>
                      <p className="opacity-80">
                        {order.user?.city}, {order.user?.province}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Pago Técnica */}
                <div className="flex items-center gap-2 text-xs text-ice/60 mt-2">
                  <CreditCard size={16} />
                  <span>
                    Método: {order.payments?.[0]?.provider} (Tx:{" "}
                    {order.payments?.[0]?.transactionCode})
                  </span>
                </div>
              </div>

              {/* Columna 2 y 3: Detalles de la Orden (Items) */}
              <div className="lg:col-span-2 ">
                <h3 className="text-ice text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <Package size={17} /> Detalle de Producción
                </h3>

                <div className="space-y-4 ">
                  {order.detailsOrders.map((detail) => (
                    <div
                      key={detail.idDetailsOrder}
                      className="flex flex-col md:flex-row items-start bg-blackDeep rounded-xl p-4 border border-steel/30 gap-4"
                    >
                      {/* 1. Imagen: Centrada en mobile, fija en desktop */}
                      <div className="w-full md:w-44 h-38 md:h-44 bg-graphite rounded-lg overflow-hidden flex-shrink-0 border border-steel/20">
                        {detail.imageUrl ? (
                          <img
                            src={getDisplayImageUrl(detail.imageUrl)}
                            alt="Servicio"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-steel text-xs italic">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      {/* 2. Info del Item */}
                      <div className="flex-1 w-full">
                        {/* Título del Servicio */}
                        <div className="flex justify-between items-start mb-6">
                          <p className="text-gold text-sm md:text-base font-bold uppercase tracking-tight">
                            {detail.serviceName}
                          </p>
                          {/* Cantidad visible en mobile junto al título para ahorrar espacio */}
                          <span className="md:hidden bg-gold/10 text-gold text-xs px-2 py-1 rounded border border-gold/20">
                            x{detail.count}
                          </span>
                        </div>

                        {/* Descripción / Detalles Técnicos: Caja minimalista */}
                        <div className="p-3 bg-white/[0.03] rounded-lg border border-white/5 mb-6">
                          <p className="text-sm md:text-sm text-ice/80 leading-relaxed ">
                            "{detail.details}"
                          </p>
                        </div>

                        {/* Tags de Especificaciones (Talle, Color) */}
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 bg-steel/20 px-3 py-1 rounded-full border border-steel/50">
                            <span className="text-[10px] uppercase text-ice/50 font-medium">
                              Talle
                            </span>
                            <span className="text-xs text-white font-bold">
                              {detail.selectedSize}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-steel/20 px-3 py-1 rounded-full border border-steel/50">
                            <span className="text-[10px] uppercase text-ice/50 font-medium">
                              Color
                            </span>
                            <span className="text-xs text-white font-bold">
                              {detail.selectedColor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Precio y Cantidad (Solo visible en Desktop de esta forma) */}
                      <div className="hidden md:flex flex-col items-end justify-center pl-4 border-l border-steel/20 min-w-[120px]">
                        <span className="text-xs text-ice/80 uppercase tracking-widest">
                          Cantidad
                        </span>
                        <span className="text-xl font-bold text-white mb-1">
                          {detail.count}
                        </span>
                        <span className="text-sm text-gold ">
                          {formatCurrency(detail.unitPrice)} c/u
                        </span>
                      </div>

                      {/* Precio Mobile: Fila extra al final si es celular */}
                      <div className="flex md:hidden w-full justify-between items-center pt-3 border-t border-steel/20 mt-2">
                        <span className="text-xs text-ice/50 uppercase">
                          Precio Unitario
                        </span>
                        <span className="text-sm font-bold text-gold">
                          {formatCurrency(detail.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 m">
                  {order.customs?.map((custom) => (
                    <div
                      key={custom.idCustom}
                      className="flex flex-col md:flex-row items-start bg-blackDeep rounded-xl p-4 border border-steel/30 gap-4"
                    >
                      <div className="absolute top-0 left-0 bg-gold  text-blackDeep text-[12px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                        Custom
                      </div>
                      <div className="w-full md:w-44 h-38 md:h-44 bg-graphite rounded-lg overflow-hidden flex-shrink-0 border border-steel/20">
                        {custom.imageUrl[0] ? (
                          <img
                            src={getDisplayImageUrl(custom.imageUrl[0])}
                            alt="Servicio"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-steel text-xs italic">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        {/* Título del Servicio */}
                        <div className="flex justify-between items-start mb-6">
                          <p className="text-gold text-sm md:text-base font-bold uppercase tracking-tight">
                            {custom.customName}
                          </p>
                          {/* Cantidad visible en mobile junto al título para ahorrar espacio */}
                          <span className="md:hidden bg-gold/10 text-gold text-xs px-2 py-1 rounded border border-gold/20">
                            x{custom.count}
                          </span>
                        </div>

                        {/* Descripción / Detalles Técnicos: Caja minimalista */}
                        <div className="p-3 bg-white/[0.03] rounded-lg border border-white/5 mb-6">
                          <p className="text-sm md:text-sm text-ice/80 leading-relaxed ">
                            "{custom.customerDetails}"
                          </p>
                        </div>

                        {/* Tags de Especificaciones (Talle, Color) */}
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 bg-steel/20 px-3 py-1 rounded-full border border-steel/50">
                            <span className="text-[10px] uppercase text-ice/50 font-medium">
                              Talle
                            </span>
                            <span className="text-xs text-white font-bold">
                              {custom.selectedSize}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-steel/20 px-3 py-1 rounded-full border border-steel/50">
                            <span className="text-[10px] uppercase text-ice/50 font-medium">
                              Color
                            </span>
                            <span className="text-xs text-white font-bold">
                              {custom.selectedColor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col items-end justify-center pl-4 border-l border-steel/20 min-w-[120px]">
                        <span className="text-xs text-ice/80 uppercase tracking-widest">
                          Cantidad
                        </span>
                        <span className="text-xl font-bold text-white mb-1">
                          {custom.count}
                        </span>
                        <span className="text-sm text-gold ">
                          {formatCurrency(custom.unitPrice)} c/u
                        </span>
                      </div>
                      <div className="flex md:hidden w-full justify-between items-center pt-3 border-t border-steel/20 mt-2">
                        <span className="text-xs text-ice/50 uppercase">
                          Precio Unitario
                        </span>
                        <span className="text-sm font-bold text-gold">
                          {formatCurrency(custom.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/ceo/order/${order.idOrder}`)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-gold/10 hover:bg-gold/30 text-gold px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all mt-6 mb-4"
            >
              Ver Ficha Técnica <ArrowRight size={17} />
            </button>
            <button
                onClick={() => openConfirmationModal(order.idOrder)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600/20 text-green-500 text-xs font-bold px-4 py-2  rounded transition-all uppercase tracking-tighter "
              >
                 Finalizar Producción <CheckCircle size={14} />
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CeoPaidOrders;
