import jwt from 'jsonwebtoken';
import { asyncHandler, errorHttp } from '../utils/error.js';
export function autenticar(Usuario, secret) {
  return asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw errorHttp(401, 'Se requiere un JWT para acceder');
    let payload;
    try {
      payload = jwt.verify(header.slice(7), secret, {
        algorithms: ['HS256'],
        issuer: 'mantenimiento-api',
        audience: 'mantenimiento-web'
      });
      if (!payload.exp || !/^\d+$/.test(payload.sub)) throw new Error('Claims inválidos');
    } catch {
      throw errorHttp(401, 'Token inválido o vencido. Iniciá sesión nuevamente');
    }
    const usuario = await Usuario.findByPk(Number(payload.sub));
    if (!usuario || !usuario.activo) throw errorHttp(401, 'Usuario inexistente o bloqueado');
    // Se consulta el rol actual en la BD: bloquear/cambiar permisos tiene efecto inmediato.
    req.usuario = usuario;
    next();
  });
}
export const esAdmin = usuario => ['admin', 'mantenimiento'].includes(usuario.rol);
export const autorizarRoles = (...roles) => (req, res, next) => roles.includes(req.usuario.rol) ? next() : next(errorHttp(403, 'No tenés permisos para esta acción'));
export function puedeVer(usuario, orden) {
  return esAdmin(usuario) || usuario.rol === 'solicitante' && orden.solicitanteId === usuario.id || usuario.rol === 'tecnico' && orden.tecnicoId === usuario.id;
}
