// modelos/index.js · todos los modelos y sus relaciones en un solo lugar
import Cliente from './Cliente.js';
import Producto from './Producto.js';
import Pedido from './Pedido.js';
import PedidoDetalle from './PedidoDetalle.js';

Cliente.hasMany(Pedido,   { foreignKey: 'clienteId', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

Pedido.hasMany(PedidoDetalle,   { foreignKey: 'pedidoId', as: 'detalles' });
PedidoDetalle.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

Producto.hasMany(PedidoDetalle,   { foreignKey: 'productoId', as: 'detalles' });
PedidoDetalle.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

export { Cliente, Producto, Pedido, PedidoDetalle };
