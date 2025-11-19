'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetalleFactura extends Model {
    static associate(models) {
      DetalleFactura.belongsTo(models.Factura, {
        foreignKey: 'id_factura',
        as: 'factura'
      });
      DetalleFactura.belongsTo(models.Producto, {
        foreignKey: 'id_producto',
        as: 'producto'
      });
    }
  }
  
  DetalleFactura.init({
    id_detalle_factura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_factura: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Rebajas_Otorgadas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DetalleFactura',
    tableName: 'detalle_factura',
    timestamps: false
  });
  
  return DetalleFactura;
};
