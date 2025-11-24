# Documentación de Endpoints - Módulo Métodos de Pago

**Fecha de creación:** 2025-11-23
**Autor:** Equipo Backend Ferretería Alessandro
**Versión:** 1.0

---

## Descripción General

Este documento contiene la especificación técnica de los endpoints del módulo de Métodos de Pago. Estos endpoints permiten la gestión completa de los métodos de pago disponibles en el sistema, incluyendo operaciones de creación, consulta, actualización y eliminación (CRUD).

**Nota:** Este documento sirve como base para la wiki y el documento técnico final del proyecto.

### Importancia del Módulo Métodos de Pago

Los métodos de pago son un componente fundamental del sistema de ferretería, ya que definen las formas en que los clientes pueden pagar sus compras. Este módulo se relaciona directamente con:

- **Ventas**: Cada venta registrada debe especificar el método de pago utilizado mediante `id_metodo_pago`
- **Facturas**: Las facturas también pueden incluir referencia al método de pago usado en la transacción
- **Reportes**: Los métodos de pago permiten generar reportes financieros y estadísticas de preferencias de pago

### Relaciones del Módulo Método de Pago

- **Ventas** (`id_metodo_pago` en tabla ventas): Relación uno a muchos. Un método de pago puede estar asociado a múltiples ventas.
- **Facturas** (`id_metodo_pago` en tabla factura): Relación uno a muchos. Un método de pago puede estar asociado a múltiples facturas.

```
MetodoPago (1) ---> (N) Venta
MetodoPago (1) ---> (N) Factura
```

---

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT. El token debe enviarse en el header de la petición:

```
Authorization: Bearer <token>
```

### Roles de Usuario

- **Rol 1**: Administrador - Acceso completo (crear, actualizar, eliminar métodos de pago)
- **Otros roles**: Solo lectura (consultar métodos de pago)

---

## Endpoints

### 1. Obtener todos los métodos de pago

**Método:** `GET`
**Ruta:** `/api/metodos-pago`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene un listado de todos los métodos de pago registrados en el sistema, ordenados por ID de forma ascendente.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id_metodo_pago": 1,
      "nombre": "Efectivo",
      "descripcion": "Pago en efectivo al momento de la compra",
      "activo": true
    },
    {
      "id_metodo_pago": 2,
      "nombre": "Tarjeta de Crédito",
      "descripcion": "Visa, MasterCard, American Express",
      "activo": true
    },
    {
      "id_metodo_pago": 3,
      "nombre": "Tarjeta de Débito",
      "descripcion": "Tarjetas de débito bancarias",
      "activo": true
    },
    {
      "id_metodo_pago": 4,
      "nombre": "Transferencia Bancaria",
      "descripcion": "Transferencia electrónica bancaria",
      "activo": true
    },
    {
      "id_metodo_pago": 5,
      "nombre": "SINPE Móvil",
      "descripcion": "Sistema de pagos móviles de Costa Rica",
      "activo": true
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

### 2. Obtener un método de pago por ID

**Método:** `GET`
**Ruta:** `/api/metodos-pago/:id`
**Autenticación:** Requerida
**Rol requerido:** Cualquier usuario autenticado

#### Descripción
Obtiene los detalles de un método de pago específico mediante su ID.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID del método de pago |

**Ejemplo:**
```
GET /api/metodos-pago/1
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id_metodo_pago": 1,
    "nombre": "Efectivo",
    "descripcion": "Pago en efectivo al momento de la compra",
    "activo": true
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 404 | Método de pago no encontrado |
| 500 | Error interno del servidor |

---

### 3. Crear un nuevo método de pago

**Método:** `POST`
**Ruta:** `/api/metodos-pago`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Registra un nuevo método de pago en el sistema. El nombre del método debe ser único.

#### Body (JSON)

```json
{
  "nombre": "PayPal",
  "descripcion": "Pagos en línea mediante PayPal",
  "activo": true
}
```

#### Campos del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | String(50) | Sí | Nombre del método de pago (debe ser único) |
| `descripcion` | Text | No | Descripción detallada del método de pago |
| `activo` | Boolean | No | Estado activo/inactivo (por defecto: true) |

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Método de pago creado exitosamente",
  "data": {
    "id_metodo_pago": 6,
    "nombre": "PayPal",
    "descripcion": "Pagos en línea mediante PayPal",
    "activo": true
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

- "El nombre del método de pago es requerido"
- "Ya existe un método de pago con ese nombre"

---

### 4. Actualizar un método de pago

**Método:** `PUT`
**Ruta:** `/api/metodos-pago/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Actualiza la información de un método de pago existente. Todos los campos son opcionales; solo se actualizarán los campos proporcionados en el body.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID del método de pago a actualizar |

#### Body (JSON)

```json
{
  "nombre": "PayPal Internacional",
  "descripcion": "Pagos en línea mediante PayPal, acepta múltiples monedas",
  "activo": true
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos que se envíen en el body.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Método de pago actualizado exitosamente",
  "data": {
    "id_metodo_pago": 6,
    "nombre": "PayPal Internacional",
    "descripcion": "Pagos en línea mediante PayPal, acepta múltiples monedas",
    "activo": true
  }
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Error de validación - Nombre duplicado |
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Método de pago no encontrado |
| 500 | Error interno del servidor |

---

### 5. Eliminar un método de pago

**Método:** `DELETE`
**Ruta:** `/api/metodos-pago/:id`
**Autenticación:** Requerida
**Rol requerido:** Administrador (Rol 1)

#### Descripción
Elimina permanentemente un método de pago del sistema. Esta operación es irreversible.

**⚠️ ADVERTENCIA:**
- Esta operación elimina permanentemente el registro de la base de datos.
- **IMPORTANTE**: Antes de eliminar un método de pago, asegúrate de que no esté siendo utilizado en ventas o facturas existentes, ya que esto podría causar problemas de integridad referencial.
- Considera implementar una eliminación lógica (cambiar el campo `activo` a `false`) en lugar de eliminación física para mantener el historial y la integridad de datos.

#### Parámetros de Ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | Integer | ID del método de pago a eliminar |

**Ejemplo:**
```
DELETE /api/metodos-pago/6
```

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Método de pago eliminado exitosamente"
}
```

#### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401 | Sin autenticación - Token no proporcionado o inválido |
| 403 | Sin autorización - Usuario no tiene rol de administrador |
| 404 | Método de pago no encontrado |
| 500 | Error interno del servidor (puede incluir errores de integridad referencial) |

---

## Relaciones y Consideraciones Técnicas

### Uso en Ventas

El módulo de Métodos de Pago es utilizado por el módulo de Ventas para registrar cómo pagó el cliente. En la tabla `ventas`, el campo `id_metodo_pago` hace referencia al ID del método de pago utilizado.

**Ejemplo de relación:**
```sql
-- Tabla ventas
CREATE TABLE ventas (
  id_venta INT PRIMARY KEY,
  id_cliente INT,
  id_usuario INT,
  id_metodo_pago INT,  -- <- Referencia a metodos_pago
  total DECIMAL(10,2),
  fecha DATETIME,
  estado VARCHAR(20),
  FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id_metodo_pago)
);
```

### Uso en Facturas

De manera similar, el módulo de Facturas puede referenciar el método de pago utilizado en la transacción mediante el campo `id_metodo_pago`.

**Ejemplo de relación:**
```sql
-- Tabla factura
CREATE TABLE factura (
  id_factura INT PRIMARY KEY,
  id_venta INT,
  id_metodo_pago INT,  -- <- Referencia a metodos_pago
  subtotal DECIMAL(10,2),
  -- otros campos...
  FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id_metodo_pago)
);
```

### Campo `activo`

El campo `activo` (boolean) permite implementar una "eliminación lógica" en lugar de eliminación física:

- **activo = true**: El método de pago está disponible para nuevas transacciones
- **activo = false**: El método de pago está deshabilitado pero se mantiene en el sistema para preservar el historial

**Recomendación:** En lugar de usar DELETE, actualizar el campo `activo` a `false` para deshabilitar un método de pago sin perder el historial.

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

### Obtener todos los métodos de pago

```bash
curl -X GET "http://localhost:3000/api/metodos-pago" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Obtener un método de pago específico

```bash
curl -X GET "http://localhost:3000/api/metodos-pago/1" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

### Crear un nuevo método de pago

```bash
curl -X POST "http://localhost:3000/api/metodos-pago" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Criptomonedas",
    "descripcion": "Bitcoin, Ethereum y otras criptomonedas",
    "activo": true
  }'
```

### Actualizar un método de pago

```bash
curl -X PUT "http://localhost:3000/api/metodos-pago/1" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Pago en efectivo, colones o dólares"
  }'
```

### Deshabilitar un método de pago (eliminación lógica - RECOMENDADO)

```bash
curl -X PUT "http://localhost:3000/api/metodos-pago/6" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "activo": false
  }'
```

### Eliminar un método de pago (eliminación física)

```bash
curl -X DELETE "http://localhost:3000/api/metodos-pago/6" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

---

## Notas para el Equipo de Desarrollo

1. **Integridad Referencial**:
   - Antes de eliminar un método de pago, verificar que no existan ventas o facturas que lo referencien.
   - Considerar agregar restricciones `ON DELETE RESTRICT` en la base de datos para prevenir eliminaciones accidentales.

2. **Eliminación Lógica vs Física**:
   - **Actual:** Eliminación física (destruye el registro)
   - **Recomendado:** Usar el campo `activo` para implementar eliminación lógica. Esto preserva el historial y evita problemas de integridad referencial.
   - Para "eliminar" un método de pago, simplemente actualizar `activo = false`.
   - En las interfaces de usuario, filtrar por `activo = true` para mostrar solo los métodos disponibles.

3. **Validación de Nombre Único**:
   - El servicio ya valida que no existan métodos de pago duplicados por nombre.
   - El campo `nombre` tiene restricción `UNIQUE` en la base de datos como medida de seguridad adicional.

4. **Métodos de Pago Comunes en Costa Rica**:
   - Efectivo (colones y dólares)
   - Tarjetas de crédito (Visa, MasterCard)
   - Tarjetas de débito
   - Transferencia bancaria
   - SINPE Móvil (muy popular en Costa Rica)
   - Cheque (menos común pero aún usado en empresas)

5. **Auditoría**:
   - Considerar agregar campos `created_at` y `updated_at` mediante `timestamps: true` en el modelo Sequelize.
   - Esto permite rastrear cuándo se creó y modificó cada método de pago.

6. **Reportes y Estadísticas**:
   - Los métodos de pago son útiles para:
     - Reportes de ventas por método de pago
     - Estadísticas de preferencias de clientes
     - Análisis de comisiones bancarias (si aplica)
     - Proyecciones de flujo de efectivo

7. **Seguridad**:
   - Solo administradores pueden crear, actualizar o eliminar métodos de pago.
   - Todos los usuarios autenticados pueden consultar los métodos disponibles.

8. **Internacionalización**:
   - Si el sistema se expande a otros países, considerar agregar campos como:
     - `pais` o `region`
     - `moneda_soportada`
     - `comision_porcentaje`

9. **Integración con Pasarelas de Pago**:
   - Si en el futuro se integran pasarelas de pago (Stripe, PayPal, etc.), considerar agregar campos como:
     - `gateway_id` (identificador en la pasarela)
     - `requiere_validacion_online` (boolean)
     - `url_webhook` (para notificaciones)

---

## Ejemplos de Datos Iniciales (Seed)

Métodos de pago comunes que pueden ser pre-cargados en el sistema:

```json
[
  {
    "nombre": "Efectivo",
    "descripcion": "Pago en efectivo al momento de la compra (colones o dólares)",
    "activo": true
  },
  {
    "nombre": "Tarjeta de Crédito",
    "descripcion": "Visa, MasterCard, American Express",
    "activo": true
  },
  {
    "nombre": "Tarjeta de Débito",
    "descripcion": "Tarjetas de débito bancarias",
    "activo": true
  },
  {
    "nombre": "Transferencia Bancaria",
    "descripcion": "Transferencia electrónica bancaria",
    "activo": true
  },
  {
    "nombre": "SINPE Móvil",
    "descripcion": "Sistema de pagos móviles de Costa Rica",
    "activo": true
  },
  {
    "nombre": "Cheque",
    "descripcion": "Pago mediante cheque bancario",
    "activo": true
  },
  {
    "nombre": "Crédito",
    "descripcion": "Pago a crédito (plazo según acuerdo con cliente)",
    "activo": true
  }
]
```

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-11-23 | Versión inicial de la documentación de endpoints de Métodos de Pago |

---

**Documento base para la wiki técnica del proyecto Ferretería Alessandro**
