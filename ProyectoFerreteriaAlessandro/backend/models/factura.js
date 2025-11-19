'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Factura extends Model {
    static associate(models) {
      Factura.belongsTo(models.Venta, {
        foreignKey: 'id_venta',
        as: 'venta'
      });
      Factura.belongsTo(models.MetodoPago, {
        foreignKey: 'id_metodo_pago',
        as: 'metodo_pago'
      });
      Factura.hasMany(models.DetalleFactura, {
        foreignKey: 'id_factura',
        as: 'detalles'
      });
    }
  }
  
  Factura.init({
    id_factura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    No_Reg_Exonerados: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Orden_Compra_Exenta: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Condiciones_Pago: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OrdenEstado: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    RTN: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    REG_SGA: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Factura',
    tableName: 'factura',
    timestamps: false
  });
  
  return Factura;
};
