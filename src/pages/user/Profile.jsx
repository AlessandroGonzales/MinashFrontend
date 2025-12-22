import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { getDisplayImageUrl } from "../../Utils/imageUtils";
import { patchUserField } from "../../services/authService";
import { toastSuccess, toastError, toastBye } from "../../Utils/toast";
export default function Profile() {
  const { user: authUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const fileInputRef = useRef(null);

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
    toastBye(`Espero vuelvas pronto, ${profile.userName}`);
    navigate("/", { replace: true });
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

  // En Profile.jsx → handleImageUpload
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
    <div className="relative">
      <label className="text-steel text-sm">{label}</label>

      {editingField === field ? (
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
          className="w-full mt-1 bg-blackDeep border border-steel rounded-lg p-2 text-ice"
        />
      ) : (
        <p className="text-ice text-lg mt-1 flex justify-between items-center">
          {value || "-"}
          <button
            onClick={() => setEditingField(field)}
            className="text-gold hover:opacity-80 transition"
          >
            ⋯
          </button>
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gold text-xl animate-pulse">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4 max-w-5xl">
      <h1 className="text-4xl md:text-5xl font-bold text-gold mb-12 text-center">
        Mi Perfil
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Foto de perfil */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative">
            {profile?.imageUrl ? (
              <img
                src={getDisplayImageUrl(profile.imageUrl)}
                alt="Foto de perfil"
                className="w-64 h-64 object-cover rounded-full shadow-2xl"
              />
            ) : (
              <div className="w-64 h-64 bg-graphite rounded-full border-4 border-gold flex items-center justify-center shadow-2xl">
                <span className="text-6xl font-bold text-gold">
                  {profile?.userName?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-4 right-4 bg-gold text-black px-3 py-1 rounded-full shadow text-sm"
            >
              Editar
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-ice">
            {profile?.userName || "Usuario"}
          </h2>
          <p className="text-gold text-lg">{profile?.role || authUser?.role}</p>
        </div>

        {/* Información detallada */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-graphite rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-semibold text-gold mb-6">
              Información Personal
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <EditableField
                label="Nombre de usuario"
                field="userName"
                value={profile?.userName}
              />

              <EditableField
                label="Apellido"
                field="lastName"
                value={profile?.lastName}
              />

              <div>
                <label className="text-steel text-sm">Email</label>
                <p className="text-ice text-lg mt-1">{profile?.email || "-"}</p>
              </div>

              <EditableField
                label="Teléfono"
                field="phoneNumber"
                value={profile?.phoneNumber}
              />
            </div>
          </div>

          <div className="bg-graphite rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-semibold text-gold mb-6">
              Dirección de Envío
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <EditableField
                  label="Dirección completa"
                  field="fullAddress"
                  value={profile?.fullAddress}
                />
              </div>

              <EditableField
                label="Dirección"
                field="address"
                value={profile?.address}
              />

              <EditableField
                label="Ciudad"
                field="city"
                value={profile?.city}
              />

              <EditableField
                label="Provincia"
                field="province"
                value={profile?.province}
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
