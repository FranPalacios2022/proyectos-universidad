import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('ejemplo_sqlite.db');
const insert = db.prepare(
  'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)'
);

const info = insert.run('Parlante Bluetooth', 68.0, 25);
console.log('Insertado con id:', info.lastInsertRowid);
console.log('Filas afectadas:', info.changes);
db.close();