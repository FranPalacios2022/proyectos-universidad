import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ErrorVisible } from '../components/Compartidos';
import { mensajeError } from '../services/api';
export default function AuthPage({
  registro = false
}) {
  const {
    usuario,
    ingresar,
    errorSesion
  } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm();
  if (usuario) return <Navigate to="/ordenes" replace />;
  async function enviar(datos) {
    setError('');
    try {
      const {
        repetir,
        ...body
      } = datos;
      await ingresar(body, registro);
      navigate('/ordenes');
    } catch (error) {
      setError(mensajeError(error));
    }
  }
  return <div className="auth-shell"><section className="auth-story"><div className="brand"><span className="brand-icon">M</span>Mantener</div><div><p className="eyebrow">MENOS IMPREVISTOS. MÁS CONTROL.</p><h1>Cuidar los activos.<br />Ordenar el trabajo.</h1><p>De la primera incidencia a la resolución.<br />Cada intervención, en un solo lugar.</p></div><small>DDS · Control de mantenimiento · 3K6</small></section><main className="auth-form"><div className="auth-inner"><p className="eyebrow">TU ESPACIO DE TRABAJO</p><h2>{registro ? 'Creá tu cuenta' : 'Bienvenido de nuevo'}</h2><p className="text-secondary">{registro ? 'Registrate para solicitar y seguir intervenciones.' : 'Ingresá para continuar con tus órdenes.'}</p><ErrorVisible mensaje={error || errorSesion} /><form onSubmit={handleSubmit(enviar)} noValidate>
    {registro && <div className="mb-3"><label htmlFor="nombre" className="form-label">Nombre completo</label><input id="nombre" autoComplete="name" className="form-control" {...register('nombre', {
              required: 'Ingresá tu nombre',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres'
              },
              maxLength: 80
            })} /><div className="field-error">{errors.nombre?.message}</div></div>}
    <div className="mb-3"><label htmlFor="email" className="form-label">Email</label><input id="email" type="email" autoComplete="username" className="form-control" {...register('email', {
              required: 'Ingresá tu email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido'
              }
            })} /><div className="field-error">{errors.email?.message}</div></div>
    <div className="mb-3"><label htmlFor="password" className="form-label">Contraseña</label><input id="password" type="password" autoComplete={registro ? 'new-password' : 'current-password'} className="form-control" {...register('password', {
              required: 'Ingresá tu contraseña',
              ...(registro ? {
                minLength: {
                  value: 8,
                  message: 'Mínimo 8 caracteres'
                },
                validate: v => /[A-Za-z]/.test(v) && /\d/.test(v) && new TextEncoder().encode(v).length <= 72 || 'Debe contener letras y números, y no superar 72 bytes'
              } : {})
            })} /><div className="field-error">{errors.password?.message}</div></div>
    {registro && <div className="mb-3"><label htmlFor="repetir" className="form-label">Repetir contraseña</label><input id="repetir" type="password" autoComplete="new-password" className="form-control" {...register('repetir', {
              validate: v => v === watch('password') || 'Las contraseñas no coinciden'
            })} /><div className="field-error">{errors.repetir?.message}</div></div>}
    <button className="btn btn-primary w-100 mt-2" disabled={isSubmitting}>{isSubmitting ? 'Procesando…' : registro ? 'Crear cuenta →' : 'Ingresar →'}</button></form><p className="mt-4 text-secondary">{registro ? '¿Ya tenés cuenta?' : '¿Primera vez acá?'} <Link to={registro ? '/login' : '/registro'}>{registro ? 'Iniciar sesión' : 'Registrarme'}</Link></p><div className="auth-note">Tu cuenta de registro tiene permisos de solicitante. Los roles de administración y técnicos se gestionan por separado.</div></div></main></div>;
}
