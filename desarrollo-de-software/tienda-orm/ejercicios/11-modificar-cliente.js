// Ejercicio 11 · Actualizar un registro
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('a) Luis se muda a Mendoza (save)');
  // 1. Traé al cliente 2, mostrá su ciudad, cambiala a Mendoza y guardá
  const luis = ___;

  // 2. Volvé a leerlo DESDE LA BASE y mostrá la ciudad
  const releido = ___;

  titulo('b) Cambiar dos campos a la vez (update)');
  // 3. Con releido.update(...) cambiá nombre a "Luis A. Martínez"
  //    y email a "lmartinez@mail.com". Después mostrá los tres campos.
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
