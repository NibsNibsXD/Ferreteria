'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalle_factura', {
      id_detalle_factura: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_factura: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'factura',
          key: 'id_factura'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Rebajas_Otorgadas: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'productos',
          key: 'id_producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detalle_factura');
  }
};
