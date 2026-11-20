# Proyectos universidad

Proyectos y ejercicios de la carrera **Ingeniería en Sistemas de Información** en la Universidad Tecnológica Nacional, Facultad Regional Córdoba (UTN FRC), cursada 2026.

Los repositorios originales están en el GitLab de la facultad; acá están reunidos para que se puedan ver en un solo lugar.

## Desarrollo de Software (2026)

| Proyecto | Qué es | Tecnologías |
| --- | --- | --- |
| [mantener-tp-grupal](desarrollo-de-software/mantener-tp-grupal) | **Proyecto grupal.** App full stack para registrar incidencias sobre activos, asignar técnicos y seguir cada orden hasta su cierre, con historial, permisos por rol y resumen administrativo. Me encargué de la **autenticación y autorización** (JWT, bcrypt, middlewares de roles y propiedad). Los créditos de cada integrante están en su README. | Node.js, Express, Sequelize, SQLite, React, React Router, React Hook Form, Axios, Jest, Supertest |
| [api-articulos](desarrollo-de-software/api-articulos) | API REST de artículos organizada en capas (router, service, modelo), con búsqueda, paginación y consulta de stock bajo. | Express 5, Sequelize, SQLite |
| [tienda-orm](desarrollo-de-software/tienda-orm) | Ejercitación guiada de la cátedra sobre ORM: inserciones, búsquedas con filtros, agregaciones, relaciones y transacciones. | Sequelize, SQLite |
| [react-hook-form-axios](desarrollo-de-software/react-hook-form-axios) | Formulario de registro validado con React Hook Form que consume una API Express con Axios. Hice el frontend; el backend lo provee la cátedra. | React, React Hook Form, Axios, Express |
| [mi-muro-app](desarrollo-de-software/mi-muro-app) | Muro de novedades interactivo: publicaciones, likes, formulario de alta y estado de carga. | React, Vite |
| [desafio-1](desarrollo-de-software/desafio-1) | Procesa 1.000.000 de números pseudoaleatorios con semilla fija y calcula estadísticas en una sola pasada. | JavaScript, Node.js |
| [gestor-tareas](desarrollo-de-software/gestor-tareas) | App de tareas con manipulación del DOM: prioridades, filtros, estadísticas y exportación/importación en JSON. | JavaScript, Bootstrap |
| [ejercicio-bdd](desarrollo-de-software/ejercicio-bdd) | Consultas SQL sobre SQLite desde Node.js: filtros, `JOIN`, `GROUP BY` e inserciones con sentencias preparadas. | Node.js, SQL, SQLite |

## Fundamentos web

| Proyecto | Tecnologías |
| --- | --- |
| [integrador-html-css-bootstrap-js](fundamentos-web/integrador-html-css-bootstrap-js) | HTML, CSS, Bootstrap, JavaScript |
| [ejercicio-js-git](fundamentos-web/ejercicio-js-git) | JavaScript, Git |
| [ejercicio-html](fundamentos-web/ejercicio-html) · [ejercicio-css](fundamentos-web/ejercicio-css) | HTML, CSS |

## Cómo correr un proyecto

Cada carpeta es independiente. En general:

```bash
cd desarrollo-de-software/api-articulos
npm install
npm start
```

Las instrucciones específicas están en el README de cada proyecto.

---

Proyecto propio fuera de la facultad: [inventory-api](https://github.com/FranPalacios2022/inventory-api) — API REST segura con JWT, roles, transacciones e importación CSV.
