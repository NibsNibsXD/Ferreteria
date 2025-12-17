'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('metodos_pago', {
      id_metodo_pago: {
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
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });

    // Insertar métodos de pago iniciales
    await queryInterface.bulkInsert('metodos_pago', [
      { nombre: 'Efectivo', descripcion: 'Pago en efectivo en moneda local', activo: true },
      { nombre: 'Tarjeta de Credito', descripcion: 'Pago con tarjeta de credito Visa, MasterCard, etc.', activo: true },
      { nombre: 'Tarjeta de Debito', descripcion: 'Pago con tarjeta de debito bancaria', activo: true },
      { nombre: 'Transferencia Bancaria', descripcion: 'Transferencia electronica desde cuenta bancaria', activo: true },
      { nombre: 'Cheque', descripcion: 'Pago mediante cheque bancario', activo: true },
      { nombre: 'Pago Movil', descripcion: 'Pago a traves de aplicaciones moviles bancarias', activo: true },
      { nombre: 'Credito de Casa', descripcion: 'Credito otorgado por la ferreteria al cliente', activo: true },
      { nombre: 'Deposito Bancario', descripcion: 'Deposito directo en cuenta de la ferreteria', activo: true }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('metodos_pago');
  }
};
