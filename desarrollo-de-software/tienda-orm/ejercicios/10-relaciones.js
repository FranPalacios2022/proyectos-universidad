// Ejercicio 10 · Buscar con relaciones (include)
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('a) Un pedido con su cliente y sus productos');
  // 1. Traé el pedido 1 incluyendo su cliente y sus detalles,
  //    y dentro de cada detalle, su producto. Usá los alias de modelos/index.js.
  const pedido = await Pedido.findByPk(1, {
    include: [
      // ...
    ]
  });
  console.log(`Pedido #${pedido.id} · ${pedido.cliente.nombre} · ${pedido.fecha} · ${pesos(pedido.total)}`);
  for (const d of pedido.detalles) {
    console.log(`  - ${d.producto.nombre} × ${d.cantidad} a ${pesos(d.precioUnitario)}`);
  }

  titulo('b) Una clienta con todos sus pedidos');
  // 2. Buscá a ana@mail.com incluyendo sus pedidos y listalos
  const ana = ___;

  titulo('c) Productos que se vendieron al menos una vez');
  // 3. Pista: incluí los detalles con required: true (INNER JOIN)
  const vendidos = ___;
  console.log(vendidos.map(p => p.nombre).join(', '));
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
