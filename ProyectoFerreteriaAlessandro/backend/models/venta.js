'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      Venta.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
      Venta.belongsTo(models.Cliente, {
        foreignKey: 'id_cliente',
        as: 'cliente'
      });
      Venta.belongsTo(models.MetodoPago, {
        foreignKey: 'id_metodo_pago',
        as: 'metodo_pago'
      });
      Venta.hasOne(models.Factura, {
        foreignKey: 'id_venta',
        as: 'factura'
      });
      Venta.hasOne(models.Devolucion, {
        foreignKey: 'id_venta',
        as: 'devolucion'
      });
    }
  }
  
  Venta.init({
    id_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_factura: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'completada'
    }
  }, {
    sequelize,
    modelName: 'Venta',
    tableName: 'ventas',
    timestamps: false
  });
  
  return Venta;
};
