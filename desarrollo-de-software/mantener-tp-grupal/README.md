# Mantener · Control de mantenimiento

TP previo al segundo parcial de Desarrollo de Software · 2026 S2 · 3K6.

Aplicación full stack para registrar incidencias sobre activos, asignar técnicos y seguir cada intervención hasta su cierre. Incluye filtros, paginación, historial, resumen administrativo y persistencia real.

## Autenticación

Por indicación de la cátedra no se implementa Keycloak. La autenticación se resuelve con JWT propio (HS256, `jsonwebtoken`) y contraseñas con bcrypt, validado en un middleware del backend (firma, emisor, audiencia, expiración y rol).

## Ejecutar en VS Code

Requisitos: Node.js 20.19+ o 22.12+ (verificado aquí con Node 24), npm y dos terminales. No requiere Docker ni un servidor de base de datos externo.

Abrir **esta carpeta raíz** en VS Code. Desde la terminal integrada:

```powershell
npm run install:all
npm run setup
```

`setup` genera `backend/.env` con un secreto aleatorio. No lo imprime y no reemplaza un archivo existente. Si ya se entregó la carpeta configurada localmente, este comando conserva la configuración. Nunca subir `.env` al repositorio.

En la primera terminal:

```powershell
npm run backend
```

En la segunda:

```powershell
npm run frontend
```

Abrir **http://localhost:3000**. API: **http://localhost:3001/api**. Vite usa `strictPort: true`: si el puerto 3000 está ocupado, hay que cerrar el otro proyecto antes de iniciar este.

También están preparadas tareas de VS Code: **Terminal → Ejecutar tarea → DDS: Backend / DDS: Frontend / DDS: Pruebas**. Los comandos se ejecutan desde la raíz.

La primera ejecución crea SQLite y carga la semilla. Los siguientes arranques conservan las órdenes y los cambios. No se utiliza `sync({ force: true })` sobre la base de uso normal.

### Usuarios de demostración

Todos usan la contraseña de prueba **`Dds2026!`**. Son cuentas ficticias para evaluación local; no son credenciales personales ni de producción. La BD almacena hashes bcrypt, no esa contraseña en texto.

| Email | Rol |
|---|---|
| admin@dds.com | admin |
| ana@dds.com | tecnico |
| bruno@dds.com | tecnico |
| carla@dds.com | tecnico |
| solicitante@dds.com | solicitante |
| diego@dds.com | solicitante |

El registro público crea exclusivamente solicitantes. El body no puede elegir `rol`, `activo` ni `passwordHash`. No hay un módulo de administración de usuarios, porque no forma parte de los módulos mínimos pedidos.

## Estructura y relación con lo visto en clase

```text
backend/
  app.js                 Configura middleware y rutas; no abre puerto
  server.js              Abre la conexión, carga semilla e inicia servidor
  config/database.js     Conexión SQLite
  models/index.js        Cuatro entidades y asociaciones Sequelize
  routes/                Express Router
  controllers/           Traducción de HTTP a llamadas al servicio
  services/              Reglas de negocio y autenticación
  middlewares/           JWT, roles, validación y errores
  data/semilla.js         8 activos, 6 usuarios y 15 órdenes
  scripts/seed.js         Semilla sin borrar datos existentes
  tests/api.test.js       Jest + Supertest; base aislada en memoria
frontend/src/
  context/AuthContext.jsx Sesión, usuario y rol
  services/               Instancia Axios y servicios por recurso
  components/             Filtros, tabla, formulario, acciones e historial
  pages/                  Pantallas de la aplicación
  App.jsx                 React Router y rutas protegidas
  styles.css              Presentación responsive sobre Bootstrap
docs/
  GUIA_PARA_DEFENDER.md    Recorrido explicado del código
  PRUEBAS_MANUALES.md      Dos flujos y comprobación de persistencia
```

Se siguieron las ideas de `api_articulos_test` (servicios, Jest/Supertest), `demo_seguridad` (bcrypt, JWT, roles, separación en capas), la ejercitación de React Hook Form/Axios y los ejercicios de contexto. No se modifican esos proyectos.

## Modelo y reglas del dominio

- **Usuario:** `id`, `nombre`, `email` único normalizado, `passwordHash`, `rol`, `activo`.
- **Activo:** `id`, `codigo` único, `nombre`, `tipo`, `ubicacion`, `estado`, `criticidad`.
- **Orden:** `id`, `activoId`, `titulo`, `descripcion`, `solicitanteId`, `tecnicoId`, `prioridad`, `estado`, `fechaCreacion`, `fechaResolucion`.
- **HistorialOrden:** `id`, `ordenId`, `usuarioId`, `accion`, `fechaHora`, `valorAnterior`, `valorNuevo`.

Las asociaciones usan claves foráneas. No se borran órdenes: la cancelación conserva su trazabilidad.

### Validación

El servicio verifica que el activo exista y no esté de baja. Acepta únicamente prioridades `baja`, `media`, `alta`, `urgente` y estados definidos. Un activo de criticidad alta no admite prioridad baja. La API de activos devuelve prioridad sugerida `alta` para los críticos y `media` para el resto; el formulario la muestra y propone, pero el backend vuelve a validar.

Título: 3–120 caracteres luego de quitar espacios exteriores. Descripción: 10–2000. Los ids deben ser enteros positivos. No se aceptan campos arbitrarios: evita cambiar `solicitanteId`, `activoId` en edición o fechas desde el cliente.

### Flujo de estados

```text
abierta → asignada → en_proceso → resuelta
   └────────┴──────────┴──────→ cancelada
```

- Asignar exige un usuario activo de rol técnico; abierta pasa automáticamente a asignada.
- La reasignación está permitida solo mientras no haya empezado el trabajo.
- Para resolver se requiere técnico y estado `en_proceso`.
- No se puede saltar de abierta/asignada a resuelta.
- Resuelta y cancelada son terminales: no admiten edición ni reapertura.
- El administrador no puede cancelar una resuelta: se prioriza la regla explícita del flujo «cualquier orden no resuelta → cancelada» sobre la frase general «cancelar cualquier orden».
- Resolver registra `fechaResolucion`; cancelar no es resolver y no completa esa fecha.
- El solicitante puede editar título y descripción propios mientras la orden siga abierta. La prioridad posterior al alta es administrativa.

### Impacto en el activo

Después de cada operación se consideran **todas** las órdenes pendientes del activo:

1. Si hay al menos una asignada o en proceso: `en_mantenimiento`.
2. Si solo quedan abiertas: `con_falla`.
3. Si no queda ninguna pendiente: `operativo`.
4. Un activo dado de baja no se reactiva automáticamente.

Así, resolver una de varias fallas no marca el activo como operativo por error. Cancelar también recalcula el estado. Se interpreta que una orden cancelada deja de representar una intervención pendiente.

La orden, su auditoría y el estado del activo cambian dentro de **una transacción**: si un paso falla, se revierte todo. Una cola de escrituras serializa las operaciones de este proceso para SQLite. Está pensado para una instancia de backend, no para varios procesos escribiendo a la misma base.

### Historial y resumen

El historial registra creación, edición, asignación, prioridad, estado, resolución y cancelación. Cada tipo de cambio conserva usuario, fecha y valores relevantes; una edición que cambia varios tipos puede generar varios registros dentro de la misma transacción.

El resumen cuenta todas las órdenes por estado. «Urgentes» y «sin técnico» cuentan únicamente pendientes; «activos con más fallas» cuenta órdenes históricas no canceladas y muestra los cinco primeros. Las etiquetas de pantalla explican ese criterio.

## Permisos y JWT

| Operación | Solicitante | Técnico | Admin / mantenimiento |
|---|---|---|---|
| Listar y ver detalle/historial | Propias | Asignadas | Todas |
| Crear | Sí | No | Sí |
| Editar título/descripción | Propias abiertas | No | No cerradas |
| Cambiar prioridad / asignar | No | No | Sí, respetando estado |
| Iniciar/resolver | No | Sus asignadas | Sí, respetando flujo |
| Cancelar | Propias abiertas | No | No cerradas |
| Resumen administrativo | No | No | Sí |

El backend firma un JWT HS256 con `sub`, `rol`, `iss`, `aud`, `iat` y `exp`. No incluye contraseña ni hash. El middleware verifica algoritmo, firma, emisor, audiencia y expiración; después consulta al usuario en la BD para comprobar que esté activo y usar **su rol actual**, no confiar en un rol viejo del token.

- **401:** falta JWT, token inválido/vencido, usuario bloqueado o credenciales incorrectas.
- **403:** hay identidad válida pero falta permiso de rol o propiedad.
- **400:** datos inválidos o transición incorrecta.
- **404:** orden, activo o ruta inexistente.
- **500:** falla inesperada; no expone detalles internos.
- **429:** demasiados intentos de autenticación en una ventana de tiempo.

El listado combina los filtros con la restricción de propiedad usando `AND`, evitando que un técnico cambie `tecnicoId` en la URL para ver órdenes ajenas. Ocultar un botón no es el control de seguridad: el servidor vuelve a comprobar.

El token se guarda en `sessionStorage` para conservar la sesión al recargar en la misma pestaña; el contexto obtiene el perfil real con `/auth/me`. Cerrar sesión lo elimina. Axios añade `Authorization: Bearer ...` y ante 401 invalida la sesión. No se registran tokens ni contraseñas en logs. `sessionStorage` sigue siendo accesible a JavaScript: para producción debe revisarse el modelo de amenazas, HTTPS y la estrategia de sesión. Esta versión no tiene refresh tokens ni revocación individual de JWT al cerrar sesión; bloquear el usuario sí tiene efecto inmediato.

## API

Base: `http://localhost:3001/api`.

| Método | Ruta | Uso |
|---|---|---|
| GET | /health | Salud de la API |
| POST | /auth/register | Registrar solicitante; devuelve token y perfil público |
| POST | /auth/login | Autenticar con email/password |
| GET | /auth/me | Perfil autenticado |
| GET | /activos | Catálogo y prioridad sugerida |
| GET | /tecnicos | Técnicos activos; solo id y nombre |
| GET | /ordenes | Listado filtrado, ordenado, paginado y limitado por propiedad |
| GET | /ordenes/resumen | Resumen administrativo |
| GET | /ordenes/:id | Detalle |
| GET | /ordenes/:id/historial | Auditoría |
| POST | /ordenes | Crear |
| PUT | /ordenes/:id | Editar campos permitidos o iniciar mediante estado=en_proceso |
| PATCH | /ordenes/:id/cancelar | Cancelar |
| PATCH | /ordenes/:id/asignar | Body: { "tecnicoId": 2 } |
| PATCH | /ordenes/:id/resolver | Resolver |

Todas las rutas salvo login, registro y health requieren JWT.

Ejemplo de listado: `/ordenes?activoId=2&estado=asignada&prioridad=media&tecnicoId=3&page=1&limit=10&sortBy=fechaCreacion&order=DESC`.

`page` empieza en 1; `limit` admite 1–100. `sortBy` acepta `id`, `titulo`, `fechaCreacion`, `estado`, `prioridad`; `order` acepta `ASC` o `DESC`. Estado y prioridad se ordenan alfabéticamente, indicado en la interfaz. Se agrega id como desempate. Respuesta: `{ items, total, page, limit, totalPages }`. Una búsqueda vacía es 200 con `items: []`.

La ruta PUT acepta actualizaciones parciales de los campos permitidos, por la ruta mínima pedida en el enunciado. Es una decisión de contrato documentada; una API nueva podría reservar PUT para reemplazo completo y usar PATCH para esas ediciones.

Ejemplo de creación:

```json
{
  "activoId": 1,
  "titulo": "El aire no enfría",
  "descripcion": "Enciende, pero no logra bajar la temperatura del aula.",
  "prioridad": "media"
}
```

El solicitante se toma del token, no del body. Administración puede incluir `tecnicoId` en el alta; se registran creación y asignación.

## Rutas del frontend

- `/login` y `/registro`.
- `/ordenes`: listado con filtros, tamaño de página y ordenamiento.
- `/ordenes/nueva`: alta.
- `/ordenes/:id`: detalle, acciones e historial; usa `useParams`.
- `/ordenes/:id/editar`: edición.
- `/activos`: catálogo y estado operativo.
- `/resumen`: panel administrativo.
- `*`: página no encontrada.

Las rutas se protegen con contexto y componentes de React Router. Los servicios HTTP están separados por recurso. Formularios usan React Hook Form y muestran errores cerca del campo y errores de la API en pantalla. Las operaciones muestran carga, vacío, error o éxito.

## Pruebas y compilación

Desde la raíz:

```powershell
npm test
npm run build
```

Jest/Supertest utilizan una base SQLite **en memoria** que se recrea por test. No modifican `backend/data/mantenimiento.sqlite`. Se cubren login, registro, JWT, roles, propiedad, filtros, detalle, alta, estados, activo de baja, criticidad, asignación, resumen, historial y rollback ante una falla de auditoría. Todos los casos HTTP verifican estado y JSON relevante. Los tests no necesitan tener `server.js` ejecutándose.

`npm run build` genera el frontend de producción.

## División de responsabilidades del grupo

| Área | Integrante y contribución real |
|---|---|
| Autenticación y permisos | Palacios, Francisco - 84044 y Franco, Giovanni - 403979: JWT, middlewares, roles |
| Modelos, dominio e historial | Quevedo Flores, Ximena - 90647: modelos, servicio de órdenes, historial |
| React, formularios y navegación | Cabrera, Luciano Fabian - 81936 y Spaccesi, Agustin - 401789: páginas, componentes, rutas |
| Integración, pruebas y documentación | Cherro López, Valentina - 406713: tests, README, integración |

La estructura permite revisar esas áreas por separado, pero no acredita por sí misma trabajo grupal.

## Alcance y limitaciones conocidas

- Aplicación de evaluación local, no una instalación productiva. Cuentas de demostración conocidas, sin recuperación de contraseña ni refresh tokens.
- Activos se consultan desde la semilla; no hay CRUD de activos ni administración de usuarios en la interfaz. El módulo administrativo requerido es el resumen.
- SQLite y cola de escrituras pensados para un proceso. No hay control optimista de versiones para dos personas editando simultáneamente el mismo campo.
- Fechas se guardan en UTC y se presentan en la zona horaria del navegador.
- Se usa una fuente web opcional; si no hay conexión, se utilizan las fuentes del sistema.

## Entrega

Incluir fuente, `package.json`, ambos `package-lock.json`, tests, README y docs. **No incluir `node_modules`, `dist`, `tmp`, `.env` ni la base SQLite local**; la semilla reproduce los datos. `.gitignore` cubre esos archivos para Git. Si se comprime manualmente, revisar esas exclusiones también.
