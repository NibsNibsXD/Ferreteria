'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('factura', {
      id_factura: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_venta: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ventas',
          key: 'id_venta'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      No_Reg_Exonerados: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      Orden_Compra_Exenta: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      Condiciones_Pago: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      OrdenEstado: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      RTN: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      REG_SGA: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      id_metodo_pago: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'metodos_pago',
          key: 'id_metodo_pago'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('factura');
  }
};
