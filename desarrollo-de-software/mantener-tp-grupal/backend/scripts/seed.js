import 'dotenv/config';
import { crearConexion } from '../config/database.js';
import { definirModelos } from '../models/index.js';
import { cargarSemilla } from '../data/semilla.js';
const db = crearConexion();
try {
  const models = definirModelos(db);
  await db.sync();
  console.log((await cargarSemilla(db, models)) ? 'Semilla creada: 8 activos, 6 usuarios y 15 órdenes.' : 'La base ya tiene usuarios. No se reemplazaron datos.');
} finally {
  await db.close();
}
