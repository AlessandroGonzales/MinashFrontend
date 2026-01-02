import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { getServiceById } from "../services/authService"; 
import { toastSuccess, toastError } from "../Utils/toast";
import { useCart } from "../context/CartContext";
import { createDetailsOrder } from "../services/authService";
import { getDisplayImageUrl } from "../Utils/ImageUtils";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { addToCart } = useCart();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [selectedSize, setSelectedSize] = useState("");
  const [details, setDetails] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

 

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

      console.log("ID del servicio:", id);
    };

    fetchService();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!selectedColor) {
      toastError("Selecciona un color");
      return;
    }

    const detailsOrderRequest = {
      count: quantity,
      selectedColor,
      selectedSize, 
      details, 
      idService: service.idService,
      idGarmentService: null,
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
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="animate-pulse text-ice text-2xl">
          Cargando detalle...
        </div>
      </div>
    );
  }

  if (!service) return null;

  const totalPrice = (service.servicePrice || 0) * quantity;

  return (
    <div className="min-h-screen pt-12 pb-20 px-6 md:px-12 lg:px-32">
      <button
        onClick={() => navigate("/serigraphy")}
        className="flex items-center gap-2 text-ice/70 hover:text-gold transition mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a servicios
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {service.imageUrl ? (
            <img
              src={getDisplayImageUrl(service.imageUrl)}
              alt={service.serviceName}
              className="w-full min-h-min object-cover max-h-96 lg:max-h-full"
            />
          ) : (
            <div className="bg-steel/30 h-96 flex items-center justify-center">
              <span className="text-gold text-8xl font-bold opacity-40">M</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        {/* Detalles y formulario */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-ice mb-6">
            {service.serviceName}
          </h1>

          <p className="text-ice/80 text-lg leading-relaxed mb-8">
            {service.serviceDetails || service.description}
          </p>

          <div className="bg-graphite border border-steel/50 rounded-2xl p-8 space-y-8">
            {/* Precio base */}
            <div>
              <span className="text-ice/70 text-lg">Precio por unidad:</span>
              <span className="text-gold text-xl font-bold ml-3">
                ${service.servicePrice || "Consultar"}
              </span>
            </div>

            {/* Selección de color */}
            <div>
              <label className="text-ice font-medium mb-3 block">
                Color de la prenda
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-blackDeep border border-steel/70 rounded-xl px-5 py-4 text-ice focus:outline-none focus:border-gold/70 transition"
              >
                <option value="">Seleccione un color</option>
                {service.colors?.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-ice font-medium mb-3 block">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full bg-blackDeep border border-steel/70 rounded-xl px-5 py-4 text-ice focus:outline-none focus:border-gold/70 transition"
              />
            </div>

            {/* Total */}
            <div className="pt-6 border-t border-steel/50">
              <div className="flex justify-between items-center">
                <span className="text-xl text-ice font-semibold">Total:</span>
                <span className="text-gold text-xl font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botón añadir al carrito */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 rounded-xl bg-gold text-black font-bold text-lg uppercase hover:opacity-90 transition flex items-center justify-center gap-3 shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              Añadir al carrito
            </button>
            <div>
              <label className="text-ice font-medium mb-3 block">
                Detalles adicionales
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ej: impresión frontal, tamaño A4, ubicación centrada..."
                className="w-full bg-blackDeep border border-steel/70 rounded-xl px-5 py-4 text-ice focus:outline-none focus:border-gold/70 transition resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
