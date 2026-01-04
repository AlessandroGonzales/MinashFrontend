import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { getDisplayImageUrl } from "../../Utils/ImageUtils"; 
import { patchUserField } from "../../services/authService";
import { toastSuccess, toastError, toastBye } from "../../Utils/toast";
import { Camera, Edit2, LogOut, User, MapPin, ChevronRight, Save, X, Loader2 } from "lucide-react";

export default function Profile() {
  const { user: authUser, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError("No se pudo cargar el perfil. Intenta más tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        userName: profile.userName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        city: profile.city || "",
        province: profile.province || "",
        fullAddress: profile.fullAddress || "",
      });
    }
  }, [profile]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
    toastBye(`Espero vuelvas pronto, ${profile.userName}`);
  };

  const handlePartialSave = async (field) => {
    if (profile[field] === formData[field]) {
      setEditingField(null);
      return;
    }
    try {
      await patchUserField(profile.idUser, field, formData[field]);

      setProfile((prev) => ({
        ...prev,
        [field]: formData[field],
      }));

      {
        toastSuccess("Se ha actualizado el campo");
      }
    } catch (err) {
      console.error("Error al actualizar campo:", err);
      toastError("Error al actualizar el campo");
    } finally {
      setEditingField(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await patchUserField(profile.idUser, "ImageUrl", file);
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);
      updateUser({ imageUrl: updatedProfile.imageUrl });
      toastSuccess(`Foto de perfil Actualizada`);
    } catch (err) {
      console.error("Error al subir imagen:", err);
      toastError("Error al actualizar la foto de perfil");
    }
  };

  const EditableField = ({ label, field, value }) => (
    <div className="group relative py-4 border-b border-white/5 transition-colors hover:bg-white/[0.02] px-4 -mx-4 rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <label className="text-[10px] tracking-[0.2em] uppercase text-ice/40 font-bold flex items-center gap-2">
           {label}
        </label>
      </div>

      {editingField === field ? (
        <div className="flex items-center gap-3 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
          <input
            type="text"
            value={formData[field] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            onBlur={() => handlePartialSave(field)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePartialSave(field);
              if (e.key === "Escape") setEditingField(null);
            }}
            autoFocus
            className="w-full bg-transparent border-b border-gold text-gold text-xl font-light focus:outline-none placeholder:text-white/10 pb-1"
          />
          <button onClick={() => handlePartialSave(field)} className="text-gold hover:scale-110 transition-transform">
            <Save size={18} />
          </button>
          <button onClick={() => setEditingField(null)} className="text-red-400 hover:scale-110 transition-transform">
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-end mt-1 group cursor-pointer" onClick={() => setEditingField(field)}>
          <p className="text-ice text-xl font-light tracking-wide truncate pr-4">
            {value || <span className="text-white/10 italic text-base">Sin definir</span>}
          </p>
          <button
            className="text-gold/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
          >
            <Edit2 size={16} />
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blackDeep font-['Satoshi']">
        <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
        <p className="text-ice/50 text-xs tracking-[0.3em] uppercase animate-pulse">Autenticando Identidad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blackDeep font-['Satoshi']">
        <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-2xl text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-ice underline text-sm">Reintentar conexión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blackDeep text-ice font-['Satoshi'] pb-20 pt-12 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Columna Izquierda: Tarjeta de Identidad */}
        <div className="lg:col-span-4 lg:sticky lg:top-12 h-fit">
            <div className="relative group rounded-[2rem] overflow-hidden bg-graphite/40 border border-white/5 backdrop-blur-xl p-8 flex flex-col items-center text-center shadow-2xl">
                {/* Glow de fondo */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50"></div>
                
                {/* Avatar */}
                <div className="relative mb-6">
                    <div className="w-40 h-40 rounded-full p-1  relative group-hover:border-gold/60 transition-colors duration-500">
                        {profile?.imageUrl ? (
                            <img
                                src={getDisplayImageUrl(profile.imageUrl)}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-steel/10 rounded-full flex items-center justify-center">
                                <span className="text-5xl font-black text-gold opacity-50">
                                    {profile?.userName?.[0]?.toUpperCase() || "U"}
                                </span>
                            </div>
                        )}
                        {/* Overlay de Edición */}
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className="absolute inset-0 rounded-full bg-blackDeep/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-10"
                        >
                            <Camera className="w-8 h-8 text-gold mb-2" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Actualizar</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Nombre y Rol */}
                <h2 className="text-3xl font-bold text-ice mb-2">
                    {profile?.userName || "Usuario"}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                    <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">
                        {profile?.role || authUser?.role}
                    </span>
                </div>
                {/* Botón Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full py-4 rounded-xl border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-ice/60 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-3 group/logout"
                >
                    <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold tracking-widest uppercase">Desconectar</span>
                </button>
            </div>
        </div>

        {/* Columna Derecha: Datos */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Sección Personal */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-gold/10 text-gold">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-ice">Información Personal</h3>
                        <p className="text-ice/60 text-sm font-light">Gestiona tu identidad digital</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
                    <EditableField label="Nombre de Usuario" field="userName" value={profile?.userName} />
                    <EditableField label="Apellido" field="lastName" value={profile?.lastName} />
                    
                    {/* Campo Email (No Editable generalmente, o con diseño distinto) */}
                    <div className="group relative py-4 border-b border-white/5 opacity-60">
                         <label className="text-[10px] tracking-[0.2em] uppercase text-ice/40 font-bold block mb-2">Email Registrado</label>
                         <div className="text-ice text-xl font-light flex items-center gap-2">
                            {profile?.email || "-"}
                         </div>
                    </div>

                    <EditableField label="Teléfono Móvil" field="phoneNumber" value={profile?.phoneNumber} />
                </div>
            </div>

            {/* Separador Futurista */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Sección Envío */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-ice">Logística & Envío</h3>
                        <p className="text-ice/60 text-sm font-light">Coordenadas de entrega</p>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 space-y-2 hover:border-gold/20 transition-colors duration-500">
                    <EditableField label="Dirección Completa (Calle y Altura)" field="fullAddress" value={profile?.fullAddress} />
                    
                    <div className="grid md:grid-cols-3 gap-x-8 gap-y-2 mt-4 ">
                        <EditableField label="Referencia / Detalle" field="address" value={profile?.address} />
                        <EditableField label="Ciudad" field="city" value={profile?.city} />
                        <EditableField label="Provincia / Estado" field="province" value={profile?.province} />
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}