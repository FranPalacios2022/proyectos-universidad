import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('ejemplo_sqlite.db');
const clientes = db.prepare(
  'SELECT id, nombre, email, ciudad FROM clientes ORDER BY id'
).all();

console.log(`Total: ${clientes.length} clientes`);
console.table(clientes);
db.close();