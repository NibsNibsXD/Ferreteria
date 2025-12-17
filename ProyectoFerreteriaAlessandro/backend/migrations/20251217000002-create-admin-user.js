'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear sucursal principal si no existe
    const [sucursales] = await queryInterface.sequelize.query(
      `SELECT id_sucursal FROM sucursal WHERE nombre = 'Sucursal Principal'`
    );

    let idSucursal = 1;
    if (sucursales.length === 0) {
      await queryInterface.bulkInsert('sucursal', [{
        nombre: 'Sucursal Principal',
        direccion: 'Calle Principal #123',
        telefono: '2222-3333'
      }]);
    } else {
      idSucursal = sucursales[0].id_sucursal;
    }

    // Crear usuario administrador
    const currentDate = new Date();
    await queryInterface.bulkInsert('usuarios', [{
      id_sucursal: idSucursal,
      nombre: 'Administrador',
      correo: 'admin@ferreteria.com',
      contrasena: hashedPassword,
      id_rol: 1, // Administrador
      activo: true,
      fecha_registro: currentDate
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', { correo: 'admin@ferreteria.com' }, {});
  }
};
