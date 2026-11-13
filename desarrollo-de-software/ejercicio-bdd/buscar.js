import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('ejemplo_sqlite.db');
const ciudad = process.argv[2] ?? 'Cordoba';
const resultados = db.prepare(
  'SELECT * FROM clientes WHERE ciudad = ? ORDER BY nombre'
).all(ciudad);

console.log(`Clientes en ${ciudad}:`);
console.table(resultados);
db.close();