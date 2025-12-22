import api from "../api/axios";
import { API_BASE_URL } from "../App";

export const login = async (credentials) => {
  const response = await api.post(`${API_BASE_URL}/api/user/login`, credentials);
  return response.data; 
};

export const register = async (data) => {
  const response = await api.post(`${API_BASE_URL}/api/user`, data);
  return response.data;
};

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

export const getAllServices = async () => {
  const response = await api.get(`${API_BASE_URL}/api/service`);
  return response.data;
};

export const getServicesByQuality = async (quality) => {
  const response = await api.get(`${API_BASE_URL}/api/service/filter`, {
    params: { quality: quality.toLowerCase() },
  });
  return response.data;
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