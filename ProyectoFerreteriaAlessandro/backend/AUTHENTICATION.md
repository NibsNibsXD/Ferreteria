# Sistema de Autenticación y Encriptación

Este documento describe el sistema de autenticación implementado en el backend de Ferretería Alessandro.

## 🔐 Características

- **Encriptación de contraseñas** usando bcrypt con 10 rondas de salt
- **Autenticación JWT** (JSON Web Tokens) con expiración de 24 horas
- **Middleware de autorización** por roles
- **Validación de contraseñas** con requisitos de seguridad
- **Protección de rutas** sensibles

## 📚 Endpoints de Autenticación

### Base URL
```
http://localhost:3001/api/auth
```

### 1. Registro de Usuario
**POST** `/api/auth/register`

Registra un nuevo usuario con contraseña encriptada.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contrasena": "MiPassword123",
  "id_rol": 2,
  "id_sucursal": 1
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "id_rol": 2,
    "id_sucursal": 1,
    "activo": true,
    "fecha_registro": "2025-11-19T..."
  }
}
```

### 2. Iniciar Sesión
**POST** `/api/auth/login`

Autentica un usuario y devuelve un token JWT.

**Body:**
```json
{
  "correo": "juan@example.com",
  "contrasena": "MiPassword123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "id_rol": 2,
    "id_sucursal": 1,
    "activo": true,
    "rol": {
      "id_rol": 2,
      "nombre": "Vendedor"
    },
    "sucursal": {
      "id_sucursal": 1,
      "nombre": "Sucursal Central"
    }
  }
}
```

### 3. Obtener Información del Usuario Autenticado
**GET** `/api/auth/me`

Obtiene información del usuario actual (requiere token).

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "id_rol": 2,
    "id_sucursal": 1,
    "activo": true,
    "rol": { ... },
    "sucursal": { ... }
  }
}
```

### 4. Cambiar Contraseña
**PUT** `/api/auth/change-password`

Cambia la contraseña del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "contrasenaActual": "MiPassword123",
  "contrasenaNueva": "NuevaPassword456"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

### 5. Cerrar Sesión
**POST** `/api/auth/logout`

Cierra la sesión del usuario (requiere token).

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

## 🛡️ Rutas Protegidas

### Listar Usuarios
**GET** `/api/usuarios`

Lista todos los usuarios (requiere autenticación).

**Headers:**
```
Authorization: Bearer {token}
```

### Obtener Usuario por ID
**GET** `/api/usuarios/:id`

Obtiene un usuario específico (requiere autenticación).

### Actualizar Usuario
**PUT** `/api/usuarios/:id`

Actualiza un usuario (requiere autenticación y rol de administrador).

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Juan Actualizado",
  "correo": "nuevoemail@example.com",
  "id_rol": 3,
  "activo": true
}
```

### Desactivar Usuario
**DELETE** `/api/usuarios/:id`

Desactiva un usuario (requiere autenticación y rol de administrador).

## 🔑 Uso del Token JWT

### En el cliente (Frontend)

Después del login, guarda el token:
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correo, contrasena })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

Para hacer peticiones autenticadas:
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/usuarios', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🔒 Seguridad

### Requisitos de Contraseña
- Mínimo 8 caracteres
- Máximo 100 caracteres

### Encriptación
- **Algoritmo:** bcrypt
- **Rounds:** 10
- **Salt:** Generado automáticamente

### JWT
- **Algoritmo:** HS256
- **Expiración:** 24 horas
- **Secret Key:** Configurable en variables de entorno

## 🔧 Middleware de Autorización

### Uso básico
```javascript
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Solo requiere autenticación
router.get('/ruta-protegida', authenticateToken, (req, res) => {
  // req.user contiene la información del usuario
});

// Requiere autenticación y rol específico
router.delete('/admin', authenticateToken, authorizeRoles(1), (req, res) => {
  // Solo usuarios con id_rol = 1 pueden acceder
});
```

## 📝 Variables de Entorno

Configura estas variables en tu archivo `.env`:

```env
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRES_IN=24h
```

## ⚠️ Códigos de Error

- **400:** Bad Request - Datos faltantes o inválidos
- **401:** Unauthorized - Credenciales incorrectas o token inválido
- **403:** Forbidden - Sin permisos suficientes
- **404:** Not Found - Recurso no encontrado
- **409:** Conflict - Usuario ya existe
- **500:** Internal Server Error - Error del servidor

## 🧪 Ejemplo de Prueba con Postman/Thunder Client

1. **Registrar usuario:**
   - POST `http://localhost:3001/api/auth/register`
   - Body: JSON con nombre, correo, contraseña

2. **Login:**
   - POST `http://localhost:3001/api/auth/login`
   - Body: JSON con correo y contraseña
   - Copiar el token de la respuesta

3. **Acceder a ruta protegida:**
   - GET `http://localhost:3001/api/usuarios`
   - Header: `Authorization: Bearer {token}`

## 📦 Estructura de Archivos

```
backend/
├── middleware/
│   └── authMiddleware.js      # Middleware de autenticación y autorización
├── utils/
│   └── passwordUtils.js       # Utilidades para manejo de contraseñas
├── routes/
│   ├── authRoutes.js          # Rutas de autenticación
│   └── routes.js              # Rutas generales protegidas
└── index.js                   # Configuración principal
```

## 🚀 Mejoras Futuras

- [ ] Implementar refresh tokens
- [ ] Agregar rate limiting para prevenir ataques de fuerza bruta
- [ ] Implementar recuperación de contraseña por email
- [ ] Agregar autenticación de dos factores (2FA)
- [ ] Implementar blacklist de tokens para logout real
- [ ] Mejorar validación de contraseñas (mayúsculas, números, caracteres especiales)
