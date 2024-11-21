import axios from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:15001",   // URL do servidor
  timeout: 10000,                      // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json", // Garantir envio em JSON
  },
});
export default api;

