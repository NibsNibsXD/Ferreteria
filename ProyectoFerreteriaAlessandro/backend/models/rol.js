'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      Rol.hasMany(models.Usuario, {
        foreignKey: 'id_rol',
        as: 'usuarios'
      });
    }
  }
  
  Rol.init({
    id_rol: {
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
    permisos: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Rol',
    tableName: 'roles',
    timestamps: false
  });
  
  return Rol;
};
