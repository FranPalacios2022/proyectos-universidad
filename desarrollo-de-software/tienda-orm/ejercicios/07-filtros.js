// Ejercicio 7 · Buscar con filtros
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  const nombres = (lista) => lista.map(x => x.nombre).join(', ');

  titulo('a) Productos de más de $50.000');
  const caros = await Producto.findAll({ where: { precio: { [Op.___]: 50000 } } });
  console.log(`${caros.length} → ${nombres(caros)}`);

  titulo('b) Productos con stock entre 5 y 20');
  const medios = await Producto.findAll({ where: { stock: { [Op.___]: ___ } } });
  console.log(`${medios.length} → ${nombres(medios)}`);

  titulo('c) Productos cuyo nombre contiene "o"');
  const conO = await Producto.findAll({ where: { nombre: { [Op.___]: ___ } } });
  console.log(`${conO.length} → ${nombres(conO)}`);

  titulo('d) Clientes de Córdoba o de Mendoza');
  // Usá Op.or con un array de dos condiciones
  const clientes = ___;
  console.log(`${clientes.length} → ${nombres(clientes)}`);

  titulo('e) Productos con stock y de menos de $40.000');
  // Dos condiciones a la vez (AND). No hace falta Op.and.
  const baratos = ___;
  console.log(`${baratos.length} → ${nombres(baratos)}`);
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
