// Ejercicio 2 · Insertar un cliente
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  titulo('a) Crear a Carla Díaz');
  // 1. Insertá la clienta: Carla Díaz · carla@mail.com · Mendoza
  const carla = await Cliente.___({
    nombre: ___,
    email: ___,
    ciudad: ___
  });
  // 2. Mostrá el id que generó la base
  console.log(`Creada con id ${carla.___}: ${carla.nombre} (${carla.email})`);

  titulo('b) Crear un cliente sin ciudad');
  // 3. Insertá a Tomás Vera (tomas@mail.com) SIN enviar la ciudad
  const tomas = ___;
  console.log(`Creado con id ${tomas.id}, ciudad: ${tomas.ciudad}`);

  titulo('c) Verificar');
  // 4. Mostrá cuántos clientes hay ahora
  console.log('Clientes en la base:', ___);
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
