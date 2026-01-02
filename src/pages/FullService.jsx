import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { getGarmentService, getGarmentServicesByQuality } from "../services/authService";
import { toastError, toastInfo } from "../Utils/toast";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/auth/AuthModal";
import { useNavigate } from "react-router-dom";
import { getDisplayImageUrl } from "../Utils/ImageUtils";

const FullServices = () => {
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
          data = await getGarmentServicesByQuality(selectedQuality);
        } else {
          data = await getGarmentService();
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
        (s.category || s.type || s.garmentServiceName || "")
          .toLowerCase()
          .includes(selectedTechnique.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          (s.GarmentServiceName || s.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (s.garmentServiceDetails || s.description || "")
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
    <div className="bg-graphite/40 backdrop-blur-xl border border-steel/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-7 h-7 text-gold" />
          <h3 className="text-2xl font-semibold text-primary ">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-gold/70 hover:text-gold text-base font-medium transition-colors duration-500"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Técnica */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-ice/100 mb-3 uppercase tracking-widest">
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
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-700 ${
                selectedTechnique === tech
                  ? "bg-gold/10 border border-gold/40 text-gold shadow-md"
                  : "text-ice/80 hover:bg-steel/20 hover:text-primary hover:border-steel/50"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Calidad */}
      <div>
        <h4 className="text-lg font-medium text-ice/100 mb-3 uppercase tracking-widest">
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
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-700 ${
                selectedQuality === q.value
                  ? "bg-gold/10 border border-gold/40 text-gold shadow-md"
                  : "text-ice/80 hover:bg-steel/20 hover:text-primary hover:border-steel/50"
              }`}
            >
              <div className="font-medium ">{q.label}</div>
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

    navigate(`/fullServices/${idService}`);
  };

  return (
    <div className="min-h-screen bg-blackDeep pt-12 text-primary py-16 md:py-10 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Fondo futurista sutil */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,106,0.08),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-primary mb-10 md:mb-24 text-center tracking-tight">
          Servicios <span className="text-gold">Completos</span>
        </h1>

        {/* Botón de filtro en móvil */}
        <div className="lg:hidden flex justify-center mb-6">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-graphite/40 backdrop-blur-md border border-steel/30 px-5 py-3 rounded-xl text-primary hover:border-gold/40 transition-all ">
            <Filter className="w-6 h-6 text-gold" />
            <span className="font-medium text-lg">Filtros</span>
            {hasActiveFilters && <span className="ml-3 text-gold text-xl">•</span>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Panel lateral solo en desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32">
              <FilterPanel />
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Barra de búsqueda */}
            <div className="relative mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ice/6    0 transition-colors duration-500" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 bg-graphite/40  border border-steel/30 rounded-3xl pl-16 pr-8 py-4 text-primary text-lg placeholder-ice/50 focus:outline-none focus:border-gold/40 transition-all duration-700 hover:shadow-gold/5"
              />
            </div>

            {/* Grid de servicios */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-graphite/30 border border-steel/20 rounded-2xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-ice/70 text-xl mb-4">
                  No encontramos servicios con los filtros seleccionados.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-gold text-lg font-medium hover:underline transition-colors duration-500"
                >
                  Ver todos los servicios →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <div
                    key={service.idService}
                    className="group relative bg-graphite/40 backdrop-blur-xl border border-steel/30 rounded-2xl overflow-hidden transition-all duration-700 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/10"
                  >
                    {/* Fondo efecto hover futurista */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
                      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_70%,rgba(201,168,106,0.12),transparent_50%)]" />
                    </div>

                    {/* Imagen */}
                    <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                      {service.imageUrl ? (
                        <img
                          src={getDisplayImageUrl(service.imageUrl)}
                          alt={service.garmentServiceName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 "
                        />
                      ) : (
                        <div className="w-full h-full bg-steel/10 flex items-center justify-center">
                          <span className="text-gold text-8xl font-bold opacity-20">
                            S
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Contenido */}
                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
                        {service.garmentServiceName}
                      </h3>

                      <p className="text-ice/70 text-sm leading-relaxed line-clamp-2">
                        {service.garmentServiceDetails}
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-gold text-lg font-semibold">
                          {service.addtionalPrice
                            ? `$${service.addtionalPrice}`
                            : "Consultar"}
                        </span>

                        <button
                          onClick={() => handleBuyClick(service.idGarmentService)}
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold transition-all duration-500 group-hover:translate-x-2"
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
            className="fixed inset-0 bg-blackDeep/80 z-50 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              className="absolute bottom-10  bg-blackDeep/90 backdrop-blur-xl m-2 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-primary">Filtros</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-3 rounded-full hover:bg-steel/30 transition-colors duration-500"
                >
                  <X className="w-7 h-7 text-primary" />
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}
      </div>
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
                className="px-6 py-3 rounded-3xl border border-steel/50 text-ice/70 hover:text-primary hover:border-steel transition-all duration-500"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  localStorage.setItem(serigraphyStorageKey, "true");
                  setShowSerigraphyModal(false);
                }}
                className="px-7 py-3 rounded-3xl bg-gold/90 text-blackDeep font-bold hover:bg-gold transition-all duration-500"
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

export default FullServices;