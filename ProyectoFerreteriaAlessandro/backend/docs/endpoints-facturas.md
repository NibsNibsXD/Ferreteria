# Documentación de Endpoints - Módulo Facturas

**Fecha de creación:** 2025-11-23
**Autor:** Equipo Backend Ferretería Alessandro
**Versión:** 1.0

---

## Descripción General

Este documento contiene la especificación técnica de los endpoints del módulo de Facturas. Estos endpoints permiten la gestión completa del ciclo de vida de las facturas en el sistema, incluyendo operaciones de creación, consulta, actualización y eliminación (CRUD).

**Nota:** Este documento sirve como base para la wiki y el documento técnico final del proyecto.

### Relaciones del Módulo Factura

El módulo de Factura se relaciona estrechamente con las siguientes entidades:

- **Venta** (`id_venta`): Cada factura está asociada a una venta. La relación es uno a uno (una factura pertenece a una venta).
- **Método de Pago** (`id_metodo_pago`): Define el método de pago utilizado en la factura (efectivo, tarjeta, transferencia, etc.).
- **Cliente** (a través de Venta): El cliente se obtiene a través de la relación Venta → Cliente.
- **Usuario** (a través de Venta): El usuario que registró la venta se obtiene a través de la relación Venta → Usuario.
- **Detalles de Factura** (`detalles`): Relación uno a muchos. Una factura puede tener múltiples detalles que describen los productos/items incluidos.

---

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT. El token debe enviarse en el header de la petición:

```
Authorization: Bearer <token>
```

### Roles de Usuario

- **Rol 1**: Administrador - Acceso completo (crear, actualizar, eliminar facturas)
- **Otros roles**: Solo lectura (consultar facturas)

---

## Endpoints

### 1. Obtener todas las facturas

**Método:** `GET`
**Ruta:** `/api/facturas`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene un listado de todas las facturas registradas en el sistema. Incluye información de las relaciones con venta, cliente, usuario, método de pago y detalles de factura.

#### Parámetros de Query (Opcional)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | Integer | Número de página para paginación | `?page=1` |
| `limit` | Integer | Cantidad de registros por página | `?limit=10` |

**Ejemplo de uso con paginación:**
```
GET /api/facturas?page=1&limit=10
```

**Nota sobre paginación:** La paginación es opcional. Si no se proporcionan los parámetros `page` y `limit`, se retornarán todos los registros. El equipo debe evaluar si convertir la paginación en obligatoria para mejorar el rendimiento cuando el volumen de facturas sea alto.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id_factura": 1,
      "id_venta": 25,
      "No_Reg_Exonerados": "REG-2025-001",
      "Orden_Compra_Exenta": "OC-2025-100",
      "Condiciones_Pago": "Contado",
      "OrdenEstado": "Completada",
      "RTN": "12345678901234",
      "REG_SGA": "SGA-2025-001",
      "subtotal": 1500.00,
      "id_metodo_pago": 1,
      "venta": {
        "id_venta": 25,
        "codigo_factura": "FACT-2025-025",
        "total": 1650.00,
        "fecha": "2025-11-23T10:30:00.000Z",
        "estado": "completada",
        "cliente": {
          "id_cliente": 10,
          "nombre": "Juan Pérez",
          "telefono": "+506 8888-7777"
        },
        "usuario": {
          "id_usuario": 3,
          "nombre": "María González",
          "correo": "maria@ferreteria.com"
        }
      },
      "metodo_pago": {
        "id_metodo_pago": 1,
        "nombre": "Efectivo"
      },
      "detalles": [
        {
          "id_detalle_factura": 1,
          "id_factura": 1,
          "descripcion": "Tornillos 1/4",
          "cantidad": 100,
          "precio_unitario": 15.00
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

### 2. Obtener una factura por ID

**Método:** `GET`
**Ruta:** `/api/facturas/:id`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene los detalles completos de una factura específica mediante su ID, incluyendo todas las relaciones (venta, cliente, usuario, método de pago, detalles).

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la factura |

**Ejemplo:**
```
GET /api/facturas/1
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id_factura": 1,
    "id_venta": 25,
    "No_Reg_Exonerados": "REG-2025-001",
    "Orden_Compra_Exenta": "OC-2025-100",
    "Condiciones_Pago": "Contado",
    "OrdenEstado": "Completada",
    "RTN": "12345678901234",
    "REG_SGA": "SGA-2025-001",
    "subtotal": 1500.00,
    "id_metodo_pago": 1,
    "venta": {
      "id_venta": 25,
      "codigo_factura": "FACT-2025-025",
      "total": 1650.00,
      "fecha": "2025-11-23T10:30:00.000Z",
      "estado": "completada",
      "cliente": {
        "id_cliente": 10,
        "nombre": "Juan Pérez",
        "telefono": "+506 8888-7777",
        "direccion": "San José, Costa Rica",
        "correo": "juan.perez@email.com"
      },
      "usuario": {
        "id_usuario": 3,
        "nombre": "María González",
        "correo": "maria@ferreteria.com"
      }
    },
    "metodo_pago": {
      "id_metodo_pago": 1,
      "nombre": "Efectivo"
    },
    "detalles": [
      {
        "id_detalle_factura": 1,
        "id_factura": 1,
        "descripcion": "Tornillos 1/4",
        "cantidad": 100,
        "precio_unitario": 15.00
      },
      {
        "id_detalle_factura": 2,
        "id_factura": 1,
        "descripcion": "Tuercas 1/4",
        "cantidad": 100,
        "precio_unitario": 10.00
      }
    ]
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 404 | Factura no encontrada |
| 500 | Error interno del servidor |

---

### 3. Crear una nueva factura

**Método:** `POST`
**Ruta:** `/api/facturas`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Registra una nueva factura en el sistema. Valida que la venta especificada exista y que los campos cumplan con las restricciones del modelo.

#### Body (JSON)

```json
{
  "id_venta": 25,
  "No_Reg_Exonerados": "REG-2025-001",
  "Orden_Compra_Exenta": "OC-2025-100",
  "Condiciones_Pago": "Contado",
  "OrdenEstado": "Completada",
  "RTN": "12345678901234",
  "REG_SGA": "SGA-2025-001",
  "subtotal": 1500.00,
  "id_metodo_pago": 1
}
```

#### Campos del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id_venta` | Integer | Sí | ID de la venta asociada (debe existir en la tabla ventas) |
| `No_Reg_Exonerados` | String(100) | No | Número de registro de exonerados |
| `Orden_Compra_Exenta` | String(100) | No | Número de orden de compra exenta |
| `Condiciones_Pago` | String(20) | No | Condiciones de pago (ej: "Contado", "Crédito 30 días") |
| `OrdenEstado` | String(20) | No | Estado de la orden (ej: "Completada", "Pendiente", "Anulada") |
| `RTN` | String(50) | No | Registro Tributario Nacional |
| `REG_SGA` | String(50) | No | Registro del Sistema de Gestión Ambiental |
| `subtotal` | Decimal(10,2) | No | Subtotal de la factura (debe ser ≥ 0 si se proporciona) |
| `id_metodo_pago` | Integer | No | ID del método de pago utilizado |

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Factura creada exitosamente",
  "data": {
    "id_factura": 2,
    "id_venta": 25,
    "No_Reg_Exonerados": "REG-2025-001",
    "Orden_Compra_Exenta": "OC-2025-100",
    "Condiciones_Pago": "Contado",
    "OrdenEstado": "Completada",
    "RTN": "12345678901234",
    "REG_SGA": "SGA-2025-001",
    "subtotal": 1500.00,
    "id_metodo_pago": 1,
    "venta": {
      "id_venta": 25,
      "codigo_factura": "FACT-2025-025",
      "total": 1650.00,
      "fecha": "2025-11-23T10:30:00.000Z",
      "estado": "completada",
      "cliente": {
        "id_cliente": 10,
        "nombre": "Juan Pérez",
        "telefono": "+506 8888-7777",
        "direccion": "San José, Costa Rica",
        "correo": "juan.perez@email.com"
      },
      "usuario": {
        "id_usuario": 3,
        "nombre": "María González",
        "correo": "maria@ferreteria.com"
      }
    },
    "metodo_pago": {
      "id_metodo_pago": 1,
      "nombre": "Efectivo"
    },
    "detalles": []
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

- "El ID de la venta es requerido"
- "El subtotal debe ser mayor o igual a 0"
- "La venta especificada no existe"

---

### 4. Actualizar una factura

**Método:** `PUT`
**Ruta:** `/api/facturas/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Actualiza la información de una factura existente. Todos los campos son opcionales; solo se actualizarán los campos proporcionados en el body.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la factura a actualizar |

#### Body (JSON)

```json
{
  "OrdenEstado": "Anulada",
  "Condiciones_Pago": "Crédito 30 días",
  "subtotal": 1600.00
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos que se envíen en el body.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Factura actualizada exitosamente",
  "data": {
    "id_factura": 1,
    "id_venta": 25,
    "No_Reg_Exonerados": "REG-2025-001",
    "Orden_Compra_Exenta": "OC-2025-100",
    "Condiciones_Pago": "Crédito 30 días",
    "OrdenEstado": "Anulada",
    "RTN": "12345678901234",
    "REG_SGA": "SGA-2025-001",
    "subtotal": 1600.00,
    "id_metodo_pago": 1,
    "venta": {
      "id_venta": 25,
      "codigo_factura": "FACT-2025-025",
      "total": 1650.00,
      "fecha": "2025-11-23T10:30:00.000Z",
      "estado": "completada",
      "cliente": {
        "id_cliente": 10,
        "nombre": "Juan Pérez",
        "telefono": "+506 8888-7777",
        "direccion": "San José, Costa Rica",
        "correo": "juan.perez@email.com"
      },
      "usuario": {
        "id_usuario": 3,
        "nombre": "María González",
        "correo": "maria@ferreteria.com"
      }
    },
    "metodo_pago": {
      "id_metodo_pago": 1,
      "nombre": "Efectivo"
    },
    "detalles": []
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Error de validación - ID de venta no existe |
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Factura no encontrada |
| 500 | Error interno del servidor |

---

### 5. Eliminar una factura

**Método:** `DELETE`
**Ruta:** `/api/facturas/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Elimina permanentemente una factura del sistema. Esta operación es irreversible.

**⚠️ ADVERTENCIA:** Esta operación elimina permanentemente el registro de la base de datos. Considere implementar una eliminación lógica (cambio de estado en OrdenEstado a "Anulada") en lugar de eliminación física para mantener el historial contable y de auditoría.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID de la factura a eliminar |

**Ejemplo:**
```
DELETE /api/facturas/1
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Factura eliminada exitosamente"
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Factura no encontrada |
| 500 | Error interno del servidor |

---

## Relaciones y Consideraciones Técnicas

### Relación Factura - Venta

Cada factura **debe** estar asociada a una venta mediante el campo `id_venta`. Esta es una relación **uno a uno**: una factura pertenece a una sola venta, y una venta puede tener una factura.

```
Factura (1) ---> (1) Venta
```

La venta contiene información fundamental como:
- Cliente
- Usuario que registró la venta
- Total de la venta
- Fecha de la venta
- Estado de la venta

### Relación Factura - Método de Pago

Cada factura puede tener un método de pago asociado mediante `id_metodo_pago`. Los métodos de pago disponibles se configuran en la tabla `metodos_pago`.

```
Factura (N) ---> (1) MetodoPago
```

Métodos de pago típicos:
- Efectivo
- Tarjeta de Crédito
- Tarjeta de Débito
- Transferencia Bancaria
- SINPE Móvil

### Relación Factura - Detalles de Factura

Una factura puede tener múltiples detalles que describen los productos/items individuales:

```
Factura (1) ---> (N) DetalleFactura (N) ---> (1) Producto
```

Cada detalle de factura típicamente contiene:
- Descripción del producto
- Cantidad
- Precio unitario
- Subtotal del item

### Campos Especiales del Modelo

El modelo de Factura incluye varios campos específicos para cumplimiento fiscal y regulatorio en Costa Rica:

- **RTN (Registro Tributario Nacional)**: Identificación fiscal del cliente
- **No_Reg_Exonerados**: Número de registro para clientes exonerados de impuestos
- **Orden_Compra_Exenta**: Número de orden de compra exenta de impuestos
- **REG_SGA**: Registro del Sistema de Gestión Ambiental
- **Condiciones_Pago**: Define si es pago de contado, crédito, etc.
- **OrdenEstado**: Estado actual de la factura (Completada, Pendiente, Anulada)

---

## Paginación

Los endpoints GET que retornan listados soportan paginación mediante query parameters:

- `page`: Número de página (comienza en 1)
- `limit`: Cantidad de registros por página

**Ejemplo:**
```
GET /api/facturas?page=2&limit=20
```

### Estado Actual de la Paginación

**ESTADO:** Paginación opcional (no obligatoria)

Si no se proporcionan los parámetros `page` y `limit`, se retornarán todos los registros.

### TODO: Decisión Pendiente del Equipo

El equipo debe evaluar y decidir si:

1. **Mantener paginación opcional:** Permite flexibilidad pero puede causar problemas de rendimiento con grandes volúmenes de datos.

2. **Hacer paginación obligatoria:** Implementar valores por defecto (ej: `limit=50, page=1`) para mejorar el rendimiento cuando el volumen de facturas sea alto. Esta es la opción recomendada para sistemas de producción.

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

### Obtener todas las facturas

```bash
curl -X GET "http://localhost:3000/api/facturas" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener todas las facturas con paginación

```bash
curl -X GET "http://localhost:3000/api/facturas?page=1&limit=10" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener una factura específica

```bash
curl -X GET "http://localhost:3000/api/facturas/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Crear una nueva factura

```bash
curl -X POST "http://localhost:3000/api/facturas" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "id_venta": 25,
    "No_Reg_Exonerados": "REG-2025-001",
    "Orden_Compra_Exenta": "OC-2025-100",
    "Condiciones_Pago": "Contado",
    "OrdenEstado": "Completada",
    "RTN": "12345678901234",
    "REG_SGA": "SGA-2025-001",
    "subtotal": 1500.00,
    "id_metodo_pago": 1
  }'
```

### Actualizar una factura

```bash
curl -X PUT "http://localhost:3000/api/facturas/1" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "OrdenEstado": "Anulada",
    "Condiciones_Pago": "Crédito 30 días"
  }'
```

### Eliminar una factura

```bash
curl -X DELETE "http://localhost:3000/api/facturas/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

---

## Notas para el Equipo de Desarrollo

1. **Validación de Integridad Referencial**: El servicio ya valida que la venta exista antes de crear/actualizar una factura. Considerar agregar validación similar para el método de pago.

2. **Transacciones**: Para operaciones que involucren crear la factura junto con sus detalles, se recomienda usar transacciones de base de datos para garantizar la integridad.

3. **Auditoría**: Considerar agregar campos `created_at` y `updated_at` mediante `timestamps: true` en el modelo Sequelize para rastrear cuándo se creó y modificó cada factura.

4. **Eliminación Lógica vs Física**:
   - **Actual:** Eliminación física (destruye el registro)
   - **Recomendado:** Implementar eliminación lógica cambiando el campo `OrdenEstado` a "Anulada" en lugar de eliminar el registro. Esto es crítico para mantener el historial contable y cumplir con regulaciones fiscales.

5. **Cálculo Automático del Subtotal**: Si se implementan detalles de factura, considerar calcular automáticamente el campo `subtotal` en base a la suma de los detalles, en lugar de permitir que se envíe manualmente.

6. **Estados de Factura**: Definir claramente los posibles valores del campo `OrdenEstado`:
   - "Completada" - Factura emitida y válida
   - "Pendiente" - Factura en proceso
   - "Anulada" - Factura cancelada
   - Otros según necesidades del negocio

7. **Validación de RTN**: Considerar agregar validación del formato del RTN según las normas de Costa Rica (14 dígitos).

8. **Campos de Fechas**: El modelo actual no tiene campo de fecha de emisión. Considerar agregar `fecha_emision` y `fecha_vencimiento` si se manejan facturas a crédito.

9. **Numeración de Facturas**: Considerar implementar un sistema de numeración secuencial automática para las facturas, cumpliendo con regulaciones fiscales locales.

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-11-23 | Versión inicial de la documentación de endpoints de Facturas |

---

**Documento base para la wiki técnica del proyecto Ferretería Alessandro**
