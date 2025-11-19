'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('caja', {
      id_caja: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      saldo_inicial: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_sucursal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sucursal',
          key: 'id_sucursal'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('caja');
  }
};
