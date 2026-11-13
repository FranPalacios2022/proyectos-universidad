// scripts/inicializar-bd.js · npm run init-db
import sequelize from '../db.js';
import { reiniciarBase } from './datos-iniciales.js';

try {
  await reiniciarBase();
  console.log('✅ Base inicializada en datos/tienda.sqlite');
  console.log('   5 clientes · 8 productos · 3 pedidos · 5 detalles');
} catch (error) {
  console.error('❌ No se pudo inicializar la base:', error.message);
} finally {
  await sequelize.close();
}
