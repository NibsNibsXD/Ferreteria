const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Ruta de prueba
 * GET /api/test
 */
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API Ferretería Alessandro funcionando correctamente!',
        timestamp: new Date().toISOString()
    });
});

/**
 * Ruta de prueba protegida
 * GET /api/protected
 * Requiere autenticación
 */
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Acceso a ruta protegida exitoso',
        usuario: req.user
    });
});

/**
 * Obtener todos los usuarios
 * GET /api/usuarios
 * Requiere autenticación
 */
router.get('/usuarios', authenticateToken, async (req, res) => {
    try {
        const usuarios = await db.Usuario.findAll({
            attributes: { exclude: ['contrasena'] },
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
        res.json({ usuarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Obtener un usuario por ID
 * GET /api/usuarios/:id
 * Requiere autenticación
 */
router.get('/usuarios/:id', authenticateToken, async (req, res) => {
    try {
        const usuario = await db.Usuario.findByPk(req.params.id, {
            attributes: { exclude: ['contrasena'] },
            include: [
                {
                    model: db.Rol,
                    as: 'rol'
                },
                {
                    model: db.Sucursal,
                    as: 'sucursal'
                }
            ]
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Actualizar usuario
 * PUT /api/usuarios/:id
 * Requiere autenticación y rol de administrador (rol 1)
 */
router.put('/usuarios/:id', authenticateToken, authorizeRoles(1), async (req, res) => {
    try {
        const { nombre, correo, id_rol, id_sucursal, activo } = req.body;
        
        const usuario = await db.Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.update({
            nombre: nombre || usuario.nombre,
            correo: correo || usuario.correo,
            id_rol: id_rol || usuario.id_rol,
            id_sucursal: id_sucursal !== undefined ? id_sucursal : usuario.id_sucursal,
            activo: activo !== undefined ? activo : usuario.activo
        });

        const usuarioActualizado = await db.Usuario.findByPk(usuario.id_usuario, {
            attributes: { exclude: ['contrasena'] },
            include: [
                { model: db.Rol, as: 'rol' },
                { model: db.Sucursal, as: 'sucursal' }
            ]
        });

        res.json({ 
            message: 'Usuario actualizado exitosamente',
            usuario: usuarioActualizado 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Desactivar usuario
 * DELETE /api/usuarios/:id
 * Requiere autenticación y rol de administrador (rol 1)
 */
router.delete('/usuarios/:id', authenticateToken, authorizeRoles(1), async (req, res) => {
    try {
        const usuario = await db.Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.update({ activo: false });

        res.json({ message: 'Usuario desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;