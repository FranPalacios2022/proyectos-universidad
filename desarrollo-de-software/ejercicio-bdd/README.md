# Ejercicio de bases de datos — SQLite desde Node.js

Práctica de **Desarrollo de Software** (UTN FRC, 2026): consultas SQL sobre una base SQLite de ejemplo (`ejemplo_sqlite.db`) usando el módulo nativo `node:sqlite` y sentencias preparadas.

| Script | Qué hace |
| --- | --- |
| `npm run clientes` | Lista todos los clientes. |
| `npm run productos` | Productos con stock, ordenados por precio. |
| `npm run buscar` | Clientes de una ciudad, con parámetro. |
| `npm run pedidos` | Pedidos con el nombre del cliente (`INNER JOIN`). |
| `npm run reporte` | Resumen por cliente (`LEFT JOIN` + `GROUP BY`). |
| `node insertar.js` | Inserta productos con una sentencia preparada. |

Requiere Node.js 22.5 o superior (por `node:sqlite`).

**Tecnologías:** Node.js, SQL, SQLite.
