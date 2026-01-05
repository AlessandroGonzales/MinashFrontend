import { useState } from "react";

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    UserName: "",
    LastName: "",
    Email: "",
    Address: "",
    Phone: "",
    Province: "",
    City: "",
    FullAddress: "",
    PasswordHash: "",
    ImageUrl: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await fetch("https://localhost:7082/api/user", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Error al registrar usuario");
      }

      onSuccess(formData.UserName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <input
        type="text"
        name="UserName"
        placeholder="Nombre"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
        required
      />

      <input
        type="text"
        name="LastName"
        placeholder="Apellido"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
        required
      />

      <input
        type="email"
        name="Email"
        placeholder="Correo electrónico"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
        required
      />

      <input
        type="tel"
        name="Phone"
        placeholder="Teléfono"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
        required
      />

      <input
        type="text"
        name="Province"
        placeholder="Provincia"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
      />

      <input
        type="text"
        name="City"
        placeholder="Ciudad"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
      />

      <input
        type="text"
        name="Address"
        placeholder="Dirección"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
      />

      <textarea
        name="FullAddress"
        placeholder="Dirección completa"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary resize-none"
      />

      <input
        type="password"
        name="PasswordHash"
        placeholder="Contraseña"
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-blackDeep border border-steel text-primary"
        required
      />

      <div className="flex flex-col items-center space-y-2">
          <input
            type="file"
            id="ImageUrl"
            name="ImageUrl"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <label
            htmlFor="ImageUrl"
            className="flex flex-col items-center text-gold text-sm font-medium cursor-pointer hover:opacity-80 transition"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-steel transition-all duration-200 hover:border-gold">
              {preview ? (
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-blackDeep text-gold text-5xl">
                  +
                </div>
              )}
            </div>
            Subir Foto de Perfil (Opcional)
          </label>
        </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:opacity-90 transition"
      >
        {loading ? "Registrando..." : "Crear cuenta"}
      </button>
    </form>
  );
}
