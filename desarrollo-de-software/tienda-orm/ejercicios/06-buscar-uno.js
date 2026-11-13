// Ejercicio 6 · Buscar un registro
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('a) Por clave primaria');
  // 1. Traé el producto 4 y mostrá nombre, precio y stock
  const monitor = ___;

  titulo('b) Un id que no existe');
  // 2. Buscá el producto 99. ¿Qué devuelve? Mostrá un mensaje si no existe.
  const fantasma = ___;

  titulo('c) Por email');
  // 3. Buscá al cliente con email luis@mail.com usando findOne y where
  const luis = await Cliente.findOne({ ___ });
  console.log(`${luis.nombre} vive en ${luis.ciudad}`);
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
