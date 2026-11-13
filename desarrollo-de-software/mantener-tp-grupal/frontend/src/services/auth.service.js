import api from './api';
export const login = datos => api.post('/auth/login', datos).then(r => r.data);
export const registrar = datos => api.post('/auth/register', datos).then(r => r.data);
export const consultarSesion = () => api.get('/auth/me').then(r => r.data);
