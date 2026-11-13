// Ejercicio 1 · Conectar y contar
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  // Reemplazá cada ___ y ejecutá:  node ejercicios/01-contar.js

  // 1. Probá la conexión
  await sequelize.___();
  console.log('✅ Conectado a la base');

  titulo('Cantidad de filas por tabla');
  // 2. Contá las filas de cada tabla con el método de agregación adecuado
  const clientes = await Cliente.___();
  const productos = await Producto.___();
  const pedidos = await ___.___();
  console.log(`Clientes: ${clientes} · Productos: ${productos} · Pedidos: ${pedidos}`);
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
