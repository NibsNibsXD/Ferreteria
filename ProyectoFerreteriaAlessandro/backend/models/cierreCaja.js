'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CierreCaja extends Model {
    static associate(models) {
      CierreCaja.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
      CierreCaja.belongsTo(models.Caja, {
        foreignKey: 'id_caja',
        as: 'caja'
      });
    }
  }
  
  CierreCaja.init({
    id_cierre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_caja: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    saldo_inicial: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    total_ventas: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total_devoluciones: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total_neto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'CierreCaja',
    tableName: 'cierres_caja',
    timestamps: false
  });
  
  return CierreCaja;
};
