// ════════════════════════════════════════════════════════════
// User — modelo de Sequelize. A partir de esta definición, el ORM
// crea la tabla 'Users' en SQLite (id, createdAt y updatedAt se
// agregan solos).
//
// Las validaciones de acá son la SEGUNDA línea de defensa: el front
// valida primero (mejor UX), pero el back NUNCA confía en el cliente.
// Si algo inválido llega igual, Sequelize lo rechaza y devolvemos 400.
//
// 🔒 Nota: NO guardamos la contraseña. En el formulario sirve para
//    ejercitar el validador "repetir contraseña" (RHF), pero persistir
//    contraseñas en texto plano es inseguro y hashearlas nos llevaría a
//    auth/JWT, que queda fuera de esta ejercitación.
// ════════════════════════════════════════════════════════════
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 60] },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,           // no se repite: dos registros con el mismo email → 400
    validate: { isEmail: true },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 18, max: 120 },
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,        // opcional
    validate: { len: [0, 200] },
  },
});

module.exports = User;
