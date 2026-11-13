// ════════════════════════════════════════════════════════════
// server.js — punto de entrada del backend. DADO y COMPLETO.
// 1) configura Express (CORS + JSON)
// 2) monta las rutas en /api
// 3) sincroniza Sequelize con SQLite (crea las tablas) y arranca
// ════════════════════════════════════════════════════════════
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());          // habilita CORS (front y back en puertos distintos)
app.use(express.json());  // parsea el body JSON de las peticiones

app.use('/api', userRoutes);

// sync() crea las tablas a partir de los modelos si no existen.
sequelize
  .sync()
  .then(() => {
    console.log('SQLite conectada y sincronizada.');
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
