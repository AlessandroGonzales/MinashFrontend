// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useMemo } from "react";
import { 
  Upload, 
  X, 
  ArrowRight, 
  Sparkles, 
  Shirt, 
  Palette, 
  Scissors, 
  Calculator,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createDetailsOrder } from "../services/authService";
import { toastError, toastSuccess, toastInfo } from "../Utils/toast";

// --- DATOS MOCK (Idealmente vendrían de tu API: /api/Garments y /api/Services) ---
const MOCK_GARMENTS = [
  { id: 1, name: "Remera Heavyweight", price: 15000, image: "👕" },
  { id: 2, name: "Hoodie Premium", price: 35000, image: "🧥" },
  { id: 3, name: "Pantalón Cargo", price: 28000, image: "👖" },
  { id: 4, name: "Gorra Trucker", price: 8000, image: "🧢" },
];

const MOCK_SERVICES = [
  { id: 1, name: "Serigrafía (1 color)", price: 5000, description: "Clásico y duradero" },
  { id: 2, name: "Bordado 3D", price: 8500, description: "Textura y relieve premium" },
  { id: 3, name: "DTF Full Color", price: 6500, description: "Detalles fotográficos" },
  { id: 4, name: "Vinilo Textil", price: 4000, description: "Acabado mate o brillante" },
];

export default function CustomService() {
  const navigate = useNavigate();
  
  // Estado del Formulario
  const [formData, setFormData] = useState({
    selectedColor: "",
    selectedSize: "",
    count: 1,
    customerDetails: "",
    idGarment: null,
    idService: null,
    imageFiles: [] // Array para guardar los objetos File reales
  });

  // Estado para previsualización de imágenes
  const [previews, setPreviews] = useState([]);
  // Estado de carga
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CÁLCULO DINÁMICO DEL TOTAL ---
  const customTotal = useMemo(() => {
    const garmentPrice = MOCK_GARMENTS.find(g => g.id === formData.idGarment)?.price || 0;
    const servicePrice = MOCK_SERVICES.find(s => s.id === formData.idService)?.price || 0;
    return (garmentPrice + servicePrice) * formData.count;
  }, [formData.idGarment, formData.idService, formData.count]);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelection = (field, id) => {
    setFormData(prev => ({ ...prev, [field]: id }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Guardar archivos reales para el backend
      setFormData(prev => ({ 
        ...prev, 
        imageFiles: [...prev.imageFiles, ...files] 
      }));

      // Crear URLs para previsualización
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // --- SUBMIT (Lógica FormData para C#) ---
  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.idGarment || !formData.idService || !formData.selectedColor || !formData.selectedSize || !formData.customerDetails) {
      toastInfo("Por favor completa todos los campos requeridos.")
      return;
    }

    setIsSubmitting(true);

    try {
      // Construimos FormData porque el DTO tiene List<IFormFile>
      const dataToSend = new FormData();
      
      dataToSend.append("idGarment", formData.idGarment);
      dataToSend.append("idService", formData.idService);
      dataToSend.append("selectedColor", formData.selectedColor);
      dataToSend.append("selectedSize", formData.selectedSize);
      dataToSend.append("count", formData.count);
      dataToSend.append("customerDetails", formData.customerDetails);
      // Enviamos el total calculado (o dejamos que el backend lo recalcule por seguridad)
      dataToSend.append("customTotal", customTotal);

      // Adjuntar imágenes (La clave debe coincidir con "ImageUrl" en tu DTO de C#)
      formData.imageFiles.forEach((file) => {
        dataToSend.append("imageUrl", file);
      });

      // AQUÍ LLAMARÍAS A TU FUNCIÓN API
      await createDetailsOrder(dataToSend); 
      
      console.log("Enviando al backend:", Object.fromEntries(dataToSend));
      
      // Simulación de éxito
      setTimeout(() => {
        toastSuccess("¡Solicitud Custom creada con éxito! Redirigiendo al carrito...")
        setIsSubmitting(false);
        navigate("/cart");
      }, 1500);

    } catch (error) {
      console.error("Error creating custom order:", error);
      toastError("Error al crear la custom. ")
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blackDeep text-primary font-satoshi selection:bg-gold selection:text-black">
      
      {/* Header */}
      <div className="pt-24 pb-12 px-6 md:px-12 lg:px-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          Diseño <span className="text-gold">Custom</span>
        </h1>
        <p className="text-steel text-lg max-w-xl mx-auto">
          Rompe los moldes. Tu visión, nuestras herramientas. Crea una pieza única desde cero.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 md:px-12 lg:px-24 pb-24 max-w-[1600px] mx-auto">
        
        {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* SECCIÓN 1: BASE (Prenda y Técnica) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-graphite flex items-center justify-center border border-gold/30 text-gold font-bold">1</div>
              <h2 className="text-2xl font-bold">Define la Base</h2>
            </div>
            
            {/* Grid de Prendas */}
            <div className="space-y-4">
              <label className="text-sm text-steel uppercase tracking-widest font-bold">Selecciona Prenda</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOCK_GARMENTS.map((garment) => (
                  <div 
                    key={garment.id}
                    onClick={() => handleSelection('idGarment', garment.id)}
                    className={`
                      cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-3
                      border transition-all duration-300 relative overflow-hidden group
                      ${formData.idGarment === garment.id 
                        ? "bg-gold/10 border-gold shadow-[0_0_30px_-10px_rgba(201,168,106,0.3)]" 
                        : "bg-graphite/40 border-steel/30 hover:border-steel hover:bg-graphite/60"}
                    `}
                  >
                    <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{garment.image}</span>
                    <div className="text-center">
                      <p className={`font-bold text-sm ${formData.idGarment === garment.id ? "text-gold" : "text-primary"}`}>{garment.name}</p>
                      <p className="text-xs text-steel mt-1">${garment.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid de Servicios */}
            <div className="space-y-4 mt-8">
              <label className="text-sm text-steel uppercase tracking-widest font-bold">Selecciona Técnica</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_SERVICES.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => handleSelection('IdService', service.id)}
                    className={`
                      cursor-pointer rounded-2xl p-5 flex items-start gap-4
                      border transition-all duration-300
                      ${formData.idService === service.id 
                        ? "bg-gold/10 border-gold" 
                        : "bg-graphite/40 border-steel/30 hover:border-steel"}
                    `}
                  >
                    <div className={`mt-1 ${formData.idService === service.id ? "text-gold" : "text-steel"}`}>
                      {formData.idService === service.id ? <CheckCircle2 size={20}/> : <div className="w-5 h-5 rounded-full border border-steel" />}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{service.name}</p>
                      <p className="text-sm text-steel mb-2">{service.description}</p>
                      <p className="text-xs font-mono text-gold/80">+ ${service.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-steel/30 to-transparent" />

          {/* SECCIÓN 2: ESPECIFICACIONES (Color, Talle, Cantidad) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-graphite flex items-center justify-center border border-gold/30 text-gold font-bold">2</div>
              <h2 className="text-2xl font-bold">Especificaciones</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Color */}
              <div className="space-y-2 group">
                <label className="text-sm text-steel font-bold flex items-center gap-2">
                  <Palette size={16} /> Color
                </label>
                <input
                  type="text"
                  name="SelectedColor"
                  placeholder="Ej: Verde Pastel, Negro Mate"
                  value={formData.selectedColor}
                  onChange={handleInputChange}
                  className="w-full bg-graphite/40 border border-steel/30 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all placeholder:text-steel/50"
                />
              </div>

              {/* Talle */}
              <div className="space-y-2">
                <label className="text-sm text-steel font-bold flex items-center gap-2">
                  <Scissors size={16} /> Talle / Medidas
                </label>
                <input
                  type="text"
                  name="SelectedSize"
                  placeholder="Ej: XXL, Oversized, A medida"
                  value={formData.selectedSize}
                  onChange={handleInputChange}
                  className="w-full bg-graphite/40 border border-steel/30 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all placeholder:text-steel/50"
                />
              </div>

              {/* Cantidad */}
              <div className="space-y-2">
                <label className="text-sm text-steel font-bold flex items-center gap-2">
                  <Calculator size={16} /> Cantidad
                </label>
                <input
                  type="number"
                  name="Count"
                  min="1"
                  value={formData.count}
                  onChange={(e) => setFormData({...formData, count: parseInt(e.target.value) || 1})}
                  className="w-full bg-graphite/40 border border-steel/30 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>
          </section>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-steel/30 to-transparent" />

          {/* SECCIÓN 3: LA VISIÓN (Upload & Detalles) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-graphite flex items-center justify-center border border-gold/30 text-gold font-bold">3</div>
              <h2 className="text-2xl font-bold">Tu Visión</h2>
            </div>

            {/* Upload Area */}
            <div className="bg-graphite/20 border-2 border-dashed border-steel/40 rounded-2xl p-8 text-center hover:border-gold/50 transition-colors relative">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-graphite rounded-full text-gold">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium">Arrastra tus diseños o haz click aquí</p>
                  <p className="text-steel text-sm mt-1">Soporta PNG, JPG, AI, PDF (Máx 10MB)</p>
                </div>
              </div>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
                {previews.map((src, index) => (
                  <div key={index} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-steel/50 group">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Detalles Texto */}
            <div className="space-y-2">
               <label className="text-sm text-steel font-bold">Detalles Adicionales</label>
               <textarea
                name="CustomerDetails"
                value={formData.customerDetails}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe tu idea con precisión: ubicación del logo, tamaño específico en cm, referencias..."
                className="w-full bg-graphite/40 border border-steel/30 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all placeholder:text-steel/50 resize-none"
               />
            </div>
          </section>

        </div>

        {/* --- COLUMNA DERECHA: RESUMEN (Sticky) --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-graphite/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-gold" /> Resumen
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-steel">
                <span>Prenda Base</span>
                <span className="text-ice">
                  {MOCK_GARMENTS.find(g => g.id === formData.idGarment)?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between text-steel">
                <span>Técnica</span>
                <span className="text-ice">
                  {MOCK_SERVICES.find(s => s.id === formData.idService)?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between text-steel">
                <span>Cantidad</span>
                <span className="text-ice">x{formData.count}</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-lg font-medium">Total Estimado</span>
                <span className="text-4xl font-satoshi font-bold text-gold">
                  ${customTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-steel mt-2 text-right">
                *El precio final puede variar según complejidad del diseño tras revisión.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                w-full py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3
                transition-all duration-500
                ${isSubmitting 
                  ? "bg-steel text-white/50 cursor-not-allowed" 
                  : "bg-gold text-blackDeep hover:bg-white hover:text-blackDeep shadow-lg shadow-gold/20 hover:shadow-gold/40"}
              `}
            >
              {isSubmitting ? "Procesando..." : (
                <>
                  Agregar al Pedido <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}