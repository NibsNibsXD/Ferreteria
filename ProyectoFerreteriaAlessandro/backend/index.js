require('dotenv').config(); // Carga variables de entorno
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importar configuración de Sequelize
const { sequelize, testConnection } = require('./config/database');
const db = require('./models');

// Configuración de Express
const routes = require('./routes/routes');
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());

// Aquí van las rutas
app.use('/api', routes);

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