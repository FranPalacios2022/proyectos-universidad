// ════════════════════════════════════════════════════════════
// database.js — instancia de Sequelize apuntando a SQLite.
// SQLite guarda TODO en un solo archivo (database.sqlite), que
// Sequelize crea automáticamente la primera vez. No hay servidor
// de base de datos que instalar: es ideal para clase.
// ════════════════════════════════════════════════════════════
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false, // poné true si querés ver el SQL que genera el ORM
});

module.exports = sequelize;
