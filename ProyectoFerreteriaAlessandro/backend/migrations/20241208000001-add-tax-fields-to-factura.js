'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('factura', 'impuesto', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      after: 'subtotal'
    });

    await queryInterface.addColumn('factura', 'total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      after: 'impuesto'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('factura', 'impuesto');
    await queryInterface.removeColumn('factura', 'total');
  }
};