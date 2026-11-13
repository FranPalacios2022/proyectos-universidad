// Ejercicio 13 · Actualizar muchas filas
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('a) Todos los clientes de Rosario pasan a Córdoba');
  // 1. Con Cliente.update(valores, { where }) cambiá la ciudad de TODOS los de Rosario.
  //    update devuelve un array: el primer elemento es la cantidad de filas modificadas.
  const [afectados] = ___;
  console.log(`Filas modificadas: ${afectados}`);
  // 2. Contá cuántos clientes quedaron en Córdoba

  titulo('b) Reponer 10 unidades de los productos con menos de 5');
  // 3. Usá Producto.increment({ stock: 10 }, { where }) y mostrá los productos 4 y 8

  titulo('c) Una actualización masiva también se valida');
  // 4. Intentá poner ciudad "Salta" al cliente 1 con Cliente.update y capturá el error
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
