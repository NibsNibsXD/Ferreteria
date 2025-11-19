const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

//Prueba
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Excluir password de la respuesta
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        
        // Hash del password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear usuario
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        
        // Respuesta sin password
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive
        };
        
        res.status(201).json({ user: userResponse, message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Verificar password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        // Respuesta sin password
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive
        };
        
        res.json({ user: userResponse, token, message: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;