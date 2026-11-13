import { createContext, useContext, useEffect, useState } from 'react';
import { consultarSesion, login, registrar } from '../services/auth.service';
import { mensajeError, SESSION_KEY } from '../services/api';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({
  children
}) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorSesion, setErrorSesion] = useState('');
  function salir() {
    sessionStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  }
  async function restaurar() {
    setCargando(true);
    setErrorSesion('');
    try {
      if (sessionStorage.getItem(SESSION_KEY)) setUsuario(await consultarSesion());
    } catch (error) {
      setErrorSesion(mensajeError(error));
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => {
    restaurar();
    const vencida = () => {
      setUsuario(null);
      setErrorSesion('Tu sesión venció. Volvé a ingresar.');
    };
    window.addEventListener('sesion-vencida', vencida);
    return () => window.removeEventListener('sesion-vencida', vencida);
  }, []);
  async function ingresar(datos, nuevo = false) {
    const sesion = await (nuevo ? registrar(datos) : login(datos));
    sessionStorage.setItem(SESSION_KEY, sesion.token);
    setUsuario(sesion.usuario);
    setErrorSesion('');
  }
  return <AuthContext.Provider value={{
    usuario,
    cargando,
    errorSesion,
    ingresar,
    salir,
    restaurar,
    admin: ['admin', 'mantenimiento'].includes(usuario?.rol)
  }}>{children}</AuthContext.Provider>;
}
