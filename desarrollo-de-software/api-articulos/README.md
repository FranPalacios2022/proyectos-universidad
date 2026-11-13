# API de artículos

API REST desarrollada con Express 5, Sequelize y SQLite. Organiza el acceso a los artículos en tres capas: router, service y modelo. Incluye búsqueda por nombre, paginación y consulta de artículos con poco stock.

## Requisitos

Node.js y npm.

## Instalación y ejecución

Desde la carpeta del proyecto:

```sh
npm install
npm run init-db
npm start
```

La API queda disponible en `http://localhost:3000`. Para reiniciar el servidor automáticamente durante el desarrollo, ejecutá `npm run dev`.

`npm run init-db` vuelve a crear la tabla y carga los ocho artículos de `data/articulos.json`; usalo para restablecer los datos iniciales. El archivo SQLite se genera en `datos/articulos.sqlite` y no se versiona.

## Rutas

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api/articulos?nombre=&pagina=1&limite=5` | Busca por nombre y devuelve una página de resultados. |
| GET | `/api/articulos/stock-bajo?minimo=5` | Lista artículos cuyo stock es menor que el mínimo. |
| GET | `/api/articulos/:id` | Obtiene un artículo por su identificador. |
| POST | `/api/articulos` | Crea un artículo con `nombre`, `precio` y `stock`. |
| PUT | `/api/articulos/:id` | Reemplaza esos tres campos de un artículo existente. |
| DELETE | `/api/articulos/:id` | Elimina un artículo. |

Los errores se responden como `{ "mensaje": "..." }`. Los datos de creación y actualización requieren un nombre de 3 a 60 caracteres, un precio numérico no negativo y un stock entero no negativo.

## Organización

```text
data/articulos.json           Datos iniciales
datos/articulos.sqlite        Base generada al inicializar
models/articulos.model.js     Definición de la tabla
services/articulos.service.js Validaciones y reglas del recurso
routers/articulos.router.js   Endpoints HTTP
scripts/inicializar-bd.js     Carga de datos iniciales
db.js                         Configuración de Sequelize
app.js                        Configuración y arranque de Express
```
