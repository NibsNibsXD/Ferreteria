'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cierres_caja', {
      id_cierre: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      id_caja: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'caja',
          key: 'id_caja'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      saldo_inicial: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      fecha: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      total_ventas: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      total_devoluciones: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      total_neto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      efectivo_esperado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      efectivo_contado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      diferencia: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cierres_caja');
  }
};
