import axios from 'axios';
export const SESSION_KEY = 'dds-mantenimiento-token';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 12000
});
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem(SESSION_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !['/auth/login', '/auth/register'].includes(error.config?.url)) {
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('sesion-vencida'));
  }
  return Promise.reject(error);
});
export function mensajeError(error) {
  if (error.response) return error.response.data?.error || `Error de la API (${error.response.status})`;
  if (error.request) return 'No se pudo conectar con el servidor. Revisá que el backend esté iniciado.';
  return error.message || 'No se pudo completar la operación';
}
export default api;
