import { DataTypes, Model } from 'sequelize';
import sequelize from '../db.js';

class PedidoDetalle extends Model {}

PedidoDetalle.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedidoId: { type: DataTypes.INTEGER, allowNull: false, field: 'pedido_id' },
  productoId: { type: DataTypes.INTEGER, allowNull: false, field: 'producto_id' },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: { args: [1], msg: 'La cantidad mínima es 1' } }
  },
  precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'precio_unitario' }
}, { sequelize, modelName: 'PedidoDetalle', tableName: 'pedido_detalle', timestamps: false });

export default PedidoDetalle;
