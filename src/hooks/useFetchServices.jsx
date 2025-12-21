import { useEffect, useState } from "react";
import { API_BASE_URL } from "../App";

export default function useFetchServices() {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/GarmentService/one-image/${1}`);
        if (!res.ok) throw new Error("Error al obtener servicios");

        const data = await res.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { services, loading, error };
}
