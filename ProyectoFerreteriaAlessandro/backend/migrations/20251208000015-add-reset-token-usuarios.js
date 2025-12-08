'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'reset_token', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('usuarios', 'reset_token_expiracion', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'reset_token_expiracion');
    await queryInterface.removeColumn('usuarios', 'reset_token');
  }
};

