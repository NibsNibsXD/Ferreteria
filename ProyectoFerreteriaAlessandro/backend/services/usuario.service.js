const db = require('../models');
const { hashPassword } = require('../utils/passwordUtils');

const getAllUsuarios = async () => {
  try {
    const usuarios = await db.Usuario.findAll({
      attributes: { exclude: ['contrasena'] },
      include: [
        { model: db.Sucursal, as: 'sucursal', attributes: ['id_sucursal', 'nombre'] },
        { model: db.Rol, as: 'rol', attributes: ['id_rol', 'nombre'] }
      ],
      order: [['id_usuario', 'ASC']]
    });
    return usuarios;
  } catch (error) {
    throw new Error('Error al obtener usuarios: ' + error.message);
  }
};

const getUsuarioById = async (id) => {
  try {
    const usuario = await db.Usuario.findByPk(id, {
      attributes: { exclude: ['contrasena'] },
      include: [
        { model: db.Sucursal, as: 'sucursal', attributes: ['id_sucursal', 'nombre'] },
        { model: db.Rol, as: 'rol', attributes: ['id_rol', 'nombre'] }
      ]
    });
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    return usuario;
  } catch (error) {
    throw error;
  }
};

const createUsuario = async (data) => {
  try {
    const { nombre, correo, contrasena, id_rol, id_sucursal } = data;

    if (!nombre || !correo || !contrasena || !id_rol) {
      throw new Error('Nombre, correo, contraseña y rol son requeridos');
    }

    const usuarioExistente = await db.Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      throw new Error('Ya existe un usuario con ese correo');
    }

    const contrasenaEncriptada = await hashPassword(contrasena);

    const nuevoUsuario = await db.Usuario.create({
      nombre,
      correo,
      contrasena: contrasenaEncriptada,
      id_rol,
      id_sucursal: id_sucursal || null,
      activo: true
    });

    const usuarioCreado = await db.Usuario.findByPk(nuevoUsuario.id_usuario, {
      attributes: { exclude: ['contrasena'] },
      include: [
        { model: db.Sucursal, as: 'sucursal', attributes: ['id_sucursal', 'nombre'] },
        { model: db.Rol, as: 'rol', attributes: ['id_rol', 'nombre'] }
      ]
    });

    return usuarioCreado;
  } catch (error) {
    throw error;
  }
};

const updateUsuario = async (id, data) => {
  try {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const { nombre, correo, id_rol, id_sucursal, activo } = data;

    if (correo && correo !== usuario.correo) {
      const usuarioExistente = await db.Usuario.findOne({ where: { correo } });
      if (usuarioExistente) {
        throw new Error('Ya existe un usuario con ese correo');
      }
    }

    await usuario.update({
      nombre: nombre || usuario.nombre,
      correo: correo || usuario.correo,
      id_rol: id_rol !== undefined ? id_rol : usuario.id_rol,
      id_sucursal: id_sucursal !== undefined ? id_sucursal : usuario.id_sucursal,
      activo: activo !== undefined ? activo : usuario.activo
    });

    const usuarioActualizado = await db.Usuario.findByPk(id, {
      attributes: { exclude: ['contrasena'] },
      include: [
        { model: db.Sucursal, as: 'sucursal', attributes: ['id_sucursal', 'nombre'] },
        { model: db.Rol, as: 'rol', attributes: ['id_rol', 'nombre'] }
      ]
    });

    return usuarioActualizado;
  } catch (error) {
    throw error;
  }
};

const deleteUsuario = async (id) => {
  try {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    await usuario.update({ activo: false });

    return { mensaje: 'Usuario desactivado correctamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
