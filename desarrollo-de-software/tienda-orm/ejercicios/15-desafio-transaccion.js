// Ejercicio 15 · Desafío: registrar un pedido completo
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  // DESAFÍO: completá registrarPedido(clienteId, items)
  //   · items es un array de { productoId, cantidad }
  //   · Todo dentro de sequelize.transaction(async (t) => { ... })
  //   · Si el cliente o un producto no existe, o no hay stock suficiente: throw new Error(...)
  //   · Por cada ítem: crear el detalle con el precio del momento y descontar stock
  //   · Al final, guardar el total del pedido
  //   · Después del commit, devolver el pedido con cliente y detalles (con producto)
  //   · ¡Cada operación dentro de la transacción recibe { transaction: t }!

  async function registrarPedido(clienteId, items) {
    // tu código acá
  }

  titulo('a) Pedido válido: Julián compra 1 notebook y 2 webcams');
  const ok = await registrarPedido(4, [
    { productoId: 1, cantidad: 1 },
    { productoId: 6, cantidad: 2 }
  ]);
  console.log(`Pedido #${ok.id} de ${ok.cliente.nombre} por ${pesos(ok.total)}`);
  ok.detalles.forEach(d => console.log(`  - ${d.producto.nombre} × ${d.cantidad}`));

  titulo('b) Pedido inválido: 1 mouse y 1 monitor (sin stock)');
  const mouseAntes = (await Producto.findByPk(2)).stock;
  const pedidosAntes = await Pedido.count();
  try {
    await registrarPedido(4, [
      { productoId: 2, cantidad: 1 },
      { productoId: 4, cantidad: 1 }
    ]);
  } catch (error) {
    console.log('❌', error.message);
  }
  const mouseDespues = (await Producto.findByPk(2)).stock;
  const pedidosDespues = await Pedido.count();
  console.log(`Stock del mouse: ${mouseAntes} → ${mouseDespues}`);
  console.log(`Pedidos: ${pedidosAntes} → ${pedidosDespues}`);
  // Si tu transacción funciona, ambos valores tienen que quedar iguales.
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
