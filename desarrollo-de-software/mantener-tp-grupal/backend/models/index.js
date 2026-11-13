import { DataTypes } from 'sequelize';
export const ESTADOS = ['abierta', 'asignada', 'en_proceso', 'resuelta', 'cancelada'];
export const PRIORIDADES = ['baja', 'media', 'alta', 'urgente'];
export const ROLES = ['solicitante', 'tecnico', 'mantenimiento', 'admin'];
export function definirModelos(db) {
  const Usuario = db.define('Usuario', {
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ROLES]
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });
  const Activo = db.define('Activo', {
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['operativo', 'con_falla', 'en_mantenimiento', 'baja']]
      }
    },
    criticidad: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['baja', 'media', 'alta']]
      }
    }
  }, {
    tableName: 'activos',
    timestamps: false
  });
  const Orden = db.define('Orden', {
    titulo: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    prioridad: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [PRIORIDADES]
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ESTADOS]
      }
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fechaResolucion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ordenes',
    timestamps: false
  });
  const HistorialOrden = db.define('HistorialOrden', {
    accion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    valorAnterior: {
      type: DataTypes.JSON,
      allowNull: true
    },
    valorNuevo: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'historial_ordenes',
    timestamps: false
  });
  Orden.belongsTo(Activo, {
    as: 'activo',
    foreignKey: {
      name: 'activoId',
      allowNull: false
    },
    onDelete: 'RESTRICT'
  });
  Activo.hasMany(Orden, {
    as: 'ordenes',
    foreignKey: 'activoId'
  });
  Orden.belongsTo(Usuario, {
    as: 'solicitante',
    foreignKey: {
      name: 'solicitanteId',
      allowNull: false
    },
    onDelete: 'RESTRICT'
  });
  Orden.belongsTo(Usuario, {
    as: 'tecnico',
    foreignKey: {
      name: 'tecnicoId',
      allowNull: true
    },
    onDelete: 'RESTRICT'
  });
  HistorialOrden.belongsTo(Orden, {
    foreignKey: {
      name: 'ordenId',
      allowNull: false
    },
    onDelete: 'RESTRICT'
  });
  Orden.hasMany(HistorialOrden, {
    as: 'historial',
    foreignKey: 'ordenId'
  });
  HistorialOrden.belongsTo(Usuario, {
    as: 'usuario',
    foreignKey: {
      name: 'usuarioId',
      allowNull: false
    },
    onDelete: 'RESTRICT'
  });
  return {
    Usuario,
    Activo,
    Orden,
    HistorialOrden
  };
}
