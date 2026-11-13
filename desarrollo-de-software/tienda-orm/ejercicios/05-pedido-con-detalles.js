// Ejercicio 5 · Insertar un pedido con sus detalles
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  // Sofía (cliente 3) compra 1 Webcam (producto 6) y 1 Mouse (producto 2).

  titulo('a) Buscar los productos a comprar');
  // 1. Traé ambos productos por su clave primaria
  const webcam = ___;
  const mouse = ___;

  // 2. Calculá el total. Ojo: convertí el precio con Number()
  const total = ___;

  titulo('b) Crear el pedido y sus renglones en una sola llamada');
  // 3. Creá el pedido con un array "detalles". Cada renglón guarda
  //    productoId, cantidad y precioUnitario (el precio del momento).
  const pedido = await Pedido.create({
    clienteId: ___,
    total,
    detalles: [
      // dos renglones
    ]
  }, { include: [{ association: ___ }] });   // el alias definido en modelos/index.js

  console.log(`Pedido #${pedido.id} · cliente ${pedido.clienteId} · total ${pesos(pedido.total)}`);
  console.log(`Renglones creados: ${pedido.detalles.length}`);

  titulo('c) Verificar');
  // 4. Contá pedidos y detalles
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
