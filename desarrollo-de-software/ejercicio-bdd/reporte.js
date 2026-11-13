import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('ejemplo_sqlite.db');
const sql = `
  SELECT
    c.nombre,
    COUNT(p.id) AS cantidad_pedidos,
    COALESCE(SUM(p.total), 0) AS total_facturado,
    MAX(p.fecha) AS ultimo_pedido
  FROM clientes c
  LEFT JOIN pedidos p ON p.cliente_id = c.id
  GROUP BY c.id, c.nombre
  ORDER BY total_facturado DESC
  LIMIT 3
`;

console.table(db.prepare(sql).all());
db.close();