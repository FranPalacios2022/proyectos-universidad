import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js';

class Cliente extends Model {}

Cliente.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'El nombre es obligatorio' } }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: { msg: 'Email inválido' } }
  },
  ciudad: {
    type: DataTypes.STRING,
    validate: {
      isIn: { args: [['Córdoba', 'Rosario', 'Mendoza']], msg: 'Ciudad no habilitada' }
    }
  }
}, { sequelize, modelName: 'Cliente', tableName: 'clientes', timestamps: false });

export default Cliente;
