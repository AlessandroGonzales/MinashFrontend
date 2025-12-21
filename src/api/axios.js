import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7082/api",
});

// 🧠 Interceptor de respuestas (detecta tokens muertos)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Colapso del estado inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Evento global (React no conoce Axios)
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  }
);

export default api;
