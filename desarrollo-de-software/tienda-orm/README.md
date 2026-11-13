# Tienda ORM · Ejercitación con Sequelize

DDS · UTN FRC · Desarrollo de Software

## Puesta en marcha

```bash
npm install
npm run init-db
node ejercicios/01-contar.js
```

- `npm run init-db` crea `datos/tienda.sqlite` con 5 clientes, 8 productos y 3 pedidos.
- Cada ejercicio vuelve a cargar esos datos al empezar, así los resultados coinciden con la guía.
- Las líneas grises que empiezan con 🔎 son el SQL que ejecuta Sequelize. ¡Leelas!

## Estructura

```
db.js                     conexión a SQLite
modelos/                  Cliente, Producto, Pedido, PedidoDetalle + relaciones (index.js)
scripts/datos-iniciales.js  reiniciarBase(): recrea tablas y datos
scripts/inicializar-bd.js   npm run init-db
scripts/utiles.js           titulo() y pesos() para mostrar resultados
ejercicios/               15 archivos para completar (reemplazá los ___)
```

## Ejercicios

| # | Tema |
|---|------|
| 01 | Conectar y contar |
| 02–05 | Insertar: create, errores, bulkCreate, pedido con detalles |
| 06–10 | Buscar: findByPk, filtros con Op, orden y páginas, agregaciones, include |
| 11–14 | Actualizar: save, update, validaciones, update masivo, stock |
| 15 | Desafío: registrar un pedido con transacción |

Para ver la base, abrí `datos/tienda.sqlite` con DB Browser for SQLite (sqlitebrowser.org).
