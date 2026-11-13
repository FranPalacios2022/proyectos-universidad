import { errorHttp } from '../utils/error.js';
export function validarId(req, res, next) {
  if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(Number(req.params.id)) || Number(req.params.id) < 1) {
    return next(errorHttp(400, 'El id debe ser un entero positivo'));
  }
  req.params.id = Number(req.params.id);
  next();
}
export const validarBody = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return next(errorHttp(400, 'Se requiere un objeto JSON'));
  }
  next();
};
export function camposPermitidos(datos, campos) {
  const desconocidos = Object.keys(datos).filter(key => !campos.includes(key));
  if (desconocidos.length) throw errorHttp(400, `Campos no permitidos: ${desconocidos.join(', ')}`);
}
export function texto(valor, nombre, min, max) {
  if (typeof valor !== 'string' || valor.trim().length < min || valor.trim().length > max) {
    throw errorHttp(400, `${nombre} debe tener entre ${min} y ${max} caracteres`);
  }
  return valor.trim();
}
export function entero(valor, nombre) {
  if (!Number.isSafeInteger(valor) || valor < 1) throw errorHttp(400, `${nombre} debe ser un entero positivo`);
  return valor;
}
