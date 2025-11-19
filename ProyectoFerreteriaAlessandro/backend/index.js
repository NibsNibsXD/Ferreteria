require('dotenv').config(); // Carga variables de entorno
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar configuración de Sequelize
const { sequelize, testConnection } = require('./config/database');
const db = require('./models');

// Importar rutas
const routes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');

// Configuración de Express
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api', routes); // Rutas generales

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Ferretería Alessandro',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      api: '/api'
    }
  });
});

const PORT = process.env.PORT || 3001;

// Función para inicializar el servidor
async function startServer() {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Sincronizar modelos (en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados con la base de datos.');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error al inicializar el servidor:', error);
  }
}

// Inicializar servidor
startServer();