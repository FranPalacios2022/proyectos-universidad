// ════════════════════════════════════════════════════════════
// users.js — rutas de la API. Se montan bajo /api (ver server.js).
//   GET  /api/countries → lista para poblar el <select> (axios.get)
//   GET  /api/users     → lista de registros (para verificar que guardó)
//   POST /api/users     → crea un usuario en SQLite (axios.post)
// Sin interceptors, sin JWT: peticiones HTTP planas.
// ════════════════════════════════════════════════════════════
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const COUNTRIES = [
  'Argentina', 'Brasil', 'Chile', 'Uruguay', 'Paraguay',
  'Bolivia', 'Perú', 'Colombia', 'México', 'España',
];

// GET /api/countries
router.get('/countries', (req, res) => {
  res.json(COUNTRIES);
});

// GET /api/users
router.get('/users', async (req, res) => {
  const users = await User.findAll({ order: [['createdAt', 'DESC']] });
  res.json(users);
});

// POST /api/users
router.post('/users', async (req, res) => {
  try {
    // Tomamos SOLO los campos que persistimos (la contraseña se ignora a propósito).
    const { fullName, email, age, country, bio } = req.body;

    const user = await User.create({ fullName, email, age, country, bio });

    console.log('Usuario registrado:', user.toJSON());
    res.status(201).json({
      message: '¡Usuario registrado exitosamente!',
      data: user,
    });
  } catch (error) {
    // Email duplicado → 400 (el front lo verá en error.response)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ese email ya está registrado.' });
    }
    // Validación de Sequelize fallida → 400
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.errors.map((e) => e.message).join(' '),
      });
    }
    // Cualquier otra cosa → 500
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
