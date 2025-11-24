# Documentación de Endpoints - Módulo Venta

**Fecha de creación:** 2025-11-23
**Autor:** Equipo Backend Ferretería Alessandro
**Versión:** 1.0

---

## Descripción General

Este documento contiene la especificación técnica de los endpoints del módulo de Venta. Estos endpoints permiten la gestión completa del ciclo de vida de las ventas en el sistema, incluyendo operaciones de creación, consulta, actualización y eliminación (CRUD).

### Relaciones del Módulo Venta

El módulo de Venta se relaciona con las siguientes entidades:

- **Usuario** (`id_usuario`): Identifica al usuario que registró la venta
- **Cliente** (`id_cliente`): Identifica al cliente que realizó la compra
- **Método de Pago** (`id_metodo_pago`): Define el método de pago utilizado (efectivo, tarjeta, transferencia, etc.)
- **Factura** (`id_venta` en tabla facturas): Relación uno a uno con la factura generada para esta venta
- **Detalles de Venta**: Tabla relacionada que contiene los productos/items incluidos en la venta (si aplica según modelo de datos)

---

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT. El token debe enviarse en el header de la petición:

```
Authorization: Bearer <token>
```

### Roles de Usuario

- **Rol 1**: Administrador - Acceso completo (crear, actualizar, eliminar ventas)
- **Otros roles**: Solo lectura (consultar ventas)

---

## Endpoints

### 1. Obtener todas las ventas

**Método:** `GET`
**Ruta:** `/api/ventas`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene un listado de todas las ventas registradas en el sistema. Incluye información de las relaciones con usuario, cliente, método de pago y factura.

#### Parámetros de Query (Opcional)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | Integer | Número de página para paginación | `?page=1` |
| `limit` | Integer | Cantidad de registros por página | `?limit=10` |

**Ejemplo de uso con paginación:**
```
GET /api/ventas?page=1&limit=10
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id_venta": 1,
      "codigo_factura": "FACT-2025-001",
      "id_usuario": 5,
      "id_cliente": 12,
      "fecha": "2025-11-23T14:30:00.000Z",
      "id_metodo_pago": 1,
      "total": 1250.50,
      "estado": "completada",
      "usuario": {
        "id_usuario": 5,
        "nombre": "Juan Pérez",
        "correo": "juan.perez@ferreteria.com"
      },
      "cliente": {
        "id_cliente": 12,
        "nombre": "María González",
        "telefono": "+506 8888-9999"
      },
      "metodo_pago": {
        "id_metodo_pago": 1,
        "nombre": "Efectivo"
      },
      "factura": {
        "id_factura": 45,
        "id_venta": 1,
        "numero_factura": "FACT-2025-001",
        "fecha_emision": "2025-11-23T14:30:00.000Z"
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

### 2. Obtener una venta por ID

**Método:** `GET`
**Ruta:** `/api/ventas/:id`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene los detalles completos de una venta específica mediante su ID, incluyendo todas las relaciones.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la venta |

**Ejemplo:**
```
GET /api/ventas/1
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id_venta": 1,
    "codigo_factura": "FACT-2025-001",
    "id_usuario": 5,
    "id_cliente": 12,
    "fecha": "2025-11-23T14:30:00.000Z",
    "id_metodo_pago": 1,
    "total": 1250.50,
    "estado": "completada",
    "usuario": {
      "id_usuario": 5,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@ferreteria.com"
    },
    "cliente": {
      "id_cliente": 12,
      "nombre": "María González",
      "telefono": "+506 8888-9999",
      "direccion": "San José, Costa Rica"
    },
    "metodo_pago": {
      "id_metodo_pago": 1,
      "nombre": "Efectivo"
    },
    "factura": {
      "id_factura": 45,
      "id_venta": 1,
      "numero_factura": "FACT-2025-001",
      "fecha_emision": "2025-11-23T14:30:00.000Z"
    }
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 404 | Venta no encontrada |
| 500 | Error interno del servidor |

---

### 3. Registrar una nueva venta

**Método:** `POST`
**Ruta:** `/api/ventas`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Registra una nueva venta en el sistema. Valida que el código de factura sea único y que los campos requeridos estén presentes.

#### Body (JSON)

```json
{
  "codigo_factura": "FACT-2025-002",
  "id_usuario": 5,
  "id_cliente": 15,
  "id_metodo_pago": 2,
  "total": 3500.00,
  "fecha": "2025-11-23T15:00:00.000Z",
  "estado": "completada"
}
```

#### Campos del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `codigo_factura` | String(50) | Sí | Código único de la factura |
| `id_usuario` | Integer | No | ID del usuario que registra la venta (puede ser null) |
| `id_cliente` | Integer | No | ID del cliente (puede ser null para venta genérica) |
| `id_metodo_pago` | Integer | Sí | ID del método de pago utilizado |
| `total` | Decimal(10,2) | Sí | Monto total de la venta (≥ 0) |
| `fecha` | DateTime | No | Fecha de la venta (por defecto: fecha actual) |
| `estado` | String(20) | No | Estado de la venta (por defecto: "completada") |

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Venta registrada exitosamente",
  "data": {
    "id_venta": 2,
    "codigo_factura": "FACT-2025-002",
    "id_usuario": 5,
    "id_cliente": 15,
    "fecha": "2025-11-23T15:00:00.000Z",
    "id_metodo_pago": 2,
    "total": 3500.00,
    "estado": "completada",
    "usuario": {
      "id_usuario": 5,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@ferreteria.com"
    },
    "cliente": {
      "id_cliente": 15,
      "nombre": "Carlos Rodríguez",
      "telefono": "+506 7777-8888",
      "direccion": "Heredia, Costa Rica"
    },
    "metodo_pago": {
      "id_metodo_pago": 2,
      "nombre": "Tarjeta de Crédito"
    },
    "factura": null
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

- "El código de factura es requerido"
- "El método de pago es requerido"
- "El total de la venta es requerido y debe ser mayor o igual a 0"
- "Ya existe una venta con ese código de factura"

---

### 4. Actualizar una venta

**Método:** `PUT`
**Ruta:** `/api/ventas/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Actualiza la información de una venta existente. Todos los campos son opcionales; solo se actualizarán los campos proporcionados en el body.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la venta a actualizar |

#### Body (JSON)

```json
{
  "codigo_factura": "FACT-2025-002-MOD",
  "id_cliente": 16,
  "id_metodo_pago": 3,
  "total": 3750.00,
  "estado": "anulada"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos que se envíen en el body.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Venta actualizada exitosamente",
  "data": {
    "id_venta": 2,
    "codigo_factura": "FACT-2025-002-MOD",
    "id_usuario": 5,
    "id_cliente": 16,
    "fecha": "2025-11-23T15:00:00.000Z",
    "id_metodo_pago": 3,
    "total": 3750.00,
    "estado": "anulada",
    "usuario": {
      "id_usuario": 5,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@ferreteria.com"
    },
    "cliente": {
      "id_cliente": 16,
      "nombre": "Ana Martínez",
      "telefono": "+506 6666-7777",
      "direccion": "Alajuela, Costa Rica"
    },
    "metodo_pago": {
      "id_metodo_pago": 3,
      "nombre": "Transferencia Bancaria"
    },
    "factura": null
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Error de validación - Código de factura duplicado |
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Venta no encontrada |
| 500 | Error interno del servidor |

---

### 5. Eliminar una venta

**Método:** `DELETE`
**Ruta:** `/api/ventas/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Elimina permanentemente una venta del sistema. Esta operación es irreversible.

**⚠️ ADVERTENCIA:** Esta operación elimina permanentemente el registro de la base de datos. Considere implementar una eliminación lógica (cambio de estado) en lugar de eliminación física para mantener el historial.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la venta a eliminar |

**Ejemplo:**
```
DELETE /api/ventas/2
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Venta eliminada exitosamente"
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Venta no encontrada |
| 500 | Error interno del servidor |

---

## Relaciones y Consideraciones Técnicas

### Relación con Factura

Cada venta puede tener **una factura** asociada mediante la relación `hasOne` en el modelo. La factura se genera automáticamente o mediante un proceso separado y se vincula a la venta mediante el campo `id_venta` en la tabla `facturas`.

```
Venta (1) ---> (1) Factura
```

### Relación con Método de Pago

Cada venta **debe** tener un método de pago asociado. Los métodos de pago disponibles se configuran en la tabla `metodos_pago` y pueden incluir:

- Efectivo
- Tarjeta de Crédito
- Tarjeta de Débito
- Transferencia Bancaria
- SINPE Móvil
- Otros

```
Venta (N) ---> (1) MetodoPago
```

### Relación con Detalles de Venta

Aunque no se muestra explícitamente en el modelo de venta actual, típicamente existe una tabla `detalles_venta` o similar que contiene los productos/items individuales que componen la venta:

```
Venta (1) ---> (N) DetalleVenta (N) ---> (1) Producto
```

Esta relación permite rastrear qué productos específicos se vendieron, en qué cantidades y a qué precio unitario.

---

## Paginación

Los endpoints GET que retornan listados soportan paginación mediante query parameters:

- `page`: Número de página (comienza en 1)
- `limit`: Cantidad de registros por página

**Ejemplo:**
```
GET /api/ventas?page=2&limit=20
```

Si no se proporcionan estos parámetros, se retornarán todos los registros (sin paginación).

### Recomendaciones del Equipo

El equipo debe evaluar si implementar paginación **obligatoria** con valores por defecto (ej: `limit=50`) para mejorar el rendimiento cuando el volumen de ventas sea alto.

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

### Obtener todas las ventas

```bash
curl -X GET "http://localhost:3000/api/ventas" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener todas las ventas con paginación

```bash
curl -X GET "http://localhost:3000/api/ventas?page=1&limit=10" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener una venta específica

```bash
curl -X GET "http://localhost:3000/api/ventas/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Registrar una nueva venta

```bash
curl -X POST "http://localhost:3000/api/ventas" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_factura": "FACT-2025-003",
    "id_usuario": 5,
    "id_cliente": 20,
    "id_metodo_pago": 1,
    "total": 2500.00,
    "estado": "completada"
  }'
```

### Actualizar una venta

```bash
curl -X PUT "http://localhost:3000/api/ventas/1" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "total": 2750.00,
    "estado": "completada"
  }'
```

### Eliminar una venta

```bash
curl -X DELETE "http://localhost:3000/api/ventas/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

---

## Notas para el Equipo de Desarrollo

1. **Validación de Integridad Referencial**: Antes de crear una venta, considerar validar que existan los registros relacionados (usuario, cliente, método de pago).

2. **Transacciones**: Para operaciones que involucren crear la venta junto con sus detalles y factura, se recomienda usar transacciones de base de datos para garantizar la integridad.

3. **Auditoría**: Considerar agregar campos `created_at` y `updated_at` mediante `timestamps: true` en el modelo Sequelize para rastrear cuándo se creó y modificó cada venta.

4. **Eliminación Lógica**: Evaluar implementar soft delete (eliminación lógica) en lugar de eliminación física para mantener el historial de ventas.

5. **Cálculo Automático del Total**: Si se implementan detalles de venta, considerar calcular automáticamente el campo `total` en base a la suma de los detalles, en lugar de permitir que se envíe manualmente.

6. **Estados de Venta**: Definir claramente los posibles estados de una venta (completada, pendiente, anulada, etc.) y documentarlos.

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-11-23 | Versión inicial de la documentación de endpoints de Venta |

---

**Documento base para la wiki técnica del proyecto Ferretería Alessandro**
