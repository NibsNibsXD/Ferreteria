const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Devolucion extends Model {}

  Devolucion.init({
    id_devolucion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ventas',
        key: 'id_venta',
      },
    },
    productos_devueltos: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    productos_cambio: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    total_devuelto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    total_cambio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    diferencia: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
    },
    usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Devolucion',
    tableName: 'devoluciones',
    timestamps: true,
  });

  return Devolucion;
};
