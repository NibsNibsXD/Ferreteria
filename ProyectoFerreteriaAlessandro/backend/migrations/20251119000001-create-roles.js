'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id_rol: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });

    // Insertar roles iniciales
    await queryInterface.bulkInsert('roles', [
      {
        id_rol: 1,
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema'
      },
      {
        id_rol: 2,
        nombre: 'Empleado',
        descripcion: 'Rol para empleados con permisos limitados (sin reportes ni usuarios)'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
