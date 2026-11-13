// scripts/datos-iniciales.js · recrea las tablas y carga los datos de prueba
import sequelize, { logSQL } from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';

export async function reiniciarBase() {
  logSQL(false);                         // no mostrar el SQL de la carga
  await sequelize.sync({ force: true }); // borra y recrea todas las tablas

  await Cliente.bulkCreate([
    { nombre: 'Ana García',      email: 'ana@mail.com',    ciudad: 'Córdoba' },
    { nombre: 'Luis Martínez',   email: 'luis@mail.com',   ciudad: 'Rosario' },
    { nombre: 'Sofía López',     email: 'sofia@mail.com',  ciudad: 'Córdoba' },
    { nombre: 'Julián Ruiz',     email: 'julian@mail.com', ciudad: 'Mendoza' },
    { nombre: 'Marta Fernández', email: 'marta@mail.com',  ciudad: 'Rosario' }
  ]);

  await Producto.bulkCreate([
    { nombre: 'Notebook',      precio: 950000, stock: 5 },
    { nombre: 'Mouse',         precio: 15000,  stock: 40 },
    { nombre: 'Teclado',       precio: 38000,  stock: 12 },
    { nombre: 'Monitor 24"',   precio: 260000, stock: 0 },
    { nombre: 'Auriculares',   precio: 42000,  stock: 18 },
    { nombre: 'Webcam',        precio: 55000,  stock: 7 },
    { nombre: 'Pendrive 32GB', precio: 9000,   stock: 60 },
    { nombre: 'Silla gamer',   precio: 410000, stock: 3 }
  ]);

  await Pedido.bulkCreate([
    { clienteId: 1, fecha: '2026-08-03', total: 980000 },
    { clienteId: 2, fecha: '2026-08-10', total: 80000 },
    { clienteId: 1, fecha: '2026-08-21', total: 27000 }
  ]);

  await PedidoDetalle.bulkCreate([
    { pedidoId: 1, productoId: 1, cantidad: 1, precioUnitario: 950000 },
    { pedidoId: 1, productoId: 2, cantidad: 2, precioUnitario: 15000 },
    { pedidoId: 2, productoId: 3, cantidad: 1, precioUnitario: 38000 },
    { pedidoId: 2, productoId: 5, cantidad: 1, precioUnitario: 42000 },
    { pedidoId: 3, productoId: 7, cantidad: 3, precioUnitario: 9000 }
  ]);

  logSQL(true);
}
