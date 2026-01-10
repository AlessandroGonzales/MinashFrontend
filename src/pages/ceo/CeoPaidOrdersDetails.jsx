// src/pages/ceo/CeoOrderDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDetailsByOrderId,
  getCustomsByOrderId,
} from "../../services/authService"; // Ajusta el import
import { getDisplayImageUrl } from "../../Utils/ImageUtils";
import {
  ArrowLeft,
  Loader2,
  Layers,
  PenTool,
  Copy,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

export default function CeoPaidOrdersDetails() {
  const { id } = useParams(); // Obtenemos el ID de la orden de la URL
  const navigate = useNavigate();

  const [standardItems, setStandardItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchFullOrderDetails = async () => {
      try {
        // Ejecutamos ambas peticiones en paralelo para velocidad
        const [detailsData, customsData] = await Promise.all([
          getDetailsByOrderId(id),
          getCustomsByOrderId(id),
        ]);

        setStandardItems(detailsData);
        setCustomItems(customsData);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el detalle técnico de la orden.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullOrderDetails();
  }, [id]);

  // Helpers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} goBack={() => navigate(-1)} />;

  const hasStandard = standardItems.length > 0;
  const hasCustom = customItems.length > 0;

  return (
    <div className="min-h-screen bg-blackDeep text-primary font-satoshi pb-20">
      {/* --- HEADER DE NAVEGACIÓN --- */}
      <div className="sticky top-0 z-50 bg-blackDeep/90 backdrop-blur-md border-b border-steel/50 px-4 py-4 md:px-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ice/60 hover:text-gold transition-colors uppercase text-xs font-bold tracking-widest"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white tracking-tighter">
            ORDEN{" "}
            <span className="text-gold">#{id.toString().padStart(4, "0")}</span>
          </h1>
        </div>
        <div className="w-16"></div> {/* Espaciador para centrar el título */}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 space-y-12">
        {/* === SECCIÓN 1: PRODUCTOS ESTÁNDAR === */}
        {hasStandard && (
          <section className="animate-fade-in-up">
            <SectionHeader
              title="Catálogo & Servicios"
              icon={<Layers size={20} />}
              count={standardItems.length}
              isCustom={false} // Mantener en false si quieres que el icono sea ice, o true para que todo sea gold
            />

            <div className="grid grid-cols-1 gap-8">
              {standardItems.map((item) => (
                <div
                  key={item.idDetailsOrder}
                  className="bg-gradient-to-br from-graphite to-blackDeep border border-gold/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(201,168,106,0.05)]"
                >
                  {/* Header del Producto Estándar (Igual al Custom) */}
                  <div className="px-6 py-4 border-b border-gold/10 flex justify-between items-center bg-gold/5">
                    <div className="flex items-center gap-3">
                      <span className="bg-steel text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wider rounded-sm">
                        Catálogo
                      </span>
                      <h3 className="font-bold text-white uppercase tracking-wide">
                        {item.serviceName}
                      </h3>
                    </div>
                    <span className="text-white text-lg ">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row">
                    {/* Lado Izquierdo: Visualización (Igual que Custom) */}
                    <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-white/5 bg-blackDeep/20">
                      <p className="text-xs text-ice/40 uppercase tracking-widest mb-3">
                        Referencia de Prenda
                      </p>
                      <div className="relative group rounded-lg overflow-hidden border border-steel/30 aspect-video md:aspect-square">
                        <img
                          src={getDisplayImageUrl(item.imageUrl)}
                          alt={item.serviceName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <a
                            href={getDisplayImageUrl(item.imageUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white flex items-center gap-2 text-xs uppercase font-bold tracking-widest hover:text-gold"
                          >
                            <Maximize2 size={16} /> Ver Imagen
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Lado Derecho: Detalles Técnicos (Igual que Custom) */}
                    <div className="lg:w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-3 mb-6">
                          {/* Badge de Cantidad */}
                          <div className="flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded border border-gold/30">
                            <span className="text-[10px] uppercase text-gold/70 font-bold">
                              Cantidad
                            </span>
                            <span className="text-sm text-gold font-bold font-mono">
                              x{item.count}
                            </span>
                          </div>
                          <SpecBadge label="Talle" value={item.selectSize} />
                          <SpecBadge label="Color" value={item.selectColor} />
                          <SpecBadge
                            label="Ref"
                            value={`#${item.idDetailsOrder}`}
                          />
                        </div>

                        <div className="mb-2 flex justify-between items-end">
                          <span className="text-xs text-ice/60 uppercase tracking-widest">
                            Observaciones de la Prenda
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(item.details, item.idDetailsOrder)
                            }
                            className="text-gold text-[10px] uppercase font-bold hover:underline flex items-center gap-1"
                          >
                            {copiedId === item.idDetailsOrder
                              ? "Copiado"
                              : "Copiar Info"}{" "}
                            <Copy size={12} />
                          </button>
                        </div>

                        <div className="bg-blackDeep p-5 rounded-lg border border-gold/20 shadow-inner min-h-[120px]">
                          <p className="text-sm text-ice/90 font-light leading-relaxed whitespace-pre-wrap">
                            {item.details ||
                              "Sin especificaciones adicionales."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-50 text-[10px] uppercase">
                        <span>
                          Total Línea: {formatCurrency(item.subTotal)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={16} /> Verificado para Producción
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === SECCIÓN 2: CUSTOMS (PEDIDOS PERSONALIZADOS) === */}
        {hasCustom && (
          <section
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <SectionHeader
              title="Diseño Personalizado (Custom)"
              icon={<PenTool size={20} />}
              count={customItems.length}
              isCustom
            />

            <div className="grid grid-cols-1 gap-8">
              {customItems.map((custom) => (
                <div
                  key={custom.idCustom}
                  className="bg-gradient-to-br from-graphite to-blackDeep border border-gold/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(201,168,106,0.05)]"
                >
                  {/* Header del Custom */}
                  <div className="px-6 py-4 border-b border-gold/10 flex justify-between items-center bg-gold/5">
                    <div className="flex items-center gap-3">
                      <span className="bg-gold text-blackDeep text-[10px] font-black px-2 py-0.5 uppercase tracking-wider rounded-sm">
                        Custom
                      </span>
                      <h3 className="font-bold text-white uppercase tracking-wide">
                        {custom.customerName}
                      </h3>
                    </div>
                    <span className="text-white  text-lg">
                      {formatCurrency(custom.unitPrice)}
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row">
                    {/* Galería de Imágenes Custom */}
                    <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-white/5 bg-blackDeep/20">
                      <p className="text-xs text-ice/40 uppercase tracking-widest mb-3">
                        Archivos de Referencia
                      </p>

                      {/* Grid de imágenes */}
                      <div
                        className={`grid gap-3 ${
                          custom.imageUrl?.length > 1
                            ? "grid-cols-2"
                            : "grid-cols-1"
                        }`}
                      >
                        {custom.imageUrl && custom.imageUrl.length > 0 ? (
                          custom.imageUrl.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="relative group rounded-lg overflow-hidden border border-steel/30 aspect-square"
                            >
                              <img
                                src={getDisplayImageUrl(imgUrl)}
                                alt={`Ref ${idx}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              {/* Overlay para ver full */}
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <a
                                  href={getDisplayImageUrl(imgUrl)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-white flex items-center gap-2 text-xs uppercase font-bold tracking-widest hover:text-gold"
                                >
                                  <Maximize2 size={16} /> Ver Full
                                </a>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-40 flex items-center justify-center border border-dashed border-steel/30 text-steel text-sm rounded-lg">
                            Sin imágenes adjuntas
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detalles Técnicos Custom */}
                    <div className="lg:w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-3 mb-6">
                          {/* Usamos el condicional de cantidad */}
                          <div className="flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded border border-gold/30">
                            <span className="text-[10px] uppercase text-gold/70 font-bold">
                              Cantidad
                            </span>
                            <span className="text-sm text-gold font-bold font-mono">
                              x{custom.count}
                            </span>
                          </div>
                          <SpecBadge
                            label="Talle"
                            value={custom.selectedSize}
                          />
                          <SpecBadge
                            label="Color"
                            value={custom.selectedColor}
                          />
                        </div>

                        <div className="mb-2 flex justify-between items-end">
                          <span className="text-xs text-ice/60 uppercase tracking-widest">
                            Requerimientos del Cliente
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                custom.customerDetails,
                                custom.idCustom
                              )
                            }
                            className="text-gold text-[10px] uppercase font-bold hover:underline flex items-center gap-1"
                          >
                            {copiedId === custom.idCustom
                              ? "Copiado"
                              : "Copiar Texto"}{" "}
                            <Copy size={12} />
                          </button>
                        </div>
                        <div className="bg-blackDeep p-5 rounded-lg border border-gold/20 shadow-inner min-h-[120px]">
                          <p className="text-sm text-ice/90 font-light  leading-relaxed whitespace-pre-wrap">
                            {custom.customerDetails ||
                              "Sin detalles específicos."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-50 text-[10px] uppercase">
                        <span>ID Custom: {custom.idCustom}</span>
                        <span>ID User: {custom.idUser}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State General */}
        {!hasStandard && !hasCustom && (
          <div className="flex flex-col items-center justify-center py-20 text-steel opacity-50">
            <Layers size={48} className="mb-4" />
            <p className="uppercase tracking-widest">
              Orden vacía o sin procesar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUBCOMPONENTES PARA LIMPIEZA ---

const SectionHeader = ({ title, icon, count, isCustom }) => (
  <div
    className={`flex items-end justify-between border-b pb-4 mb-8 ${
      isCustom ? "border-gold/30" : "border-steel"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${
          isCustom ? "bg-gold/10 text-gold" : "bg-steel/20 text-ice"
        }`}
      >
        {icon}
      </div>
      <div>
        <h2
          className={`text-2xl md:text-3xl font-bold uppercase tracking-tighter ${
            isCustom ? "text-gold" : "text-white"
          }`}
        >
          {title}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ice/50">
          Detalle de Producción
        </p>
      </div>
    </div>
    <span className="text-4xl font-black text-white/5">
      {count.toString().padStart(2, "0")}
    </span>
  </div>
);

const SpecBadge = ({ label, value }) => (
  <div className="flex items-center gap-2 bg-steel/10 px-3 py-1.5 rounded border border-steel/20">
    <span className="text-[10px] uppercase text-ice/40 font-bold">{label}</span>
    <span className="text-sm text-white font-bold">{value || "N/A"}</span>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen bg-blackDeep flex items-center justify-center text-gold">
    <Loader2 className="w-10 h-10 animate-spin" />
    <span className="ml-4 font-satoshi text-xl tracking-widest uppercase">
      Cargando Especificaciones...
    </span>
  </div>
);

const ErrorScreen = ({ message, goBack }) => (
  <div className="min-h-screen bg-blackDeep flex flex-col items-center justify-center gap-4">
    <p className="text-red-500 font-satoshi">{message}</p>
    <button onClick={goBack} className="text-gold underline uppercase text-xs">
      Volver atrás
    </button>
  </div>
);
