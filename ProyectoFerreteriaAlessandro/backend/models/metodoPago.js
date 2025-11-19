'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MetodoPago extends Model {
    static associate(models) {
      MetodoPago.hasMany(models.Venta, {
        foreignKey: 'id_metodo_pago',
        as: 'ventas'
      });
    }
  }
  
  MetodoPago.init({
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'MetodoPago',
    tableName: 'metodos_pago',
    timestamps: false
  });
  
  return MetodoPago;
};
