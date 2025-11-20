const rolService = require('../services/rol.service');

class RolController {
  /**
   * Obtener todos los roles
   * GET /api/roles
   */
  async getAllRoles(req, res) {
    try {
      const roles = await rolService.getAllRoles();
      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Obtener un rol por ID
   * GET /api/roles/:id
   */
  async getRolById(req, res) {
    try {
      const rol = await rolService.getRolById(req.params.id);
      res.json({
        success: true,
        data: rol
      });
    } catch (error) {
      const statusCode = error.message === 'Rol no encontrado' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Crear un nuevo rol
   * POST /api/roles
   */
  async createRol(req, res) {
    try {
      const nuevoRol = await rolService.createRol(req.body);
      res.status(201).json({
        success: true,
        message: 'Rol creado exitosamente',
        data: nuevoRol
      });
    } catch (error) {
      const statusCode = error.message.includes('ya existe') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Actualizar un rol
   * PUT /api/roles/:id
   */
  async updateRol(req, res) {
    try {
      const rolActualizado = await rolService.updateRol(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Rol actualizado exitosamente',
        data: rolActualizado
      });
    } catch (error) {
      let statusCode = 500;
      if (error.message === 'Rol no encontrado') statusCode = 404;
      if (error.message.includes('ya existe')) statusCode = 400;
      
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Eliminar un rol
   * DELETE /api/roles/:id
   */
  async deleteRol(req, res) {
    try {
      const result = await rolService.deleteRol(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      let statusCode = 500;
      if (error.message === 'Rol no encontrado') statusCode = 404;
      if (error.message.includes('No se puede eliminar')) statusCode = 400;
      
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Obtener usuarios por rol
   * GET /api/roles/:id/usuarios
   */
  async getUsuariosByRol(req, res) {
    try {
      const result = await rolService.getUsuariosByRol(req.params.id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      const statusCode = error.message === 'Rol no encontrado' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new RolController();
