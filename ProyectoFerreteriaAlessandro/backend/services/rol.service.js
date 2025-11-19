const db = require('../models');

class RolService {
  /**
   * Obtener todos los roles
   */
  async getAllRoles() {
    try {
      const roles = await db.Rol.findAll({
        order: [['id_rol', 'ASC']]
      });
      return roles;
    } catch (error) {
      throw new Error(`Error al obtener roles: ${error.message}`);
    }
  }

  /**
   * Obtener un rol por ID
   */
  async getRolById(id) {
    try {
      const rol = await db.Rol.findByPk(id);
      
      if (!rol) {
        throw new Error('Rol no encontrado');
      }
      
      return rol;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear un nuevo rol
   */
  async createRol(data) {
    try {
      const { nombre, descripcion } = data;

      // Validar que el nombre no esté vacío
      if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre del rol es requerido');
      }

      // Verificar si ya existe un rol con ese nombre
      const rolExistente = await db.Rol.findOne({
        where: { nombre: nombre.trim() }
      });

      if (rolExistente) {
        throw new Error('Ya existe un rol con ese nombre');
      }

      const nuevoRol = await db.Rol.create({
        nombre: nombre.trim(),
        descripcion: descripcion ? descripcion.trim() : null
      });

      return nuevoRol;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar un rol
   */
  async updateRol(id, data) {
    try {
      const rol = await db.Rol.findByPk(id);

      if (!rol) {
        throw new Error('Rol no encontrado');
      }

      const { nombre, descripcion } = data;

      // Si se está actualizando el nombre, verificar que no exista otro rol con ese nombre
      if (nombre && nombre.trim() !== rol.nombre) {
        const rolExistente = await db.Rol.findOne({
          where: { nombre: nombre.trim() }
        });

        if (rolExistente) {
          throw new Error('Ya existe un rol con ese nombre');
        }
      }

      await rol.update({
        nombre: nombre ? nombre.trim() : rol.nombre,
        descripcion: descripcion !== undefined ? (descripcion ? descripcion.trim() : null) : rol.descripcion
      });

      return rol;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar un rol
   */
  async deleteRol(id) {
    try {
      const rol = await db.Rol.findByPk(id);

      if (!rol) {
        throw new Error('Rol no encontrado');
      }

      // Verificar si hay usuarios asociados a este rol
      const usuariosConRol = await db.Usuario.count({
        where: { id_rol: id }
      });

      if (usuariosConRol > 0) {
        throw new Error(`No se puede eliminar el rol porque tiene ${usuariosConRol} usuario(s) asociado(s)`);
      }

      await rol.destroy();

      return { message: 'Rol eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuarios por rol
   */
  async getUsuariosByRol(idRol) {
    try {
      const rol = await db.Rol.findByPk(idRol);

      if (!rol) {
        throw new Error('Rol no encontrado');
      }

      const usuarios = await db.Usuario.findAll({
        where: { id_rol: idRol },
        attributes: { exclude: ['contrasena'] },
        include: [
          {
            model: db.Sucursal,
            as: 'sucursal',
            attributes: ['id_sucursal', 'nombre']
          }
        ]
      });

      return {
        rol,
        usuarios
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RolService();
