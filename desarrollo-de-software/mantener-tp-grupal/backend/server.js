import 'dotenv/config';
import { crearConexion } from './config/database.js';
import { definirModelos } from './models/index.js';
import { cargarSemilla } from './data/semilla.js';
import { crearApp } from './app.js';
const db = crearConexion();
const models = definirModelos(db);
const app = crearApp({
  db,
  models,
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '2h'
});
await db.sync();
await cargarSemilla(db, models);
const port = Number(process.env.PORT || 3001);
const server = app.listen(port, () => console.log(`API de mantenimiento: http://localhost:${port}`));
async function cerrar() {
  server.close(async () => {
    await db.close();
    process.exit(0);
  });
}
process.on('SIGINT', cerrar);
process.on('SIGTERM', cerrar);
