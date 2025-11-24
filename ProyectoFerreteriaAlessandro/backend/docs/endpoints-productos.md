# Documentación de Endpoints - Módulo Productos

**Fecha de creación:** 2025-11-23
**Autor:** Equipo Backend Ferretería Alessandro
**Versión:** 1.0

---

## Descripción General

Este documento contiene la especificación técnica de los endpoints del módulo de Productos. Estos endpoints permiten la gestión completa del catálogo de productos de la ferretería, incluyendo operaciones de creación, consulta, actualización y eliminación (CRUD).

**Nota:** Este documento sirve como base para la wiki y el documento técnico final del proyecto.

### Importancia del Módulo Productos

Los productos son el núcleo del sistema de inventario y ventas de la ferretería. Este módulo gestiona el catálogo completo de artículos disponibles, sus precios, stock y características. Se relaciona directamente con:

- **Inventario**: Control de stock, stock mínimo y alertas de reabastecimiento
- **Compras**: Registro de productos adquiridos de proveedores
- **Ventas**: Productos vendidos a clientes
- **Categorías**: Organización y clasificación de productos
- **Reportes**: Análisis de productos más vendidos, rentabilidad, etc.

### Relaciones del Módulo Producto

- **Categoría** (`id_categoria`): Cada producto puede pertenecer a una categoría para su clasificación
- **Detalle de Compra** (hasMany): Un producto puede aparecer en múltiples compras
- **Detalle de Factura** (hasMany): Un producto puede aparecer en múltiples facturas/ventas

```
Producto (N) ---> (1) Categoria
Producto (1) ---> (N) DetalleCompra
Producto (1) ---> (N) DetalleFactura
```

---

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT. El token debe enviarse en el header de la petición:

```
Authorization: Bearer <token>
```

### Roles de Usuario

- **Rol 1**: Administrador - Acceso completo (crear, actualizar, eliminar productos)
- **Otros roles**: Solo lectura (consultar productos)

---

## Endpoints

### 1. Obtener todos los productos (Listar productos)

**Método:** `GET`
**Ruta:** `/api/productos`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene un listado de todos los productos registrados en el sistema, ordenados por ID. Incluye información de la categoría asociada a cada producto.

#### Parámetros de Query (Opcional)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | Integer | Número de página para paginación | `?page=1` |
| `limit` | Integer | Cantidad de registros por página | `?limit=10` |

**Ejemplo de uso con paginación:**
```
GET /api/productos?page=1&limit=20
```

**Nota sobre paginación:** La paginación es opcional. Si no se proporcionan los parámetros, se retornarán todos los registros.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id_producto": 1,
      "nombre": "Martillo de Carpintero",
      "descripcion": "Martillo profesional de 16 oz con mango de fibra de vidrio",
      "codigo_barra": "7501234567890",
      "id_categoria": 5,
      "precio_compra": 8.50,
      "precio_venta": 12.99,
      "stock": 45,
      "stock_minimo": 10,
      "activo": true,
      "fecha_registro": "2025-01-15T08:30:00.000Z",
      "categoria": {
        "id_categoria": 5,
        "nombre": "Herramientas Manuales"
      }
    },
    {
      "id_producto": 2,
      "nombre": "Tornillos Acero Inoxidable 1/4",
      "descripcion": "Paquete de 100 unidades, acero inoxidable grado 304",
      "codigo_barra": "7501234567891",
      "id_categoria": 12,
      "precio_compra": 5.00,
      "precio_venta": 7.50,
      "stock": 150,
      "stock_minimo": 50,
      "activo": true,
      "fecha_registro": "2025-01-10T10:00:00.000Z",
      "categoria": {
        "id_categoria": 12,
        "nombre": "Tornillería"
      }
    }
  ]
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 500 | Error interno del servidor |

---

### 2. Obtener detalle de un producto

**Método:** `GET`
**Ruta:** `/api/productos/:id`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene los detalles completos de un producto específico mediante su ID, incluyendo toda la información de su categoría.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID del producto |

**Ejemplo:**
```
GET /api/productos/1
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id_producto": 1,
    "nombre": "Martillo de Carpintero",
    "descripcion": "Martillo profesional de 16 oz con mango de fibra de vidrio. Ideal para trabajos de carpintería general.",
    "codigo_barra": "7501234567890",
    "id_categoria": 5,
    "precio_compra": 8.50,
    "precio_venta": 12.99,
    "stock": 45,
    "stock_minimo": 10,
    "activo": true,
    "fecha_registro": "2025-01-15T08:30:00.000Z",
    "categoria": {
      "id_categoria": 5,
      "nombre": "Herramientas Manuales",
      "descripcion": "Herramientas de mano para uso profesional y doméstico"
    }
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 404 | Producto no encontrado |
| 500 | Error interno del servidor |

---

### 3. Crear producto

**Método:** `POST`
**Ruta:** `/api/productos`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Registra un nuevo producto en el catálogo del sistema. Valida que el nombre sea requerido, los precios sean válidos y que el precio de venta sea mayor o igual al precio de compra.

#### Body (JSON)

```json
{
  "nombre": "Taladro Eléctrico Profesional",
  "descripcion": "Taladro percutor de 800W con velocidad variable y sistema de cambio rápido de broca",
  "codigo_barra": "7501234567892",
  "id_categoria": 3,
  "precio_compra": 45.00,
  "precio_venta": 65.00,
  "stock": 20,
  "stock_minimo": 5,
  "activo": true
}
```

#### Campos del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | String(100) | Sí | Nombre del producto |
| `descripcion` | Text | No | Descripción detallada del producto |
| `codigo_barra` | String(50) | No | Código de barras del producto |
| `id_categoria` | Integer | No | ID de la categoría a la que pertenece |
| `precio_compra` | Decimal(10,2) | Sí | Precio de compra del producto (≥ 0) |
| `precio_venta` | Decimal(10,2) | Sí | Precio de venta del producto (≥ precio_compra) |
| `stock` | Integer | No | Cantidad en inventario (por defecto: 0) |
| `stock_minimo` | Integer | No | Stock mínimo antes de alerta (por defecto: 5) |
| `activo` | Boolean | No | Estado activo/inactivo (por defecto: true) |

**Nota:** El campo `fecha_registro` se asigna automáticamente al momento de la creación.

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id_producto": 3,
    "nombre": "Taladro Eléctrico Profesional",
    "descripcion": "Taladro percutor de 800W con velocidad variable y sistema de cambio rápido de broca",
    "codigo_barra": "7501234567892",
    "id_categoria": 3,
    "precio_compra": 45.00,
    "precio_venta": 65.00,
    "stock": 20,
    "stock_minimo": 5,
    "activo": true,
    "fecha_registro": "2025-11-23T14:30:00.000Z",
    "categoria": {
      "id_categoria": 3,
      "nombre": "Herramientas Eléctricas",
      "descripcion": "Herramientas que funcionan con electricidad"
    }
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Error de validación - Campos requeridos faltantes o inválidos |
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 500 | Error interno del servidor |

#### Errores de Validación Específicos

- "El nombre del producto es requerido"
- "El precio de compra es requerido y debe ser mayor o igual a 0"
- "El precio de venta es requerido y debe ser mayor o igual a 0"
- "El precio de venta debe ser mayor o igual al precio de compra"

---

### 4. Actualizar producto

**Método:** `PUT`
**Ruta:** `/api/productos/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Actualiza la información de un producto existente. Todos los campos son opcionales; solo se actualizarán los campos proporcionados en el body. Valida que el precio de venta sea siempre mayor o igual al precio de compra.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID del producto a actualizar |

#### Body (JSON)

```json
{
  "precio_venta": 69.99,
  "stock": 25,
  "descripcion": "Taladro percutor de 800W con velocidad variable, sistema de cambio rápido de broca y estuche de transporte incluido"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos que se envíen en el body.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id_producto": 3,
    "nombre": "Taladro Eléctrico Profesional",
    "descripcion": "Taladro percutor de 800W con velocidad variable, sistema de cambio rápido de broca y estuche de transporte incluido",
    "codigo_barra": "7501234567892",
    "id_categoria": 3,
    "precio_compra": 45.00,
    "precio_venta": 69.99,
    "stock": 25,
    "stock_minimo": 5,
    "activo": true,
    "fecha_registro": "2025-11-23T14:30:00.000Z",
    "categoria": {
      "id_categoria": 3,
      "nombre": "Herramientas Eléctricas",
      "descripcion": "Herramientas que funcionan con electricidad"
    }
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Error de validación - Precios inválidos |
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Producto no encontrado |
| 500 | Error interno del servidor |

---

### 5. Eliminar producto

**Método:** `DELETE`
**Ruta:** `/api/productos/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Elimina permanentemente un producto del sistema. Esta operación es irreversible.

**⚠️ ADVERTENCIA:**
- Esta operación elimina permanentemente el registro de la base de datos.
- **IMPORTANTE**: Antes de eliminar un producto, asegúrate de que no esté siendo utilizado en detalles de compra o venta existentes, ya que esto podría causar problemas de integridad referencial.
- Considera implementar una eliminación lógica (cambiar el campo `activo` a `false`) en lugar de eliminación física para mantener el historial y la integridad de datos.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID del producto a eliminar |

**Ejemplo:**
```
DELETE /api/productos/3
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Producto no encontrado |
| 500 | Error interno del servidor (puede incluir errores de integridad referencial) |

---

## Relaciones y Consideraciones Técnicas

### Uso en Compras

Cuando se registra una compra a un proveedor, los productos comprados se registran en la tabla `detalle_compras`:

**Flujo:**
1. Se crea una compra con datos generales (usuario, fecha, total)
2. Se crean registros en `detalle_compras` con:
   - `id_compra`: ID de la compra
   - `id_producto`: ID del producto comprado
   - `cantidad`: Unidades compradas
   - `precio_unitario`: Precio de compra unitario
   - `subtotal`: cantidad × precio_unitario
3. El `stock` del producto debe incrementarse automáticamente

**Relación:**
```
DetalleCompra (N) ---> (1) Producto
```

### Uso en Ventas/Facturas

Cuando se registra una venta o factura, los productos vendidos se registran en `detalle_facturas`:

**Flujo:**
1. Se crea una factura/venta con datos generales
2. Se crean registros en `detalle_facturas` con:
   - `id_factura`: ID de la factura
   - `id_producto`: ID del producto vendido
   - `cantidad`: Unidades vendidas
   - `precio_unitario`: Precio de venta unitario
   - `subtotal`: cantidad × precio_unitario
3. El `stock` del producto debe decrementarse automáticamente

**Relación:**
```
DetalleFactura (N) ---> (1) Producto
```

### Campo `stock` y Control de Inventario

El campo `stock` representa la cantidad disponible del producto en inventario:

- **Incremento**: Al registrar una compra
- **Decremento**: Al registrar una venta
- **Alertas**: Cuando `stock < stock_minimo`, se debe generar una alerta de reabastecimiento

**Recomendaciones:**
- Implementar transacciones al actualizar stock para evitar inconsistencias
- Validar que haya stock suficiente antes de permitir una venta
- Considerar agregar un historial de movimientos de stock

### Campo `activo`

El campo `activo` (boolean) permite implementar una "eliminación lógica":

- **activo = true**: El producto está disponible para compras y ventas
- **activo = false**: El producto está deshabilitado pero se mantiene en el sistema para preservar el historial

**Recomendación:** En lugar de usar DELETE, actualizar el campo `activo` a `false` para deshabilitar un producto sin perder el historial.

### Validación de Precios

El sistema valida que:
- `precio_compra >= 0`
- `precio_venta >= 0`
- `precio_venta >= precio_compra`

Esto asegura rentabilidad en las ventas (margen de utilidad positivo o cero).

---

## Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Error de validación en los datos enviados |
| 401 | Unauthorized | Token de autenticación faltante o inválido |
| 403 | Forbidden | Usuario autenticado pero sin permisos suficientes |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error inesperado en el servidor |

---

## Ejemplos de Uso con cURL

### Obtener todos los productos

```bash
curl -X GET "http://localhost:3000/api/productos" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener todos los productos con paginación

```bash
curl -X GET "http://localhost:3000/api/productos?page=1&limit=20" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener un producto específico

```bash
curl -X GET "http://localhost:3000/api/productos/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Crear un nuevo producto

```bash
curl -X POST "http://localhost:3000/api/productos" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cinta Métrica 5m",
    "descripcion": "Cinta métrica retráctil de 5 metros con carcasa resistente",
    "codigo_barra": "7501234567893",
    "id_categoria": 5,
    "precio_compra": 3.50,
    "precio_venta": 5.99,
    "stock": 80,
    "stock_minimo": 20,
    "activo": true
  }'
```

### Actualizar un producto

```bash
curl -X PUT "http://localhost:3000/api/productos/1" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "precio_venta": 13.99,
    "stock": 50
  }'
```

### Deshabilitar un producto (eliminación lógica - RECOMENDADO)

```bash
curl -X PUT "http://localhost:3000/api/productos/3" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "activo": false
  }'
```

### Eliminar un producto (eliminación física)

```bash
curl -X DELETE "http://localhost:3000/api/productos/3" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

---

## Notas para el Equipo de Desarrollo

1. **Actualización Automática de Stock**:
   - **CRÍTICO**: Implementar lógica para actualizar `stock` automáticamente al registrar compras y ventas
   - Al crear un detalle de compra: `stock += cantidad`
   - Al crear un detalle de venta: `stock -= cantidad`
   - Usar transacciones para garantizar consistencia

2. **Validación de Stock en Ventas**:
   - Antes de permitir una venta, validar que `stock >= cantidad_solicitada`
   - Si no hay stock suficiente, retornar error 400 con mensaje claro

3. **Alertas de Stock Bajo**:
   - Implementar endpoint o lógica para obtener productos con `stock < stock_minimo`
   - Útil para reportes de reabastecimiento

4. **Integridad Referencial**:
   - Antes de eliminar un producto, verificar que no existan detalles de compra o venta que lo referencien
   - Considerar agregar restricciones `ON DELETE RESTRICT` en la base de datos

5. **Eliminación Lógica vs Física**:
   - **Actual:** Eliminación física (destruye el registro)
   - **Recomendado:** Usar el campo `activo` para implementar eliminación lógica
   - Preserva el historial y evita problemas de integridad referencial

6. **Código de Barras**:
   - Si se implementa, considerar validar que sea único
   - Útil para sistemas de punto de venta con escáner

7. **Cálculo de Margen de Utilidad**:
   - Margen = `((precio_venta - precio_compra) / precio_compra) × 100`
   - Considerar agregar este cálculo en reportes

8. **Auditoría**:
   - El campo `fecha_registro` ya existe para rastrear cuándo se creó el producto
   - Considerar agregar `updated_at` mediante `timestamps: true` en el modelo

9. **Búsqueda y Filtros**:
   - Considerar agregar endpoints para:
     - Buscar por nombre o descripción
     - Filtrar por categoría
     - Filtrar por estado activo/inactivo
     - Ordenar por precio, stock, etc.

10. **Imágenes de Productos**:
    - Considerar agregar campo `imagen_url` en el modelo
    - Implementar endpoint para subir imágenes de productos

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-11-23 | Versión inicial de la documentación de endpoints de Productos |

---

**Documento base para la wiki técnica del proyecto Ferretería Alessandro**
