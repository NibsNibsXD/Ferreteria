"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("devoluciones", {
      id_devolucion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_venta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ventas",
          key: "id_venta",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      productos_devueltos: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: "Lista de productos devueltos (id, cantidad, precio_unitario)"
      },
      productos_cambio: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: "Lista de productos entregados a cambio (id, cantidad, precio_unitario)"
      },
      total_devuelto: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      total_cambio: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      diferencia: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
      },
      usuario: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("devoluciones");
  },
};
