'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Sucursal, {
        foreignKey: 'id_sucursal',
        as: 'sucursal'
      });
      Usuario.belongsTo(models.Rol, {
        foreignKey: 'id_rol',
        as: 'rol'
      });
      Usuario.hasMany(models.Compra, {
        foreignKey: 'id_usuario',
        as: 'compras'
      });
      Usuario.hasMany(models.Venta, {
        foreignKey: 'id_usuario',
        as: 'ventas'
      });
      Usuario.hasMany(models.Caja, {
        foreignKey: 'id_usuario',
        as: 'cajas'
      });
      Usuario.hasMany(models.CierreCaja, {
        foreignKey: 'id_usuario',
        as: 'cierres_caja'
      });
    }
  }
  
  Usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_token_expiracion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false
  });
  
  return Usuario;
};
