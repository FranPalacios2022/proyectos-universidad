# Formulario de registro — React Hook Form + Axios

Ejercitación de la cátedra **Desarrollo de Software** (UTN FRC, 2026). La consigna completa está en [`ejercitacion.md`](ejercitacion.md).

Formulario de registro de usuario validado con **React Hook Form**, que trae la lista de países con `axios.get` y envía el alta con `axios.post` a una API **Express + Sequelize + SQLite**.

## Mi parte

El backend lo provee la cátedra. Yo desarrollé el frontend, en [`frontend/src/components/RegistroForm.jsx`](frontend/src/components/RegistroForm.jsx):

- Validaciones con `required`, `minLength` / `maxLength`, `pattern` (email y contraseña), `min` / `max` (edad) y `validate` para repetir la contraseña.
- Carga de países con `axios.get` dentro de `useEffect`.
- Envío con `axios.post`, manejo de los tres casos de error de Axios (respuesta del servidor, sin respuesta y error de configuración) y `reset` del formulario.

## Cómo correrlo

El backend tiene que estar corriendo antes de enviar el formulario.

```bash
# Terminal 1 — backend (http://localhost:3001)
cd backend
npm install
npm start

# Terminal 2 — frontend (http://localhost:5176)
cd frontend
npm install
npm run dev
```

**Tecnologías:** React, Vite, React Hook Form, Axios, Bootstrap, Express, Sequelize, SQLite.
