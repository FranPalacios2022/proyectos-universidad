// Ejercicio 8 · Ordenar y paginar
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  const tamanio = 3;

  for (const pagina of [1, 2, 3]) {
    titulo(`Página ${pagina} (del más caro al más barato)`);
    // Traé solo nombre y precio, ordenados por precio descendente,
    // de a 3 productos por página.
    const productos = await Producto.findAll({
      attributes: ___,
      order: ___,
      limit: ___,
      offset: ___
    });
    productos.forEach(p => console.log(`  ${p.nombre} · ${pesos(p.precio)}`));
  }
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
