"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar columna de permisos a la tabla roles
    await queryInterface.addColumn("roles", "permisos", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: "Lista de permisos/módulos a los que tiene acceso el rol"
    });

    // Actualizar rol de Administrador con todos los permisos
    await queryInterface.sequelize.query(`
      UPDATE roles 
      SET permisos = '["nueva-venta", "devoluciones", "cierre-caja", "productos", "registro-compras", "alertas-stock", "reportes", "usuarios"]'::jsonb
      WHERE nombre = 'Administrador'
    `);

    // Actualizar rol de Empleado con permisos limitados (sin reportes ni usuarios)
    await queryInterface.sequelize.query(`
      UPDATE roles 
      SET permisos = '["nueva-venta", "devoluciones", "cierre-caja", "productos", "registro-compras", "alertas-stock", "clientes"]'::jsonb
      WHERE nombre = 'Empleado'
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("roles", "permisos");
  },
};
