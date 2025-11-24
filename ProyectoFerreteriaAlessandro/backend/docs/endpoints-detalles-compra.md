# Endpoints del Módulo Detalles de Compra

Este documento describe los endpoints REST para gestionar los detalles (líneas o items) de las compras en el sistema de Ferretería Alessandro.

## Base URL
```
/api/detalles-compra
```

## Autenticación
Todos los endpoints requieren un token JWT válido en el header `Authorization: Bearer <token>`.

---

## Modelo DetalleCompra

### Estructura de datos
```javascript
{
  id_detalle: Integer (PK, autoIncrement),
  id_compra: Integer (FK a Compra),
  id_producto: Integer (FK a Producto),
  cantidad: Integer (requerido),
  precio_unitario: Decimal(10,2) (requerido),
  subtotal: Decimal(10,2) (calculado automáticamente)
}
```

### Relaciones
- **DetalleCompra** `belongsTo` **Compra** (as: 'compra')
- **DetalleCompra** `belongsTo` **Producto** (as: 'producto')
- **Compra** `hasMany` **DetalleCompra** (as: 'detalles')

---

## Endpoints

### 1. Obtener todos los detalles de compra

**GET** `/api/detalles-compra`

Obtiene un listado de todos los detalles de compra con información de la compra asociada y el producto.

#### Autenticación
- Requiere: `authenticateToken`

#### Query Parameters (opcional)
- `page` (integer): Número de página para paginación
- `limit` (integer): Cantidad de registros por página

#### Ejemplo de Request
```bash
curl -X GET http://localhost:3000/api/detalles-compra \
  -H "Authorization: Bearer <token>"

# Con paginación
curl -X GET "http://localhost:3000/api/detalles-compra?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "id_detalle": 1,
      "id_compra": 5,
      "id_producto": 10,
      "cantidad": 50,
      "precio_unitario": "15.50",
      "subtotal": "775.00",
      "compra": {
        "id_compra": 5,
        "fecha": "2025-11-20T10:30:00.000Z",
        "total": "1550.00",
        "id_usuario": 2
      },
      "producto": {
        "id_producto": 10,
        "nombre": "Tornillo 1/4 x 2\"",
        "codigo_barra": "7501234567890",
        "precio_compra": "12.00",
        "precio_venta": "20.00"
      }
    }
  ]
}
```

#### Errores Posibles
- **401 Unauthorized**: Token no válido o no proporcionado
- **500 Internal Server Error**: Error en el servidor

---

### 2. Obtener un detalle de compra por ID

**GET** `/api/detalles-compra/:id`

Obtiene la información detallada de un detalle de compra específico.

#### Autenticación
- Requiere: `authenticateToken`

#### Parámetros de URL
- `id` (integer, requerido): ID del detalle de compra

#### Ejemplo de Request
```bash
curl -X GET http://localhost:3000/api/detalles-compra/1 \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": {
    "id_detalle": 1,
    "id_compra": 5,
    "id_producto": 10,
    "cantidad": 50,
    "precio_unitario": "15.50",
    "subtotal": "775.00",
    "compra": {
      "id_compra": 5,
      "fecha": "2025-11-20T10:30:00.000Z",
      "total": "1550.00",
      "id_usuario": 2
    },
    "producto": {
      "id_producto": 10,
      "nombre": "Tornillo 1/4 x 2\"",
      "codigo_barra": "7501234567890",
      "descripcion": "Tornillo de acero galvanizado",
      "precio_compra": "12.00",
      "precio_venta": "20.00",
      "stock": 500
    }
  }
}
```

#### Errores Posibles
- **401 Unauthorized**: Token no válido
- **404 Not Found**: Detalle de compra no encontrado
- **500 Internal Server Error**: Error en el servidor

---

### 3. Crear un nuevo detalle de compra

**POST** `/api/detalles-compra`

Crea un nuevo detalle (línea/item) de compra.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)` (solo administradores)

#### Body Parameters
```json
{
  "id_compra": 5,
  "id_producto": 10,
  "cantidad": 50,
  "precio_unitario": 15.50,
  "subtotal": 775.00  // Opcional - se calcula automáticamente
}
```

#### Validaciones
- `id_compra`: Requerido
- `id_producto`: Requerido
- `cantidad`: Requerido, debe ser mayor a 0
- `precio_unitario`: Requerido, debe ser >= 0
- `subtotal`: Opcional - si no se proporciona, se calcula como `cantidad * precio_unitario`

#### Ejemplo de Request
```bash
curl -X POST http://localhost:3000/api/detalles-compra \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id_compra": 5,
    "id_producto": 10,
    "cantidad": 50,
    "precio_unitario": 15.50
  }'
```

#### Respuesta Exitosa (201)
```json
{
  "success": true,
  "message": "Detalle de compra creado exitosamente",
  "data": {
    "id_detalle": 1,
    "id_compra": 5,
    "id_producto": 10,
    "cantidad": 50,
    "precio_unitario": "15.50",
    "subtotal": "775.00",
    "compra": {
      "id_compra": 5,
      "fecha": "2025-11-20T10:30:00.000Z",
      "total": "1550.00",
      "id_usuario": 2
    },
    "producto": {
      "id_producto": 10,
      "nombre": "Tornillo 1/4 x 2\"",
      "codigo_barra": "7501234567890",
      "descripcion": "Tornillo de acero galvanizado",
      "precio_compra": "12.00",
      "precio_venta": "20.00",
      "stock": 500
    }
  }
}
```

#### Errores Posibles
- **400 Bad Request**: Datos de validación incorrectos
- **401 Unauthorized**: Token no válido
- **403 Forbidden**: Usuario sin permisos de administrador
- **500 Internal Server Error**: Error en el servidor

---

### 4. Actualizar un detalle de compra

**PUT** `/api/detalles-compra/:id`

Actualiza la información de un detalle de compra existente.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)` (solo administradores)

#### Parámetros de URL
- `id` (integer, requerido): ID del detalle de compra

#### Body Parameters (todos opcionales)
```json
{
  "id_compra": 5,
  "id_producto": 10,
  "cantidad": 60,
  "precio_unitario": 16.00,
  "subtotal": 960.00
}
```

#### Validaciones
- `cantidad`: Si se proporciona, debe ser mayor a 0
- `precio_unitario`: Si se proporciona, debe ser >= 0
- `subtotal`: Si no se proporciona, se recalcula automáticamente con los nuevos valores

#### Ejemplo de Request
```bash
curl -X PUT http://localhost:3000/api/detalles-compra/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 60,
    "precio_unitario": 16.00
  }'
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Detalle de compra actualizado exitosamente",
  "data": {
    "id_detalle": 1,
    "id_compra": 5,
    "id_producto": 10,
    "cantidad": 60,
    "precio_unitario": "16.00",
    "subtotal": "960.00",
    "compra": {
      "id_compra": 5,
      "fecha": "2025-11-20T10:30:00.000Z",
      "total": "1550.00",
      "id_usuario": 2
    },
    "producto": {
      "id_producto": 10,
      "nombre": "Tornillo 1/4 x 2\"",
      "codigo_barra": "7501234567890",
      "descripcion": "Tornillo de acero galvanizado",
      "precio_compra": "12.00",
      "precio_venta": "20.00",
      "stock": 500
    }
  }
}
```

#### Errores Posibles
- **400 Bad Request**: Datos de validación incorrectos
- **401 Unauthorized**: Token no válido
- **403 Forbidden**: Usuario sin permisos de administrador
- **404 Not Found**: Detalle de compra no encontrado
- **500 Internal Server Error**: Error en el servidor

---

### 5. Eliminar un detalle de compra

**DELETE** `/api/detalles-compra/:id`

Elimina un detalle de compra del sistema.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)` (solo administradores)

#### Parámetros de URL
- `id` (integer, requerido): ID del detalle de compra

#### Ejemplo de Request
```bash
curl -X DELETE http://localhost:3000/api/detalles-compra/1 \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Detalle de compra eliminado exitosamente"
}
```

#### Errores Posibles
- **401 Unauthorized**: Token no válido
- **403 Forbidden**: Usuario sin permisos de administrador
- **404 Not Found**: Detalle de compra no encontrado
- **500 Internal Server Error**: Error en el servidor

---

## Flujo de Trabajo y Relaciones

### Creación de una Compra con Detalles

1. **Crear la Compra** (`POST /api/compras`)
   - Se crea el registro de compra con datos generales
   - Se obtiene el `id_compra`

2. **Agregar Detalles** (`POST /api/detalles-compra`)
   - Se crean múltiples detalles asociados al `id_compra`
   - Cada detalle especifica: producto, cantidad, precio

3. **Actualizar Total** (lógica de negocio)
   - El total de la compra debería recalcularse sumando todos los subtotales
   - Considerar implementar triggers o lógica en el service de Compra

### Actualización de Inventario

Los detalles de compra afectan el inventario de productos:
- Al crear un detalle: **aumentar stock** del producto
- Al eliminar un detalle: **reducir stock** del producto
- Al actualizar cantidad: **ajustar stock** según diferencia

**Nota:** Actualmente esta lógica NO está implementada automáticamente. Se recomienda:
- Implementar en el service de DetalleCompra
- O usar triggers de base de datos
- O manejar transacciones en el service de Compra

### Integridad Referencial

- Un detalle debe estar asociado a una **Compra válida** (`id_compra`)
- Un detalle debe referenciar un **Producto válido** (`id_producto`)
- Al eliminar una Compra, considerar:
  - Eliminar en cascada sus detalles
  - O prevenir eliminación si tiene detalles

---

## Consideraciones Técnicas

### Cálculo de Subtotal
El subtotal se calcula automáticamente como:
```
subtotal = cantidad * precio_unitario
```
Si se proporciona un subtotal diferente, se respeta (útil para descuentos o ajustes).

### Paginación
Se recomienda usar paginación en producción para listados grandes:
```
GET /api/detalles-compra?page=1&limit=50
```

### Soft Delete vs Hard Delete
Actualmente se implementa **hard delete** (eliminación física). Se recomienda considerar **soft delete** para:
- Mantener historial de detalles modificados
- Auditoría de cambios
- Recuperación de datos

### Validación de Stock
Al crear/actualizar detalles, se recomienda validar:
- Que el producto exista
- Que la compra exista
- Que las cantidades sean coherentes con el inventario

### Transacciones
Para operaciones que involucran múltiples detalles o actualización de inventario, usar transacciones de base de datos para garantizar consistencia.

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Detalle creado exitosamente |
| 400 | Datos de entrada inválidos |
| 401 | No autenticado (token inválido/faltante) |
| 403 | No autorizado (permisos insuficientes) |
| 404 | Detalle de compra no encontrado |
| 500 | Error interno del servidor |

---

## Notas de Implementación

1. **Modelo separado de DetalleVenta**: Existe también un modelo `DetalleFactura` para ventas/facturas
2. **Relaciones**: Los detalles conectan Compras con Productos
3. **Timestamps**: El modelo no usa timestamps automáticos
4. **Decimal Precision**: Los precios usan `DECIMAL(10,2)` para precisión
5. **Foreign Keys**: Las FKs permiten NULL, validar en capa de negocio

---

## Ejemplo de Uso Completo

### Crear una compra con múltiples detalles

```bash
# 1. Crear la compra
curl -X POST http://localhost:3000/api/compras \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 2,
    "fecha": "2025-11-24T10:00:00Z"
  }'

# Respuesta: { "data": { "id_compra": 10, ... } }

# 2. Agregar primer detalle
curl -X POST http://localhost:3000/api/detalles-compra \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id_compra": 10,
    "id_producto": 5,
    "cantidad": 100,
    "precio_unitario": 12.50
  }'

# 3. Agregar segundo detalle
curl -X POST http://localhost:3000/api/detalles-compra \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id_compra": 10,
    "id_producto": 8,
    "cantidad": 50,
    "precio_unitario": 25.00
  }'

# 4. Ver todos los detalles de la compra
curl -X GET http://localhost:3000/api/compras/10 \
  -H "Authorization: Bearer <token>"
```

---

## Mejoras Futuras Recomendadas

1. **Validación de existencia**: Validar que id_compra e id_producto existan antes de crear/actualizar
2. **Actualización automática de stock**: Implementar lógica para actualizar inventario
3. **Recalculo de total de compra**: Actualizar automáticamente el total de la compra al modificar detalles
4. **Validación de permisos por sucursal**: Restringir acceso según la sucursal del usuario
5. **Auditoría de cambios**: Registrar quién y cuándo modifica detalles
6. **Validación de precios**: Alertar si el precio_unitario difiere significativamente del precio del producto
7. **Búsqueda y filtros**: Agregar endpoints para buscar detalles por compra, producto, rango de fechas
8. **Reportes**: Endpoints para estadísticas de compras por producto, proveedor, etc.
