// Ejercicio 14 · Descontar stock
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('a) Vender 2 mouse con decrement');
  // 1. Traé el producto 2, descontale 2 unidades con decrement,
  //    recargalo con reload() y mostrá el stock.

  titulo('b) Vender 10 sillas con save (hay 3)');
  // 2. Traé el producto 8, restale 10 al stock y guardá con save() dentro de try/catch.
  //    ¿Quién rechaza la operación: el modelo o la base?

  titulo('c) Lo mismo con decrement');
  // 3. Ahora descontá 10 con Producto.decrement('stock', { by: 10, where: { id: 8 } })
  //    y mostrá el stock que quedó en la base. ¿Qué pasó? ¿Por qué?
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
