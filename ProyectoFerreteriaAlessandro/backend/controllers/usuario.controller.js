const usuarioService = require('../services/usuario.service');

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.status(200).json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.getUsuarioById(id);
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

const createUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await usuarioService.createUsuario(req.body);
    res.status(201).json({
      success: true,
      data: nuevoUsuario
    });
  } catch (error) {
    const statusCode = error.message.includes('requerido') || 
                       error.message.includes('Ya existe') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActualizado = await usuarioService.updateUsuario(id, req.body);
    res.status(200).json({
      success: true,
      data: usuarioActualizado
    });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      const statusCode = error.message.includes('Ya existe') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await usuarioService.deleteUsuario(id);
    res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};