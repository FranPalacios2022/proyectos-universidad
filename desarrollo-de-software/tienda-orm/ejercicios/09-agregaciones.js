// Ejercicio 9 · Agregaciones
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('Resumen del catálogo');
  // Resolvé cada dato con UNA consulta de agregación (sin findAll).
  const sinStock = ___;   // cantidad de productos con stock 0
  const unidades = ___;   // suma de todos los stocks
  const masCaro = ___;    // precio máximo
  const promedio = ___;   // precio promedio → Producto.aggregate(campo, 'avg')

  console.log(`Productos sin stock: ${sinStock}`);
  console.log(`Unidades en depósito: ${unidades}`);
  console.log(`Precio más alto: ${pesos(masCaro)}`);
  console.log(`Precio promedio: ${pesos(promedio)}`);

  titulo('Ventas');
  const facturado = ___;       // suma de los totales de todos los pedidos
  const pedidosDeAna = ___;    // pedidos del cliente 1
  console.log(`Total facturado: ${pesos(facturado)}`);
  console.log(`Pedidos de Ana: ${pedidosDeAna}`);
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
