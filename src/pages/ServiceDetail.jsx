import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus, Info } from "lucide-react";
import { getServiceById } from "../services/authService";
import { toastSuccess, toastError, toastInfo } from "../Utils/toast";
import AuthModal from "../components/auth/AuthModal";
import { useCart } from "../context/CartContext";
import { createDetailsOrder } from "../services/authService";
import { getDisplayImageUrl } from "../Utils/ImageUtils";
import { useAuth } from "../context/AuthContext";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { addToCart } = useCart();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inputQuantity, setInputQuantity] = useState("1");
  const [details, setDetails] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSerigraphyModal, setShowSerigraphyModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const { user, isAuthenticated } = useAuth();

  const serigraphyStorageKey = user
    ? `serigraphy_warning_accepted_user_${user.iduser}`
    : null;

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        toastError("ID de servicio no válido");
        navigate("/serigraphy");
        return;
      }
      try {
        setLoading(true);
        const data = await getServiceById(id);
        setService(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (err) {
        console.error(err);
        toastError("No se pudo cargar el servicio");
        navigate("/serigraphy");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, navigate]);

  useEffect(() => {
    setInputQuantity(String(quantity));
  }, [quantity]);

  const commitQuantityFromInput = () => {
    const raw = inputQuantity?.toString().trim();
    if (!raw) {
      setQuantity(1);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 1) {
      setQuantity(1);
    } else {
      setQuantity(parsed);
    }
  };

  const proceedToAddToCart = async () => {
    if (!selectedColor || !details ) {
      toastInfo("Debes completar todos lo campos");
      return;
    }

    const detailsOrderRequest = {
      count: quantity,
      selectedColor,
      selectedSize: "",
      details,
      idService: service.idService,
      idGarmentService: null,
    };
    try {
      await createDetailsOrder(detailsOrderRequest);
      toastSuccess("Servicio añadido al carrito");
    } catch (error) {
      console.error(error);
      toastError("No se pudo añadir el servicio al carrito");
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toastInfo("Debes iniciar sesión para realizar la compra");
      return;
    }

    const alreadyAccepted = localStorage.getItem(serigraphyStorageKey);

    if (!alreadyAccepted) {
      setShowSerigraphyModal(true);
      return;
    }

    await proceedToAddToCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blackDeep">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  const totalPrice = (service.servicePrice || 0) * quantity;

  return (
    <div className="min-h-screen bg-blackDeep text-ice pb-20">
      {/* Header Navegación */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <button
          onClick={() => navigate("/serigraphy")}
          className="group flex items-center gap-3 text-xs font-bold tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          Regresar
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        {/* Sección Izquierda: Imagen con efecto de profundidad */}
        <div className="lg:col-span-7">
          <div className="sticky top-10">
            <div className="relative group rounded-[2.5rem] overflow-hidden bg-graphite  shadow-2xl">
              {service.imageUrl ? (
                <img
                  src={getDisplayImageUrl(service.imageUrl)}
                  alt={service.serviceName}
                  className="w-full object-cover aspect-[4/5] lg:h-[75vh] group-hover:scale-105 transition-transform duration-1000"
                />
              ) : (
                <div className="aspect-[4/5] flex items-center justify-center">
                  <Layers className="w-20 h-20 text-gold/10" />
                </div>
              )}
              {/* Overlay Futurista */}
              <div className="absolute inset-0 bg-gradient-to-t from-blackDeep/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-10 left-10">
                <span className="bg-gold/90 text-blackDeep text-[10px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                  {service.serviceName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Derecha: Panel de Configuración Minimalista */}
        <div className="lg:col-span-5 flex flex-col">
          <header className="mb-10">
            <h1 className="text-5xl uppercase tracking-tighter mb-4 leading-none">
              {service.serviceName}
            </h1>
            <p className="text-ice/60 text-lg leading-relaxed ">
              {service.serviceDetails || service.description}
            </p>
          </header>

          <div className="space-y-10">
            {/* Selector de Color - Estilo Moderno */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
                Seleccionar Color
              </label>
              <div className="flex flex-wrap gap-3">
                {service.colors?.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      selectedColor === color
                        ? "bg-gold text-blackDeep border-gold shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
                        : "border-white/20 hover:border-gold/50 text-ice/60"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad y Precio unitario */}
            <div className="flex items-center justify-between py-10 ">
              <div className="space-y-4">
                <label className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 block">
                  Cantidad
                </label>
                <div className="flex items-center bg-black rounded-2xl p-1 border border-white/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={1}
                    step={1}
                    value={inputQuantity}
                    onChange={(e) => setInputQuantity(e.target.value)}
                    onBlur={commitQuantityFromInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        commitQuantityFromInput();
                        e.target.blur();
                      }
                    }}
                    className="min-w-[3rem] text-center bg-transparent "
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center "
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <label className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 block mb-4">
                  Precio Unitario
                </label>
                <span className="text-3xl font-light">
                  ${service.servicePrice?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Instrucciones Especiales */}
            <div className="space-y-4">
              <label className="flex items-center text-xs font-bold tracking-[0.2em] uppercase opacity-70">
                 Detalles de Personalización
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Indica tallas, posiciones o notas específicas..."
                rows={3}
                className="w-full bg-black border border-white/20 rounded-2xl px-6 py-5 text-ice placeholder:opacity-60 "
              />
            </div>

            {/* Footer de Compra - Sticky en móvil */}
            <div className="pt-6">
              <div className="flex items-end justify-between mb-6">
                <span className="text-sm opacity-70 mb-1">TOTAL ESTIMADO</span>
                <span className="text-4xl  tracking-tighter text-gold">
                  $
                  {totalPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="group relative w-full bg-gold overflow-hidden py-5 rounded-2xl font-black uppercase tracking-widest text-blackDeep hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-500"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Añadir al Pedido
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showSerigraphyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blackDeep/80">
          <div className="bg-graphite/50 backdrop-blur-xl rounded-3xl p-10 max-w-lg mx-6 shadow-2xl border border-steel/30">
            <h3 className="text-3xl font-bold text-gold mb-6 tracking-tight">
              Aviso importante
            </h3>

            <p className="text-ice/90 text-base leading-relaxed mb-8">
              Al continuar con la compra del servicio de{" "}
              <strong>serigrafía</strong>, usted estará abonando únicamente la
              técnica aplicada.
              <br />
              <br />
              <strong>La prenda no está incluida</strong>. El cliente deberá
              proporcionar las prendas sobre las cuales se realizará el
              servicio.
              <br />
              <br />
              Esta modalidad permite ofrecer un precio más accesible, ya que se
              cobra exclusivamente el proceso técnico.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowSerigraphyModal(false);
                }}
                className="px-6 py-3 rounded-3xl text-sm  border border-steel/50 text-ice/70 hover:text-primary hover:border-steel transition-all duration-500"
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  localStorage.setItem(serigraphyStorageKey, "true");
                  setShowSerigraphyModal(false);
                  await proceedToAddToCart();
                }}
                className="px-1 py-1  text-sm rounded-3xl bg-gold/90 text-blackDeep font-bold hover:bg-gold transition-all duration-500"
              >
                Entendido, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
