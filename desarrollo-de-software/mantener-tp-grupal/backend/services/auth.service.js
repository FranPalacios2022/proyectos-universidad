import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { camposPermitidos, texto } from '../middlewares/validacion.js';
import { errorHttp } from '../utils/error.js';
export const usuarioPublico = usuario => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
  activo: usuario.activo
});
export function crearAuthService(Usuario, secret, expiresIn = '2h') {
  function sesion(usuario) {
    const token = jwt.sign({
      rol: usuario.rol
    }, secret, {
      algorithm: 'HS256',
      subject: String(usuario.id),
      issuer: 'mantenimiento-api',
      audience: 'mantenimiento-web',
      expiresIn
    });
    return {
      token,
      usuario: usuarioPublico(usuario)
    };
  }
  function emailValido(email) {
    const value = texto(email, 'Email', 5, 160).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw errorHttp(400, 'El email no tiene un formato válido');
    return value;
  }
  return {
    async registrar(datos) {
      camposPermitidos(datos, ['nombre', 'email', 'password']);
      const nombre = texto(datos.nombre, 'Nombre', 3, 80);
      const email = emailValido(datos.email);
      const password = datos.password;
      if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        throw errorHttp(400, 'La contraseña debe tener al menos 8 caracteres, una letra y un número (máximo 72 bytes)');
      }
      if (await Usuario.findOne({
        where: {
          email
        }
      })) throw errorHttp(400, 'El email ya está registrado');
      const passwordHash = await bcrypt.hash(password, 10);
      // El cliente nunca elige su rol: todo registro público crea un solicitante.
      const usuario = await Usuario.create({
        nombre,
        email,
        passwordHash,
        rol: 'solicitante',
        activo: true
      });
      return sesion(usuario);
    },
    async login(datos) {
      camposPermitidos(datos, ['email', 'password']);
      if (typeof datos.email !== 'string' || typeof datos.password !== 'string') throw errorHttp(400, 'Email y contraseña son obligatorios');
      const usuario = await Usuario.findOne({
        where: {
          email: datos.email.trim().toLowerCase()
        }
      });
      if (!usuario || !usuario.activo || !(await bcrypt.compare(datos.password, usuario.passwordHash))) {
        throw errorHttp(401, 'Email o contraseña incorrectos');
      }
      return sesion(usuario);
    }
  };
}
