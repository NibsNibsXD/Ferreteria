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

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Ferretería Alessandro',
    version: '1.0.0',
    description: 'Documentación de la API de Ferretería Alessandro',
  },
  servers: [
    {
      url: 'http://localhost:' + (process.env.PORT || 3001),
      description: 'Servidor local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Documentar rutas en archivos de rutas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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