import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { getAllServices, getServicesByQuality } from "../services/authService";
import { toastError, toastInfo } from "../Utils/toast";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/auth/AuthModal";
import { useNavigate } from "react-router-dom";
import { getDisplayImageUrl } from "../Utils/ImageUtils";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSerigraphyModal, setShowSerigraphyModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  // Filtros
  const [selectedTechnique, setSelectedTechnique] = useState("Todas");
  const [selectedQuality, setSelectedQuality] = useState("Todas");

  // Control del modal de filtros en móvil
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Técnicas disponibles
  const techniques = ["Todas", "Bordado", "Vinilo", "Estampado", "Sublimado"];

  // Calidades
  const qualities = [
    { value: "Todas", label: "Todas las calidades" },
    { value: "premium", label: "Premium", desc: "Máxima calidad y detalle" },
    {
      value: "standard",
      label: "Standard",
      desc: "Excelente equilibrio calidad-precio",
    },
    { value: "basic", label: "Basic", desc: "Ideal para grandes tiradas" },
  ];

  // Cargar servicios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedQuality !== "Todas") {
          data = await getServicesByQuality(selectedQuality);
        } else {
          data = await getAllServices();
        }
        setServices(data);
        setFilteredServices(data);
      } catch (err) {
        toastError("No se pudieron cargar los servicios. Intenta más tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedQuality]);

  useEffect(() => {
    let filtered = services;

    if (selectedTechnique !== "Todas") {
      filtered = filtered.filter((s) =>
        (s.category || s.type || s.serviceName || "")
          .toLowerCase()
          .includes(selectedTechnique.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          (s.serviceName || s.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (s.serviceDetails || s.description || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedTechnique, services]);

  const resetFilters = () => {
    setSelectedTechnique("Todas");
    setSelectedQuality("Todas");
    setSearchTerm("");
    setIsFilterOpen(false);
  };

  const hasActiveFilters =
    selectedTechnique !== "Todas" ||
    selectedQuality !== "Todas" ||
    searchTerm !== "";

  const FilterPanel = () => (
    <div className="bg-graphite border border-steel/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-7 h-7 text-gold" />
          <h3 className="text-2xl font-semibold text-ice">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-gold/70 hover:text-gold text-sm font-medium transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Técnica */}
      <div className="mb-8">
        <h4 className="text-gl font-medium text-ice/100 mb-3 uppercase tracking-wider">
          Técnica
        </h4>
        <div className="space-y-2">
          {techniques.map((tech) => (
            <button
              key={tech}
              onClick={() => {
                setSelectedTechnique(tech);
                setIsFilterOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedTechnique === tech
                  ? "bg-gold/20 text-gold border border-gold/50"
                  : "text-ice/80 hover:bg-steel/30 hover:text-ice"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Calidad */}
      <div>
        <h4 className="text-gl font-medium text-ice/100 mb-3 uppercase tracking-wider">
          Calidad
        </h4>
        <div className="space-y-2">
          {qualities.map((q) => (
            <button
              key={q.value}
              onClick={() => {
                setSelectedQuality(q.value);
                setIsFilterOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedQuality === q.value
                  ? "bg-gold/20 text-gold border border-gold/50"
                  : "text-ice/80 hover:bg-steel/30 hover:text-ice"
              }`}
            >
              <div className="font-medium">{q.label}</div>
              {q.desc && (
                <div className="text-xs text-ice/60 mt-1">{q.desc}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const serigraphyStorageKey = user
    ? `serigraphy_warning_accepted_user_${user.iduser}`
    : null;

  const handleBuyClick = (idService) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toastInfo("Debes iniciar sesión para realizar la compra");
      return;
    }

    const alreadyAccepted = localStorage.getItem(serigraphyStorageKey);

    if (
      !alreadyAccepted &&
      services?.serviceName?.toLowerCase().includes("serigrafía")
    ) {
      setShowSerigraphyModal(true);
      sessionStorage.setItem("pendingService", JSON.stringify(services));
      return;
    }

    navigate(`/serigraphy/${idService}`);
  };

  return (
    <div className="min-h-screen pt-12 pb-16 px-6 md:px-12 lg:px-24 relative">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-ice mb-12 text-center">
          Nuestros Servicios
        </h1>

        {/* Botón de filtro en móvil */}
        <div className="lg:hidden flex justify-center mb-6">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-graphite border border-steel/50 px-5 py-3 rounded-xl text-ice hover:border-gold/50 transition-all"
          >
            <Filter className="w-5 h-5 text-gold" />
            <span className="font-medium">Filtros</span>
            {hasActiveFilters && <span className="ml-2 text-gold">•</span>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Panel lateral solo en desktop */}
          <aside className="hidden lg:block lg:col-span-1 lg:pl-8 xl:pl-2">
            <div className="sticky top-28">
              <FilterPanel />
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Barra de búsqueda */}
            <div className="relative mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ice/60" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 bg-graphite border border-steel/50 rounded-xl pl-12 pr-6 py-4 text-ice placeholder-ice/60 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            {/* Grid de servicios */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-graphite/50 border border-steel/30 rounded-2xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-ice/60 text-xl mb-4">
                  No encontramos servicios con los filtros seleccionados.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-gold hover:underline font-medium"
                >
                  Ver todos los servicios →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <div
                    key={service.idService}
                    className="group relative bg-graphite border border-steel/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-gold/50 transition-all duration-300"
                  >
                    {/* Imagen */}
                    <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                      {service.imageUrl ? (
                        <img
                          src={getDisplayImageUrl(service.imageUrl)}
                          alt={service.serviceName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-steel/20 flex items-center justify-center">
                          <span className="text-gold text-6xl font-bold opacity-30">
                            M
                          </span>
                        </div>
                      )}

                      {/* Overlay sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-ice mb-2">
                        {service.serviceName}
                      </h3>

                      <p className="text-ice/70 text-sm leading-relaxed line-clamp-2">
                        {service.serviceDetails}
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-gold text-lg font-semibold">
                          {service.servicePrice
                            ? `$${service.servicePrice}`
                            : "Consultar"}
                        </span>

                        <button
                          onClick={() => handleBuyClick(service.idService)}
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm uppercase border-2 border-gold text-gold hover:bg-gold/10 transition"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isFilterOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-50 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              className="absolute bottom-10  bg-graphite m-3 rounded-3xl p-6 max-h-[85vh]  overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-ice">Filtros</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-lg hover:bg-steel/30 transition-colors"
                >
                  <X className="w-6 h-6 text-ice" />
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showSerigraphyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-graphite border border-gold/80 rounded-3xl p-8 max-w-md mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gold mb-4">
              Aviso importante
            </h3>

            <p className="text-ice/80 text-sm leading-relaxed mb-6">
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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSerigraphyModal(false);
                }}
                className="px-4 py-2 rounded-xl border border-steel text-ice/70 hover:text-ice transition"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  localStorage.setItem(serigraphyStorageKey, "true");
                  setShowSerigraphyModal(false);
                 
                }}
                className="px-5 py-2 rounded-xl bg-gold text-black font-semibold hover:opacity-90 transition"
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

export default Services;
