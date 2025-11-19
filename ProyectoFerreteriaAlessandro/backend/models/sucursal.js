'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sucursal extends Model {
    static associate(models) {
      Sucursal.hasMany(models.Usuario, {
        foreignKey: 'id_sucursal',
        as: 'usuarios'
      });
      Sucursal.hasMany(models.Caja, {
        foreignKey: 'id_sucursal',
        as: 'cajas'
      });
    }
  }
  
  Sucursal.init({
    id_sucursal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Sucursal',
    tableName: 'sucursal',
    timestamps: false
  });
  
  return Sucursal;
};
