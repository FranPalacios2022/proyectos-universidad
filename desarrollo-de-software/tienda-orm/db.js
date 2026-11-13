// db.js · conexión única a la base SQLite
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'node:url';

// Ruta absoluta al archivo: funciona sin importar desde qué carpeta ejecutes node
const archivo = fileURLToPath(new URL('./datos/tienda.sqlite', import.meta.url));

const mostrarSQL = (sql) => console.log(`\x1b[2m   🔎 ${sql.replace(/^Executing \(.*?\): /, '')}\x1b[0m`);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: archivo,
  logging: mostrarSQL
});

// Permite apagar o encender el log de SQL desde cualquier archivo
export function logSQL(activo) {
  sequelize.options.logging = activo ? mostrarSQL : false;
}

export default sequelize;
