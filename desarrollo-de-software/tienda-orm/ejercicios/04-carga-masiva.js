// Ejercicio 4 · Carga masiva con bulkCreate
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('a) Insertar tres productos juntos');
  // 1. Insertá en UNA sola llamada:
  //    Parlante $70.000 stock 10 · Micrófono $85.000 stock 4 · Hub USB $25.000 (sin stock)
  const nuevos = await Producto.___([
    // tus tres objetos acá
  ]);
  // 2. Recorré el array devuelto y mostrá id, nombre, precio y stock
  nuevos.forEach(p => console.log(___));

  titulo('b) Verificar');
  console.log('Productos en la base:', await Producto.count());
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
