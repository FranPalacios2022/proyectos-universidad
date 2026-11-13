import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('ejemplo_sqlite.db');
const productos = db.prepare(
  'SELECT * FROM productos WHERE stock > 0 ORDER BY precio DESC'
).all();

console.table(productos);
db.close();