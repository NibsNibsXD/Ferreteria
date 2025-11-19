'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Caja extends Model {
    static associate(models) {
      Caja.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
      Caja.belongsTo(models.Sucursal, {
        foreignKey: 'id_sucursal',
        as: 'sucursal'
      });
      Caja.hasMany(models.CierreCaja, {
        foreignKey: 'id_caja',
        as: 'cierres'
      });
    }
  }
  
  Caja.init({
    id_caja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    saldo_inicial: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Caja',
    tableName: 'caja',
    timestamps: false
  });
  
  return Caja;
};
