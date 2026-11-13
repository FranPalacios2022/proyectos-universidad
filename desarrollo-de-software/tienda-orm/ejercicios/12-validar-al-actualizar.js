// Ejercicio 12 · Validaciones al actualizar
import sequelize from '../db.js';
import { Cliente, Producto, Pedido, PedidoDetalle } from '../modelos/index.js';
import { reiniciarBase } from '../scripts/datos-iniciales.js';
import { titulo, pesos } from '../scripts/utiles.js';
import { Op } from 'sequelize';

await reiniciarBase(); // cada ejecución arranca con los datos iniciales

try {
  const sofia = await Cliente.findByPk(3);

  titulo('a) Email con formato inválido');
  // 1. Intentá actualizar el email de Sofía a "sofia" dentro de try/catch
  //    y mostrá error.name y el mensaje.
  // 2. Después del catch mostrá sofia.email: ¿qué valor tiene el objeto en memoria?

  titulo('b) Email que ya usa otro cliente');
  // 3. Intentá actualizarlo a "ana@mail.com". ¿Qué tipo de error aparece?
  //    ¿Se llegó a ejecutar SQL? Mirá el log.

  titulo('c) ¿Qué hay realmente en la base?');
  // 4. Recargá el objeto desde la base con reload() y mostrá el email
} catch (error) {
  console.error('❌', error.name, '→', error.message);
} finally {
  await sequelize.close();
}
