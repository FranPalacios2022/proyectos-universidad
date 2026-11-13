import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js';

class Pedido extends Model {}

Pedido.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clienteId: { type: DataTypes.INTEGER, allowNull: false, field: 'cliente_id' },
  fecha: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }
}, { sequelize, modelName: 'Pedido', tableName: 'pedidos', timestamps: false });

export default Pedido;
