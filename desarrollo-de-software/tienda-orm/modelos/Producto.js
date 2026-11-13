import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js';

class Producto extends Model {}

Producto.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: { args: [0], msg: 'El precio no puede ser negativo' } }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: { args: [0], msg: 'El stock no puede ser negativo' } }
  }
}, { sequelize, modelName: 'Producto', tableName: 'productos', timestamps: false });

export default Producto;
