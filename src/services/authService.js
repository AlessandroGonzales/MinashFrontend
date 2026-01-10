import api from "../api/axios";
import { API_BASE_URL } from "../App";

// Credentials
export const login = async (credentials) => {
  const response = await api.post(`${API_BASE_URL}/api/user/login`, credentials);
  return response.data; 
};

export const register = async (data) => {
  const response = await api.post(`${API_BASE_URL}/api/user`, data);
  return response.data;
};

// GetAllOfEntitis
export const getAllGarment = async () => {
  const response = await api.get(`${API_BASE_URL}/api/garment`);
  return response.data;
};

export const getAllPaidORder = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");
  const response = await api.get(`${API_BASE_URL}/api/order/paid-orders`,
    {
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}

export const getVideos = async () => {
  const response = await api.get(`${API_BASE_URL}/api/video`);
  return response.data;
}

export const getAllServices = async () => {
  const response = await api.get(`${API_BASE_URL}/api/service`);
  return response.data;
};

export const getGarmentService = async () => {
  const response = await api.get(`${API_BASE_URL}/api/garmentService`);
  return response.data;
}

export const getGarmentServicesByQuality = async (quality) => {
  const response = await api.get(`${API_BASE_URL}/api/garmentService/filter`, {
    params: { quality: quality.toLowerCase() },
  });
  return response.data;
}

export const getServicesByQuality = async (quality) => {
  const response = await api.get(`${API_BASE_URL}/api/service/filter`, {
    params: { quality: quality.toLowerCase() },
  });
  return response.data;
};

export const getDraftOrder = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  const response = await api.get(
    `${API_BASE_URL}/api/order/draft`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getPaidOrder = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  const response = await api.get(
    `${API_BASE_URL}/api/order/paid`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// GetByIdOfEntitis
export const getGarmentServiceById = async (id) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${API_BASE_URL}/api/garmentService/${id}`, {
    headers: {
      "Authorization": `Bearer ${token} `
    }
  })
  return response.data
}

export const getDetailsByOrderId = async (orderId) => {
  const token = localStorage.getItem("token");

  const res = await api.get(
    `${API_BASE_URL}/api/detailsorder/by-order/${orderId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getCustomsByOrderId = async (orderId) => {
  const token = localStorage.getItem("token");

  const res = await api.get(
    `${API_BASE_URL}/api/custom/by-order/${orderId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getServiceById = async (id) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`${API_BASE_URL}/api/service/${id}`, {
    headers: {
      "Authorization": `Bearer ${token} `
    }
  })
  return response.data
}

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText || "No se pudo cargar el perfil"}`);
  }

  return await response.json();
};


// PostOfEntitis
export const createDetailsOrder = async (detailsOrder) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  const response = await api.post(
    `${API_BASE_URL}/api/DetailsOrder`,
    detailsOrder,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createCustom = async (custom) => {
 const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  const response = await api.post(
    `${API_BASE_URL}/api/custom`,
    custom,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createMercadoPagoPreference = async (orderId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  const response = await api.post(
    `${API_BASE_URL}/api/payment/create-mercadopago`, 
    { OrderId: orderId }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// PatchsOfEntitis
export const patchUserField = async (id, field, value) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  const form = new FormData();

  const backendField = field === "image" ? "ImageUrl" : field;

  form.append(backendField, value);

  const response = await fetch(`${API_BASE_URL}/api/user/${id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar: ${response.status} - ${errorText}`);
  }

};

export const patchOrderField = async (id, data) => {
  // 1. Recuperamos el token del almacenamiento local
  // Asegúrate de que la clave sea la misma que usas al hacer login (ej: "token", "authToken", etc.)
  const token = localStorage.getItem("token"); 

  if (!token) {
    throw new Error("No se encontró el token de autenticación");
  }

  // 2. Enviamos el token en los headers dentro de la configuración de Axios
  // La sintaxis de patch es: axios.patch(url, data, config)
  const response = await api.patch(`/Order/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  return response.data;
};

// DeletesOfEntitis
export const deleteDetailsOrderById = async (detailsOrderId) => {
  const token = localStorage.getItem("token");

  const res = await api.delete(
    `${API_BASE_URL}/api/detailsorder/${detailsOrderId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const deleteCustomById = async (customId) => {
  const token = localStorage.getItem("token");

  const res = await api.delete(
    `${API_BASE_URL}/api/custom/${customId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

