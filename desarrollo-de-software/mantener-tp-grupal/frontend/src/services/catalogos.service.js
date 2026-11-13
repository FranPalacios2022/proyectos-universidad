import api from './api';
export const listarActivos = () => api.get('/activos').then(r => r.data);
export const listarTecnicos = () => api.get('/tecnicos').then(r => r.data);
