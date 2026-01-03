import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Info,
  Layers,
} from "lucide-react";
import { toastSuccess, toastError, toastInfo } from "../Utils/toast";
import { getGarmentServiceById } from "../services/authService";
import { useCart } from "../context/CartContext";
import { createDetailsOrder } from "../services/authService";
import { getDisplayImageUrl } from "../Utils/ImageUtils";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/auth/AuthModal";

const FullServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { addToCart } = useCart();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [details, setDetails] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectesSize] = useState("");
  const {  isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        toastError("ID de servicio no válido");
        navigate("/fullServices");
        return;
      }
      try {
        setLoading(true);
        const data = await getGarmentServiceById(id);
        setService(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (err) {
        console.error(err);
        toastError("No se pudo cargar el servicio");
        navigate("/fullServices");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toastInfo("Debes iniciar sesión para realizar la compra");
      return;
    }

    if (!selectedColor) {
      toastError("Selecciona un color");
      return;
    }

    const detailsOrderRequest = {
      count: quantity,
      selectedColor,
      selectedSize,
      details,
      idService: null,
      idGarmentService: id,
    };
    try {
      await createDetailsOrder(detailsOrderRequest);
      toastSuccess("Servicio añadido al pedido");
    } catch (error) {
      console.error(error);
      toastError("No se pudo añadir el servicio al pedido");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blackDeep font-['Satoshi']">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) return null;
  const totalPrice = (service.addtionalPrice || 0) * quantity;

  return (
    <div className="min-h-screen bg-blackDeep text-ice font-['Satoshi'] selection:bg-gold/30 pb-20">
      {/* Botón Volver */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <button
          onClick={() => navigate("/fullServices")}
          className="group flex items-center gap-3 text-xs font-bold tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          Regresar
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
        {/* Columna Izquierda: Visualizador de Imagen */}
        <div className="lg:col-span-7">
          <div className="sticky top-10">
            <div className="relative group rounded-[2.5rem] overflow-hidden bg-graphite  shadow-2xl">
              {service.imageUrl ? (
                <img
                  src={getDisplayImageUrl(service.imageUrl[0])}
                  alt={service.garmentServiceName}
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
                  Full Service
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Configuración */}
        <div className="lg:col-span-5">
          <header className="mb-12">
            <h1 className="text-5xl lg:text-5xl  tracking-tighter uppercase leading-none mb-6">
              {service.garmentServiceName}
            </h1>
            <p className="text-ice/70 text-lg font-light leading-relaxed">
              {service.garmentServiceDetails || service.description}
            </p>
          </header>

          <div className="space-y-12">
            {/* Selector de Talle */}
            <div className="space-y-5">
              <label className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
                Talla Disponible
              </label>
              <div className="flex flex-wrap gap-3">
                {service.sizes?.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectesSize(size)}
                    className={`min-w-[50px] h-[50px] rounded-xl border text-sm font-bold transition-all duration-300 ${
                      selectedSize === size
                        ? "bg-ice text-blackDeep border-ice"
                        : "border-white/10 hover:border-gold/50 text-ice/60"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Color */}
            <div className="space-y-5">
              <label className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
                Paleta de Color
              </label>
              <div className="flex flex-wrap gap-3">
                {service.colors?.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      selectedColor === color
                        ? "bg-gold text-blackDeep border-gold shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
                        : "border-white/10 hover:border-gold/50 text-ice/60"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad y Precio */}
            <div className="flex items-center justify-between py-10 border-y border-white/5">
              <div className="space-y-4">
                <label className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 block">
                  Cantidad
                </label>
                <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 text-xl font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:text-gold transition-colors"
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
                  ${service.addtionalPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
                <Info className="w-3 h-3" /> Especificaciones del encargo
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ej: Logo en espalda, hilos dorados..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-ice placeholder:opacity-60 focus:outline-none focus:border-gold/50 transition-all resize-none"
              />
            </div>

            {/* Acción Final */}
            <div className="pt-4">
              <div className="flex justify-between items-end mb-8">
                <span className="text-xs opacity-40 uppercase tracking-widest font-bold">
                  Inversión Total
                </span>
                <span className="text-4xl  tracking-tighter text-gold">
                  $
                  {totalPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="group relative w-full h-14 bg-gold rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.25)] transition-all duration-500"
              >
                <div className="relative z-10 flex items-center justify-center gap-4 text-blackDeep font-black uppercase tracking-[0.2em] text-sm">
                  <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Confirmar Selección
                </div>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
            </div>
          </div>
        </div>
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
    </div>
  );
};

export default FullServiceDetails;
