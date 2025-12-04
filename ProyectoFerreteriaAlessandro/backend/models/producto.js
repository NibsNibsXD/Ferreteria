'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });
      Producto.hasMany(models.DetalleCompra, {
        foreignKey: 'id_producto',
        as: 'detalle_compras'
      });
      Producto.hasMany(models.DetalleFactura, {
        foreignKey: 'id_producto',
        as: 'detalle_facturas'
      });
    }
  }
  
  //aqui ya esta implemenetado 104-routes-editproduct
  Producto.init({
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    codigo_barra: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    precio_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: false
  });
  
  return Producto;
};
