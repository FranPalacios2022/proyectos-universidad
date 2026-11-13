import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('ejemplo_sqlite.db');
const sql = `
  SELECT p.id, c.nombre AS cliente, p.fecha, p.total
  FROM pedidos p
  INNER JOIN clientes c ON p.cliente_id = c.id
  ORDER BY p.fecha DESC
`;

console.table(db.prepare(sql).all());
db.close();