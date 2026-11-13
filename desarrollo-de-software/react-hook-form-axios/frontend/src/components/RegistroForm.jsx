// ════════════════════════════════════════════════════════════
// RegistroForm — formulario de registro de usuario
// Temas: useForm · validadores · axios.get/post · manejo de errores · UX
// ════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export default function RegistroForm() {
  const [paises, setPaises] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch('password');

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/countries`);
        setPaises(response.data);
      } catch (error) {
        console.error('No se pudieron cargar los países:', error);
        alert('No se pudieron cargar los países. Verificá que el backend esté funcionando.');
      }
    };

    cargarPaises();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/users`, data);
      alert(`✅ ${response.data.message}`);
      reset();
    } catch (error) {
      console.error('No se pudo registrar el usuario:', error);
      if (error.response) {
        alert(error.response.data.message || 'El servidor rechazó el registro.');
      } else if (error.request) {
        alert('No se recibió respuesta del servidor. Verificá que el backend esté funcionando.');
      } else {
        alert(`Error al enviar el registro: ${error.message}`);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="card card-body shadow-sm"
    >
      <div className="mb-3">
        <label htmlFor="fullName" className="form-label">Nombre completo</label>
        <input
          id="fullName"
          type="text"
          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
          placeholder="Ada Lovelace"
          {...register('fullName', {
            required: 'El nombre es obligatorio.',
            minLength: { value: 3, message: 'Mínimo 3 caracteres.' },
            maxLength: { value: 60, message: 'Máximo 60 caracteres.' },
          })}
        />
        {errors.fullName && (
          <div className="invalid-feedback">{errors.fullName.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="ada@example.com"
          {...register('email', {
            required: 'El email es obligatorio.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email inválido.',
            },
          })}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Contraseña</label>
        <input
          id="password"
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          {...register('password', {
            required: 'La contraseña es obligatoria.',
            minLength: { value: 8, message: 'Mínimo 8 caracteres.' },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
              message: 'Debe tener letras y números.',
            },
          })}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Repetir contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          {...register('confirmPassword', {
            required: 'Repetir la contraseña es obligatorio.',
            validate: (value) => value === password || 'Las contraseñas no coinciden.',
          })}
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="age" className="form-label">Edad</label>
        <input
          id="age"
          type="number"
          className={`form-control ${errors.age ? 'is-invalid' : ''}`}
          {...register('age', {
            valueAsNumber: true,
            required: 'La edad es obligatoria.',
            min: { value: 18, message: 'Debés tener al menos 18 años.' },
            max: { value: 120, message: 'La edad máxima es 120 años.' },
          })}
        />
        {errors.age && (
          <div className="invalid-feedback">{errors.age.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="country" className="form-label">País</label>
        <select
          id="country"
          className={`form-select ${errors.country ? 'is-invalid' : ''}`}
          {...register('country', { required: 'Elegí un país.' })}
        >
          <option value="">Seleccioná...</option>
          {paises.map((pais) => (
            <option key={pais} value={pais}>{pais}</option>
          ))}
        </select>
        {errors.country && (
          <div className="invalid-feedback">{errors.country.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="bio" className="form-label">Bio (opcional)</label>
        <textarea
          id="bio"
          className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
          rows="3"
          {...register('bio', {
            maxLength: { value: 200, message: 'Máximo 200 caracteres.' },
          })}
        />
        {errors.bio && (
          <div className="invalid-feedback">{errors.bio.message}</div>
        )}
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            id="acceptTerms"
            type="checkbox"
            className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
            {...register('acceptTerms', {
              required: 'Debés aceptar los términos.',
            })}
          />
          <label htmlFor="acceptTerms" className="form-check-label">
            Acepto los términos y condiciones
          </label>
          {errors.acceptTerms && (
            <div className="invalid-feedback">{errors.acceptTerms.message}</div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Registrarme'}
      </button>
    </form>
  );
}
