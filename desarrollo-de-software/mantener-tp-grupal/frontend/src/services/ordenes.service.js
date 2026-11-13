import api from './api';
export const listarOrdenes = params => api.get('/ordenes', {
  params
}).then(r => r.data);
export const obtenerOrden = id => api.get(`/ordenes/${id}`).then(r => r.data);
export const crearOrden = datos => api.post('/ordenes', datos).then(r => r.data);
export const editarOrden = (id, datos) => api.put(`/ordenes/${id}`, datos).then(r => r.data);
export const cancelarOrden = id => api.patch(`/ordenes/${id}/cancelar`, {}).then(r => r.data);
export const asignarOrden = (id, tecnicoId) => api.patch(`/ordenes/${id}/asignar`, {
  tecnicoId
}).then(r => r.data);
export const resolverOrden = id => api.patch(`/ordenes/${id}/resolver`, {}).then(r => r.data);
export const obtenerHistorial = id => api.get(`/ordenes/${id}/historial`).then(r => r.data);
export const obtenerResumen = () => api.get('/ordenes/resumen').then(r => r.data);
