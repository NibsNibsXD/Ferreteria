const express = require('express');
const router = express.Router();
const db = require('../models');
const { hashPassword, comparePassword, validatePassword } = require('../utils/passwordUtils');
const { generateToken, authenticateToken } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, contrasena, id_rol, id_sucursal } = req.body;


    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ 
        error: 'Nombre, correo y contraseña son requeridos' 
      });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ 
        error: 'Formato de correo inválido' 
      });
    }

    const passwordValidation = validatePassword(contrasena);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: passwordValidation.message 
      });
    }

    const usuarioExistente = await db.Usuario.findOne({ 
      where: { correo } 
    });

    if (usuarioExistente) {
      return res.status(409).json({ 
        error: 'El correo ya está registrado' 
      });
    }
    const contrasenaEncriptada = await hashPassword(contrasena);

    const nuevoUsuario = await db.Usuario.create({
      nombre,
      correo,
      contrasena: contrasenaEncriptada,
      id_rol: id_rol || 2, // Por defecto rol 2 (usuario)
      id_sucursal: id_sucursal || null,
      estado: true,
      fecha_creacion: new Date()
    });


    const usuarioRespuesta = {
      id_usuario: nuevoUsuario.id_usuario,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      id_rol: nuevoUsuario.id_rol,
      id_sucursal: nuevoUsuario.id_sucursal,
      estado: nuevoUsuario.estado,
      fecha_creacion: nuevoUsuario.fecha_creacion
    };

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      usuario: usuarioRespuesta 
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario: ' + error.message 
    });
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validar datos requeridos
    if (!correo || !contrasena) {
      return res.status(400).json({ 
        error: 'Correo y contraseña son requeridos' 
      });
    }

    // Buscar usuario por correo, incluyendo rol y sucursal
    const usuario = await db.Usuario.findOne({ 
      where: { correo },
      include: [
        {
          model: db.Rol,
          as: 'rol',
          attributes: ['id_rol', 'nombre']
        },
        {
          model: db.Sucursal,
          as: 'sucursal',
          attributes: ['id_sucursal', 'nombre']
        }
      ]
    });

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Correo o contraseña incorrectos' 
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      return res.status(403).json({ 
        error: 'Usuario desactivado. Contacte al administrador.' 
      });
    }

    // Comparar contraseñas
    const contrasenaValida = await comparePassword(contrasena, usuario.contrasena);
    
    if (!contrasenaValida) {
      return res.status(401).json({ 
        error: 'Correo o contraseña incorrectos' 
      });
    }

    // Generar token JWT
    const token = generateToken({
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      id_rol: usuario.id_rol,
      id_sucursal: usuario.id_sucursal,
      nombre: usuario.nombre
    });

    // Responder con token y datos del usuario
    const usuarioRespuesta = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      id_rol: usuario.id_rol,
      id_sucursal: usuario.id_sucursal,
      estado: usuario.estado,
      rol: usuario.rol ? {
        id_rol: usuario.rol.id_rol,
        nombre: usuario.rol.nombre
      } : null,
      sucursal: usuario.sucursal ? {
        id_sucursal: usuario.sucursal.id_sucursal,
        nombre: usuario.sucursal.nombre
      } : null
    };

    res.json({ 
      message: 'Login exitoso',
      token,
      usuario: usuarioRespuesta
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión: ' + error.message 
    });
  }
});

/**
 * GET /api/auth/me
 * Obtener información del usuario autenticado
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const usuario = await db.Usuario.findByPk(req.user.id_usuario, {
      attributes: { exclude: ['contrasena'] },
      include: [
        {
          model: db.Rol,
          as: 'rol',
          attributes: ['id_rol', 'nombre', 'descripcion']
        },
        {
          model: db.Sucursal,
          as: 'sucursal',
          attributes: ['id_sucursal', 'nombre', 'direccion', 'telefono']
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    res.json({ usuario });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener datos del usuario: ' + error.message 
    });
  }
});

/**
 * PUT /api/auth/change-password
 * Cambiar contraseña del usuario autenticado
 */
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;

    // Validar datos requeridos
    if (!contrasenaActual || !contrasenaNueva) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva contraseña son requeridas' 
      });
    }

    // Validar nueva contraseña
    const passwordValidation = validatePassword(contrasenaNueva);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: passwordValidation.message 
      });
    }

    // Buscar usuario
    const usuario = await db.Usuario.findByPk(req.user.id_usuario);

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    const contrasenaValida = await comparePassword(contrasenaActual, usuario.contrasena);
    
    if (!contrasenaValida) {
      return res.status(401).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }

    // Encriptar nueva contraseña
    const nuevaContrasenaEncriptada = await hashPassword(contrasenaNueva);

    // Actualizar contraseña
    await usuario.update({ 
      contrasena: nuevaContrasenaEncriptada 
    });

    res.json({ 
      message: 'Contraseña actualizada exitosamente' 
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ 
      error: 'Error al cambiar contraseña: ' + error.message 
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión (invalidar token - implementación del lado del cliente)
 */
router.post('/logout', authenticateToken, (req, res) => {
  // En una implementación más avanzada, aquí se podría agregar el token a una lista negra
  res.json({ 
    message: 'Sesión cerrada exitosamente' 
  });
});

module.exports = router;
