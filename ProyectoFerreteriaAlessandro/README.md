# 🏪 Ferretería Alessandro - Sistema de Gestión

Este proyecto es una aplicación web fullstack para la gestión de Ferretería Alessandro, compuesta por:

- 🔙 **Backend:** Node.js, Express, PostgreSQL, JWT, Bcrypt
- 🔜 **Frontend:** React, Tailwind CSS, Ant Design, Axios

---

## 📁 Estructura del Proyecto

```
ferreteria-alessandro/
├── backend/         # API REST con Express + PostgreSQL
├── frontend/        # Interfaz de usuario con React + Tailwind
└── README.md        # Este archivo
```

---

## 🧩 Tecnologías Usadas

### Backend

- Node.js + Express
- PostgreSQL
- JWT (autenticación)
- Bcrypt (hash de contraseñas)
- dotenv (variables de entorno)
- Morgan (logs de servidor)
- CORS

### Frontend

- React 19
- Tailwind CSS (v3)
- Ant Design
- Axios
- js-cookie + jwt-decode
- dotenv

---

## 🚀 Instalación y Uso

### 1. Clonar el proyecto

```bash
git clone https://github.com/tu-usuario/ferreteria-alessandro.git
cd ferreteria-alessandro
```

### 2. Iniciar los contenedores Docker

```bash
docker-compose up --build
```

El servidor estará disponible en:
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Base de datos: `ferreteria_alessandro_db`

---

## 💾 Gestión de la Base de Datos

### Exportar la Base de Datos

Para exportar la base de datos y compartirla (por ejemplo, enviarla por correo o subirla):

**En Windows (PowerShell):**
```powershell
cd backend
.\export-db.ps1
```

Esto creará un archivo `ferreteria_alessandro_YYYYMMDD_HHMMSS.sql` con toda la estructura y datos de la base de datos.

### Importar la Base de Datos

Si recibes un archivo SQL de la base de datos:

**En Windows (PowerShell):**
```powershell
cd backend
.\import-db.ps1 -SqlFile "ruta/al/archivo.sql"
```

**Nota:** Asegúrate de que el contenedor Docker esté corriendo antes de exportar o importar.

---

## ⚠️ Importante sobre Migraciones

Las migraciones de Sequelize (`backend/migrations/` y `backend/seeders/`) están **excluidas del repositorio de GitHub**. 

Si necesitas compartir la estructura de la base de datos:
1. Usa los scripts de exportación mencionados arriba
2. Comparte el archivo `.sql` generado
3. La otra persona puede importarlo con el script de importación

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Backend
BACKEND_PORT=3001

# Frontend
FRONTEND_PORT=3000

# Base de datos
DB_NAME=ferreteria_alessandro_db
DB_USER=postgres
DB_PASSWORD=clave123
DB_HOST=database
DB_PORT=5432
```

---

## 📦 Comandos Útiles

### Backend

```bash
npm run dev          # Modo desarrollo con nodemon
npm start            # Iniciar servidor
```

### Frontend

```bash
npm start            # Iniciar aplicación React
npm run build        # Compilar para producción
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
