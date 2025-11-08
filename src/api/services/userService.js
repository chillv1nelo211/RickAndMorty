import { api } from "../axiosClient";

export const characterService = {
  getAll: (page = 1) => api.get(`/character?page=${page}`),
  getOne: (id) => api.get(`/character/${id}`),
  create: (data) => api.post("/character", data),
  update: (id, data) => api.put(`/character/${id}`, data),
  delete: (id) => api.delete(`/character/${id}`),
};
