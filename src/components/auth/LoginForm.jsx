import { useState } from "react";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { toastSuccess, toastError } from "../../Utils/toast";
import { jwtDecode } from "jwt-decode";

export default function LoginForm({ onSuccess }) {
  const { login: loginContext } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(form);

      loginContext(data.token);
      const decoded = jwtDecode(data.token);

      const displayName =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded["name"] ||
        decoded.name ||
        "usuario";

      toastSuccess(`¡Bienvenido de vuelta, ${displayName}!`);
      onSuccess();
    } catch (err) {
      console.log(err);
      toastError("Credenciales inválidas. Verifica tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          onChange={handleChange}
          className="w-full bg-blackDeep border border-steel rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-gold"
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          onChange={handleChange}
          className="w-full bg-blackDeep border border-steel rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-gold"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold text-black font-semibold py-2 rounded-lg hover:opacity-90 transition"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
