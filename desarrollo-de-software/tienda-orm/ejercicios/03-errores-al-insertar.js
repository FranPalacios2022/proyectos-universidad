// Ejercicio 3 · Provocar errores al insertar
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  // Cada intento tiene que FALLAR. Completá los datos para provocar el error indicado.
  const intentos = [
    { caso: 'a) email inválido',  datos: { nombre: 'Pedro', email: ___, ciudad: 'Córdoba' } },
    { caso: 'b) email repetido',  datos: { nombre: 'Otra Ana', email: ___, ciudad: 'Córdoba' } },
    { caso: 'c) ciudad inválida', datos: { nombre: 'Lía', email: 'lia@mail.com', ciudad: ___ } },
    { caso: 'd) nombre vacío',    datos: { nombre: ___, email: 'vacio@mail.com' } }
  ];

  for (const { caso, datos } of intentos) {
    titulo(caso);
    try {
      await Cliente.create(datos);
      console.log('⚠ Se creó (no debería)');
    } catch (error) {
      // Mostrá el tipo de error y el mensaje del primer error de la lista
      console.log(`${error.___} → ${error.errors[0].___}`);
    }
  }

  titulo('e) Verificar');
  // ¿Cuántos clientes debería haber? Pensalo antes de ejecutar.
  console.log('Clientes en la base:', await Cliente.count());
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
