# Estructura del Frontend - Ferretería Alessandro

## Estructura de Archivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Componente de login con autenticación
│   │   ├── Header.jsx          # Header con menú de usuario
│   │   ├── Sidebar.jsx         # Sidebar de navegación
│   │   └── Dashboard.jsx       # Vista principal del dashboard
│   ├── services/
│   │   ├── api.js             # Configuración de axios con interceptores
│   │   ├── authService.js     # Servicio de autenticación
│   │   └── index.js           # Todos los servicios de API
│   ├── App.js                 # Componente principal de la aplicación
│   ├── App.css                # Estilos globales
│   └── index.js               # Punto de entrada de React
├── .env                       # Variables de entorno
└── package.json
```

## Servicios API Configurados

### authService
- `login(correo, contrasena)` - Autenticación de usuario
- `logout()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual
- `isAuthenticated()` - Verificar si está autenticado

### usuarioService
- `getAll()` - Obtener todos los usuarios
- `getById(id)` - Obtener usuario por ID
- `create(data)` - Crear nuevo usuario
- `update(id, data)` - Actualizar usuario
- `delete(id)` - Eliminar usuario

### sucursalService
- `getAll()` - Obtener todas las sucursales
- `getById(id)` - Obtener sucursal por ID
- `create(data)` - Crear nueva sucursal
- `update(id, data)` - Actualizar sucursal

### productoService
- `getAll(params)` - Obtener todos los productos con paginación
- `getById(id)` - Obtener producto por ID
- `create(data)` - Crear nuevo producto
- `update(id, data)` - Actualizar producto
- `getActivosCount()` - Obtener cantidad de productos activos
- `getValorInventario()` - Obtener valor total del inventario

### ventaService
- `getAll(params)` - Obtener todas las ventas con paginación
- `getById(id)` - Obtener venta por ID
- `create(data)` - Crear nueva venta
- `getLast10()` - Obtener las últimas 10 ventas
- `getCount()` - Obtener cantidad total de ventas

### alertasService
- `getProductosAgotados()` - Obtener productos agotados
- `getProductosBajoStock()` - Obtener productos con bajo stock

### rolService
- `getAll()` - Obtener todos los roles
- `getById(id)` - Obtener rol por ID
- `create(data)` - Crear nuevo rol
- `update(id, data)` - Actualizar rol
- `delete(id)` - Eliminar rol

## Vistas Disponibles

1. **home** - Dashboard principal
2. **nueva-venta** - Crear nueva venta
3. **devoluciones** - Gestión de devoluciones
4. **cierre-caja** - Cierre de caja
5. **productos** - Gestión de productos
6. **registro-compras** - Registro de compras
7. **alertas-stock** - Alertas de stock bajo
8. **reportes** - Reportes y estadísticas
9. **usuarios** - Gestión de usuarios (solo admin)
10. **configuracion** - Configuración del sistema (solo admin)

## Características Implementadas

### Autenticación
- Login con token JWT
- Almacenamiento seguro del token en localStorage
- Interceptores de axios para agregar el token automáticamente
- Manejo de sesión expirada (redirección automática al login)
- Cierre de sesión

### UI/UX
- Diseño responsive con Tailwind CSS
- Sidebar colapsable
- Header con menú dropdown de usuario
- Tema de colores personalizado (#0f4c81)
- Iconos de Lucide React

### Navegación
- Sistema de vistas basado en estado
- Filtrado de menú según rol de usuario
- Secciones organizadas (Ventas, Inventario, etc.)

## Próximos Pasos

1. Implementar las vistas específicas para cada módulo
2. Crear formularios para CRUD de entidades
3. Agregar tablas con paginación
4. Implementar gráficos en el dashboard
5. Agregar validación de formularios
6. Implementar manejo de errores global
7. Agregar notificaciones/toasts
8. Implementar búsqueda y filtros avanzados

## Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```
REACT_APP_API_URL=http://localhost:3001/api
```

## Instalación y Ejecución

```bash
cd frontend
npm install
npm start
```

## Dependencias Necesarias

Asegúrate de tener instaladas:
- react
- react-dom
- axios
- lucide-react (iconos)
- tailwindcss

```bash
npm install axios lucide-react
```
