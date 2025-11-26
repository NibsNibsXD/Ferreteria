# Documentación de Endpoints - Módulo Compras

**Fecha de creación:** 2025-11-23
**Autor:** Equipo Backend Ferretería Alessandro
**Versión:** 1.0

---

## Descripción General

Este documento contiene la especificación técnica de los endpoints del módulo de Compras. Estos endpoints permiten la gestión completa del ciclo de vida de las compras en el sistema, incluyendo operaciones de creación, consulta, actualización y eliminación (CRUD).

**Nota:** Este documento sirve como base para la wiki y el documento técnico final del proyecto.

### Relaciones del Módulo Compra

El módulo de Compra se relaciona estrechamente con las siguientes entidades:

- **Usuario** (`id_usuario`): Identifica al usuario que registró la compra.
- **Proveedor**: A nivel conceptual, las compras están relacionadas con proveedores (aunque no se refleja directamente en el modelo actual, es importante documentarlo para futuras iteraciones).
- **Productos** (a través de DetalleCompra): Los productos comprados se gestionan mediante la tabla de detalles.
- **Detalle de Compra** (`detalles`): Relación uno a muchos. Una compra puede tener múltiples detalles que describen los productos/items incluidos, con cantidad, precio unitario y subtotal.
- **Inventario**: Conceptualmente, al registrar una compra, el inventario de productos debería actualizarse (aumentar stock). Esta lógica puede implementarse a nivel de servicio o mediante triggers en la base de datos.

---

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT. El token debe enviarse en el header de la petición:

```
Authorization: Bearer <token>
```

### Roles de Usuario

- **Rol 1**: Administrador - Acceso completo (crear, actualizar, eliminar compras)
- **Otros roles**: Solo lectura (consultar compras)

---

## Endpoints

### 1. Obtener todas las compras

**Método:** `GET`
**Ruta:** `/api/compras`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene un listado de todas las compras registradas en el sistema. Incluye información de las relaciones con usuario, productos (a través de detalles) y cada detalle de compra.

#### Parámetros de Query (Opcional)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | Integer | Número de página para paginación | `?page=1` |
| `limit` | Integer | Cantidad de registros por página | `?limit=10` |

**Ejemplo de uso con paginación:**
```
GET /api/compras?page=1&limit=10
```

**Nota sobre paginación:** La paginación es opcional. Si no se proporcionan los parámetros `page` y `limit`, se retornarán todos los registros. El equipo debe evaluar si convertir la paginación en obligatoria para mejorar el rendimiento cuando el volumen de compras sea alto.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id_compra": 1,
      "id_usuario": 3,
      "fecha": "2025-11-23T08:00:00.000Z",
      "total": 5000.00,
      "usuario": {
        "id_usuario": 3,
        "nombre": "María González",
        "correo": "maria@ferreteria.com"
      },
      "detalles": [
        {
          "id_detalle": 1,
          "id_compra": 1,
          "id_producto": 15,
          "cantidad": 50,
          "precio_unitario": 80.00,
          "subtotal": 4000.00,
          "producto": {
            "id_producto": 15,
            "nombre": "Tornillos 1/4",
            "codigo": "TOR-001"
          }
        },
        {
          "id_detalle": 2,
          "id_compra": 1,
          "id_producto": 16,
          "cantidad": 50,
          "precio_unitario": 20.00,
          "subtotal": 1000.00,
          "producto": {
            "id_producto": 16,
            "nombre": "Tuercas 1/4",
            "codigo": "TUE-001"
          }
        }
      ]
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

### 2. Obtener una compra por ID

**Método:** `GET`
**Ruta:** `/api/compras/:id`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene los detalles completos de una compra específica mediante su ID, incluyendo todas las relaciones (usuario, detalles con productos).

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la compra |

**Ejemplo:**
```
GET /api/compras/1
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id_compra": 1,
    "id_usuario": 3,
    "fecha": "2025-11-23T08:00:00.000Z",
    "total": 5000.00,
    "usuario": {
      "id_usuario": 3,
      "nombre": "María González",
      "correo": "maria@ferreteria.com"
    },
    "detalles": [
      {
        "id_detalle": 1,
        "id_compra": 1,
        "id_producto": 15,
        "cantidad": 50,
        "precio_unitario": 80.00,
        "subtotal": 4000.00,
        "producto": {
          "id_producto": 15,
          "nombre": "Tornillos 1/4",
          "codigo": "TOR-001",
          "descripcion": "Tornillos de acero inoxidable 1/4 pulgada"
        }
      },
      {
        "id_detalle": 2,
        "id_compra": 1,
        "id_producto": 16,
        "cantidad": 50,
        "precio_unitario": 20.00,
        "subtotal": 1000.00,
        "producto": {
          "id_producto": 16,
          "nombre": "Tuercas 1/4",
          "codigo": "TUE-001",
          "descripcion": "Tuercas de acero inoxidable 1/4 pulgada"
        }
      }
    ]
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 404 | Compra no encontrada |
| 500 | Error interno del servidor |

---

### 3. Registrar una nueva compra

**Método:** `POST`
**Ruta:** `/api/compras`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Registra una nueva compra en el sistema. Permite incluir los detalles de la compra (productos, cantidades, precios) en la misma petición.

**Nota importante:** Al registrar una compra, conceptualmente debería actualizarse el inventario de los productos comprados (aumentar el stock). Esta lógica puede implementarse en el servicio o mediante triggers de base de datos.

#### Body (JSON)

```json
{
  "id_usuario": 3,
  "total": 5000.00,
  "fecha": "2025-11-23T08:00:00.000Z",
  "detalles": [
    {
      "id_producto": 15,
      "cantidad": 50,
      "precio_unitario": 80.00
    },
    {
      "id_producto": 16,
      "cantidad": 50,
      "precio_unitario": 20.00
    }
  ]
}
```

#### Campos del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id_usuario` | Integer | No | ID del usuario que registra la compra (puede ser null) |
| `total` | Decimal(10,2) | Sí | Monto total de la compra (debe ser ≥ 0) |
| `fecha` | DateTime | No | Fecha de la compra (por defecto: fecha actual) |
| `detalles` | Array | No | Arreglo de objetos con los detalles de la compra |
| `detalles[].id_producto` | Integer | Sí (si se envían detalles) | ID del producto comprado |
| `detalles[].cantidad` | Integer | Sí (si se envían detalles) | Cantidad de unidades compradas |
| `detalles[].precio_unitario` | Decimal(10,2) | Sí (si se envían detalles) | Precio unitario de compra |

**Nota sobre detalles:** El campo `subtotal` se calcula automáticamente como `cantidad * precio_unitario`.

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Compra registrada exitosamente",
  "data": {
    "id_compra": 2,
    "id_usuario": 3,
    "fecha": "2025-11-23T08:00:00.000Z",
    "total": 5000.00,
    "usuario": {
      "id_usuario": 3,
      "nombre": "María González",
      "correo": "maria@ferreteria.com"
    },
    "detalles": [
      {
        "id_detalle": 3,
        "id_compra": 2,
        "id_producto": 15,
        "cantidad": 50,
        "precio_unitario": 80.00,
        "subtotal": 4000.00,
        "producto": {
          "id_producto": 15,
          "nombre": "Tornillos 1/4",
          "codigo": "TOR-001",
          "descripcion": "Tornillos de acero inoxidable 1/4 pulgada"
        }
      },
      {
        "id_detalle": 4,
        "id_compra": 2,
        "id_producto": 16,
        "cantidad": 50,
        "precio_unitario": 20.00,
        "subtotal": 1000.00,
        "producto": {
          "id_producto": 16,
          "nombre": "Tuercas 1/4",
          "codigo": "TUE-001",
          "descripcion": "Tuercas de acero inoxidable 1/4 pulgada"
        }
      }
    ]
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

- "El total de la compra es requerido y debe ser mayor o igual a 0"
- "Los detalles deben ser un arreglo"

---

### 4. Actualizar una compra

**Método:** `PUT`
**Ruta:** `/api/compras/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Actualiza la información de una compra existente. Todos los campos son opcionales; solo se actualizarán los campos proporcionados en el body.

**Nota:** Esta operación no actualiza los detalles de la compra. Para modificar detalles, se recomienda gestionarlos en endpoints específicos o considerar una estrategia de versionado de compras.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la compra a actualizar |

#### Body (JSON)

```json
{
  "total": 5500.00,
  "fecha": "2025-11-23T09:00:00.000Z"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos que se envíen en el body.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Compra actualizada exitosamente",
  "data": {
    "id_compra": 1,
    "id_usuario": 3,
    "fecha": "2025-11-23T09:00:00.000Z",
    "total": 5500.00,
    "usuario": {
      "id_usuario": 3,
      "nombre": "María González",
      "correo": "maria@ferreteria.com"
    },
    "detalles": [
      {
        "id_detalle": 1,
        "id_compra": 1,
        "id_producto": 15,
        "cantidad": 50,
        "precio_unitario": 80.00,
        "subtotal": 4000.00,
        "producto": {
          "id_producto": 15,
          "nombre": "Tornillos 1/4",
          "codigo": "TOR-001",
          "descripcion": "Tornillos de acero inoxidable 1/4 pulgada"
        }
      }
    ]
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Compra no encontrada |
| 500 | Error interno del servidor |

---

### 5. Eliminar una compra

**Método:** `DELETE`
**Ruta:** `/api/compras/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Elimina permanentemente una compra del sistema, incluyendo todos sus detalles asociados. Esta operación es irreversible.

**⚠️ ADVERTENCIA:** Esta operación elimina permanentemente el registro de la base de datos. Considere:
- Implementar una eliminación lógica (campo `estado` o `activo`) en lugar de eliminación física para mantener el historial.
- Evaluar el impacto en el inventario: ¿se debe revertir el aumento de stock que se hizo al registrar la compra?

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la compra a eliminar |

**Ejemplo:**
```
DELETE /api/compras/1
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Compra eliminada exitosamente"
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Compra no encontrada |
| 500 | Error interno del servidor |

---

## Relaciones y Consideraciones Técnicas

### Relación Compra - Usuario

Cada compra puede estar asociada a un usuario mediante el campo `id_usuario`. El usuario representa a la persona que registró la compra en el sistema.

```
Compra (N) ---> (1) Usuario
```

### Relación Compra - Proveedor

**Nota conceptual:** Aunque el modelo actual no incluye un campo `id_proveedor`, en un sistema de ferretería completo, cada compra debería estar asociada a un proveedor. Se recomienda evaluar agregar esta relación en futuras iteraciones:

```
Compra (N) ---> (1) Proveedor (PENDIENTE DE IMPLEMENTAR)
```

### Relación Compra - Detalle de Compra - Producto

Una compra puede tener múltiples detalles, y cada detalle está asociado a un producto específico:

```
Compra (1) ---> (N) DetalleCompra (N) ---> (1) Producto
```

Cada detalle de compra contiene:
- **id_producto**: Producto comprado
- **cantidad**: Cantidad de unidades
- **precio_unitario**: Precio unitario de compra
- **subtotal**: Calculado automáticamente como `cantidad * precio_unitario`

### Relación Compra - Inventario

**Importante:** Al registrar una compra, el inventario de los productos comprados debería actualizarse automáticamente (aumentar stock). Esta lógica puede implementarse:

1. **A nivel de servicio**: En el método `createCompra`, después de crear los detalles, actualizar la tabla de inventario.
2. **Mediante triggers de base de datos**: Crear un trigger que se ejecute al insertar registros en `detalle_compras` y actualice el inventario.
3. **Mediante eventos del sistema**: Emitir un evento "CompraCreada" que sea escuchado por un servicio de inventario.

**Recomendación:** Implementar la lógica a nivel de servicio para mayor control y facilidad de mantenimiento.

### Transacciones

Es **crítico** que las operaciones de creación y eliminación de compras se ejecuten dentro de transacciones de base de datos para garantizar la integridad:

- **Al crear una compra:** La compra y todos sus detalles deben crearse atómicamente. Si falla la creación de algún detalle, debe revertirse toda la operación.
- **Al eliminar una compra:** Primero deben eliminarse los detalles, luego la compra. Si el inventario se actualiza, esto también debe ser parte de la transacción.

---

## Paginación

Los endpoints GET que retornan listados soportan paginación mediante query parameters:

- `page`: Número de página (comienza en 1)
- `limit`: Cantidad de registros por página

**Ejemplo:**
```
GET /api/compras?page=2&limit=20
```

### Estado Actual de la Paginación

**ESTADO:** Paginación opcional (no obligatoria)

Si no se proporcionan los parámetros `page` y `limit`, se retornarán todos los registros.

### TODO: Decisión Pendiente del Equipo

El equipo debe evaluar y decidir si:

1. **Mantener paginación opcional:** Permite flexibilidad pero puede causar problemas de rendimiento con grandes volúmenes de datos.

2. **Hacer paginación obligatoria:** Implementar valores por defecto (ej: `limit=50, page=1`) para mejorar el rendimiento cuando el volumen de compras sea alto. Esta es la opción recomendada para sistemas de producción.

**Recomendación:** Implementar paginación obligatoria con `limit` por defecto de 50 registros.

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

### Obtener todas las compras

```bash
curl -X GET "http://localhost:3000/api/compras" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener todas las compras con paginación

```bash
curl -X GET "http://localhost:3000/api/compras?page=1&limit=10" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener una compra específica

```bash
curl -X GET "http://localhost:3000/api/compras/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Registrar una nueva compra

```bash
curl -X POST "http://localhost:3000/api/compras" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 3,
    "total": 5000.00,
    "fecha": "2025-11-23T08:00:00.000Z",
    "detalles": [
      {
        "id_producto": 15,
        "cantidad": 50,
        "precio_unitario": 80.00
      },
      {
        "id_producto": 16,
        "cantidad": 50,
        "precio_unitario": 20.00
      }
    ]
  }'
```

### Actualizar una compra

```bash
curl -X PUT "http://localhost:3000/api/compras/1" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "total": 5500.00
  }'
```

### Eliminar una compra

```bash
curl -X DELETE "http://localhost:3000/api/compras/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

---

## Notas para el Equipo de Desarrollo

1. **Relación con Proveedor**: El modelo actual no incluye `id_proveedor`. Se recomienda evaluar agregar este campo y su relación correspondiente en futuras iteraciones.

2. **Actualización de Inventario**:
   - **CRÍTICO:** Implementar la lógica de actualización de inventario al registrar compras.
   - Al crear una compra, el stock de los productos en `detalles` debe incrementarse.
   - Al eliminar una compra, evaluar si se debe revertir el inventario (recomendado: usar eliminación lógica en lugar de física).

3. **Transacciones**:
   - Todas las operaciones de creación y eliminación deben ejecutarse dentro de transacciones de base de datos.
   - Esto garantiza que si falla alguna parte del proceso, se revierta toda la operación.

4. **Cálculo Automático del Total**:
   - Considerar calcular automáticamente el campo `total` de la compra en base a la suma de los `subtotal` de los detalles.
   - Esto evita inconsistencias entre el total registrado y la suma de los detalles.

5. **Validación de Productos**:
   - Al crear detalles de compra, validar que los productos existan en la base de datos.
   - Considerar validar que los productos estén activos antes de permitir su compra.

6. **Auditoría**:
   - Considerar agregar campos `created_at` y `updated_at` mediante `timestamps: true` en el modelo Sequelize.
   - Esto permite rastrear cuándo se creó y modificó cada compra.

7. **Eliminación Lógica vs Física**:
   - **Actual:** Eliminación física (destruye el registro y sus detalles)
   - **Recomendado:** Implementar eliminación lógica agregando un campo `estado` o `activo` al modelo. Cambiar el estado a "anulada" o "inactiva" en lugar de eliminar.

8. **Estados de Compra**:
   - Considerar agregar un campo `estado` al modelo Compra con valores como:
     - "completada" - Compra finalizada y stock actualizado
     - "pendiente" - Compra registrada pero pendiente de recepción
     - "anulada" - Compra cancelada
     - "en_tránsito" - Productos en camino

9. **Gestión de Detalles**:
   - Actualmente, los detalles solo pueden crearse junto con la compra.
   - Considerar implementar endpoints específicos para gestionar detalles de manera individual si es necesario.

10. **Integración con Módulo de Productos**:
    - Asegurar que la tabla de productos tenga campos de inventario/stock.
    - Implementar lógica para actualizar el stock al registrar compras.

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-11-23 | Versión inicial de la documentación de endpoints de Compras |

---

**Documento base para la wiki técnica del proyecto Ferretería Alessandro**
