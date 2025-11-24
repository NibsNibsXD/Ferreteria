# Endpoints de Reportes y Exportación

Este documento describe los endpoints REST para generar reportes del sistema de Ferretería Alessandro y exportarlos en formatos Excel y PDF.

## Base URL
```
/api/reportes
```

## Autenticación
- **Endpoints de visualización (JSON)**: Requieren token JWT válido (`authenticateToken`)
- **Endpoints de exportación**: Requieren token JWT + rol de administrador (`authorizeRoles(1)`)

---

## Tabla de Contenidos

1. [Reportes de Ventas](#reportes-de-ventas)
2. [Reportes de Compras](#reportes-de-compras)
3. [Reportes de Inventario](#reportes-de-inventario)
4. [Reportes de Productos](#reportes-de-productos)
5. [Reportes de Clientes](#reportes-de-clientes)
6. [Formatos de Exportación](#formatos-de-exportación)
7. [Códigos de Error](#códigos-de-error)

---

## Reportes de Ventas

### 1. Obtener Reporte de Ventas (JSON)

**GET** `/api/reportes/ventas`

Obtiene un listado de todas las ventas con opción de filtrar por periodo.

#### Autenticación
- Requiere: `authenticateToken`

#### Query Parameters (opcionales)
- `desde` (string): Fecha de inicio en formato YYYY-MM-DD
- `hasta` (string): Fecha de fin en formato YYYY-MM-DD

#### Ejemplo de Request
```bash
# Todas las ventas
curl -X GET http://localhost:3000/api/reportes/ventas \
  -H "Authorization: Bearer <token>"

# Ventas por periodo
curl -X GET "http://localhost:3000/api/reportes/ventas?desde=2025-01-01&hasta=2025-11-24" \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "total": 150,
  "data": [
    {
      "id_venta": 1,
      "codigo_factura": "FAC-2025-001",
      "fecha": "2025-11-20T10:00:00.000Z",
      "total": "1250.50",
      "estado": "completada",
      "cliente": {
        "id_cliente": 5,
        "nombre": "Juan",
        "apellido": "Pérez",
        "telefono": "9876-5432"
      },
      "usuario": {
        "id_usuario": 2,
        "nombre": "María",
        "apellido": "González"
      },
      "metodo_pago": {
        "id_metodo_pago": 1,
        "nombre": "Efectivo"
      }
    }
  ]
}
```

---

### 2. Exportar Reporte de Ventas

**GET** `/api/reportes/ventas/export`

Exporta el reporte de ventas en formato Excel o PDF.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)` (solo administradores)

#### Query Parameters
- `formato` (string, **requerido**): "excel" o "pdf"
- `desde` (string, opcional): Fecha de inicio YYYY-MM-DD
- `hasta` (string, opcional): Fecha de fin YYYY-MM-DD

#### Columnas Exportadas
| Columna | Descripción |
|---------|-------------|
| ID Venta | Identificador único de la venta |
| Código Factura | Código de factura asociado |
| Fecha | Fecha de la venta |
| Cliente | Nombre completo del cliente |
| Teléfono | Teléfono del cliente |
| Usuario | Nombre del usuario que realizó la venta |
| Método Pago | Método de pago utilizado |
| Total (L) | Monto total en Lempiras |
| Estado | Estado de la venta |

#### Ejemplo de Request
```bash
# Exportar a Excel
curl -X GET "http://localhost:3000/api/reportes/ventas/export?formato=excel&desde=2025-01-01&hasta=2025-11-24" \
  -H "Authorization: Bearer <token>" \
  --output reporte-ventas.xlsx

# Exportar a PDF
curl -X GET "http://localhost:3000/api/reportes/ventas/export?formato=pdf&desde=2025-01-01&hasta=2025-11-24" \
  -H "Authorization: Bearer <token>" \
  --output reporte-ventas.pdf
```

#### Respuesta Exitosa
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel) o `application/pdf` (PDF)
- **Content-Disposition**: `attachment; filename=reporte-ventas-<timestamp>.xlsx`
- **Body**: Archivo binario (Excel o PDF)

#### Errores Posibles
- **400 Bad Request**: Formato inválido
- **401 Unauthorized**: Token no válido
- **403 Forbidden**: Usuario sin permisos de administrador
- **500 Internal Server Error**: Error al generar el archivo

---

## Reportes de Compras

### 3. Obtener Reporte de Compras (JSON)

**GET** `/api/reportes/compras`

Obtiene un listado de todas las compras con opción de filtrar por periodo.

#### Autenticación
- Requiere: `authenticateToken`

#### Query Parameters (opcionales)
- `desde` (string): Fecha de inicio en formato YYYY-MM-DD
- `hasta` (string): Fecha de fin en formato YYYY-MM-DD

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/compras?desde=2025-01-01&hasta=2025-11-24" \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "total": 85,
  "data": [
    {
      "id_compra": 10,
      "fecha": "2025-11-20T14:30:00.000Z",
      "total": "5500.00",
      "usuario": {
        "id_usuario": 2,
        "nombre": "María",
        "apellido": "González"
      },
      "detalles": [
        {
          "id_detalle": 25,
          "cantidad": 100,
          "precio_unitario": "15.50",
          "producto": {
            "id_producto": 8,
            "nombre": "Tornillo 1/4",
            "codigo_barra": "7501234567890"
          }
        }
      ]
    }
  ]
}
```

---

### 4. Exportar Reporte de Compras

**GET** `/api/reportes/compras/export`

Exporta el reporte de compras en formato Excel o PDF.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)`

#### Query Parameters
- `formato` (string, **requerido**): "excel" o "pdf"
- `desde` (string, opcional): Fecha de inicio
- `hasta` (string, opcional): Fecha de fin

#### Columnas Exportadas
| Columna | Descripción |
|---------|-------------|
| ID Compra | Identificador único de la compra |
| Fecha | Fecha de la compra |
| Usuario | Usuario que registró la compra |
| Total (L) | Monto total en Lempiras |
| Núm. Items | Cantidad de productos diferentes |

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/compras/export?formato=excel" \
  -H "Authorization: Bearer <token>" \
  --output reporte-compras.xlsx
```

---

## Reportes de Inventario

### 5. Obtener Inventario Actual (JSON)

**GET** `/api/reportes/inventario`

Obtiene el listado completo de productos en inventario con sus existencias.

#### Autenticación
- Requiere: `authenticateToken`

#### Ejemplo de Request
```bash
curl -X GET http://localhost:3000/api/reportes/inventario \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "total": 250,
  "data": [
    {
      "id_producto": 1,
      "nombre": "Martillo de carpintero",
      "descripcion": "Martillo profesional 16oz",
      "codigo_barra": "7501234567890",
      "precio_compra": "85.00",
      "precio_venta": "125.00",
      "stock": 45,
      "stock_minimo": 10,
      "activo": true,
      "categoria": {
        "id_categoria": 3,
        "nombre": "Herramientas"
      }
    }
  ]
}
```

---

### 6. Exportar Inventario Actual

**GET** `/api/reportes/inventario/export`

Exporta el inventario completo en formato Excel o PDF. **Imprime TODOS los datos de la tabla de inventario.**

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)`

#### Query Parameters
- `formato` (string, **requerido**): "excel" o "pdf"

#### Columnas Exportadas
| Columna | Descripción |
|---------|-------------|
| ID | Identificador del producto |
| Código Barra | Código de barras |
| Nombre | Nombre del producto |
| Categoría | Categoría del producto |
| P. Compra (L) | Precio de compra |
| P. Venta (L) | Precio de venta |
| Stock | Existencia actual |
| Stock Mín. | Stock mínimo recomendado |
| Estado | BAJO (si stock ≤ stock_minimo) o NORMAL |

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/inventario/export?formato=excel" \
  -H "Authorization: Bearer <token>" \
  --output inventario-actual.xlsx
```

---

### 7. Obtener Productos con Bajo Stock (JSON)

**GET** `/api/reportes/inventario/bajo-stock`

Obtiene productos cuyo stock actual es menor o igual al stock mínimo.

#### Autenticación
- Requiere: `authenticateToken`

#### Ejemplo de Request
```bash
curl -X GET http://localhost:3000/api/reportes/inventario/bajo-stock \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "total": 15,
  "data": [
    {
      "id_producto": 25,
      "nombre": "Clavos 2 pulgadas",
      "codigo_barra": "7501234567899",
      "stock": 3,
      "stock_minimo": 20,
      "categoria": {
        "nombre": "Ferretería"
      }
    }
  ]
}
```

---

### 8. Exportar Productos con Bajo Stock

**GET** `/api/reportes/inventario/bajo-stock/export`

Exporta los productos con bajo stock en formato Excel o PDF.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)`

#### Query Parameters
- `formato` (string, **requerido**): "excel" o "pdf"

#### Columnas Exportadas
| Columna | Descripción |
|---------|-------------|
| ID | Identificador del producto |
| Código Barra | Código de barras |
| Nombre | Nombre del producto |
| Categoría | Categoría del producto |
| Stock | Existencia actual |
| Stock Mín. | Stock mínimo |
| Diferencia | Stock - Stock Mínimo (negativo = déficit) |

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/inventario/bajo-stock/export?formato=pdf" \
  -H "Authorization: Bearer <token>" \
  --output bajo-stock.pdf
```

---

## Reportes de Productos

### 9. Obtener Productos Más Vendidos (JSON)

**GET** `/api/reportes/productos/mas-vendidos`

Obtiene los productos más vendidos con estadísticas de ventas.

#### Autenticación
- Requiere: `authenticateToken`

#### Query Parameters (opcionales)
- `limit` (number): Cantidad de productos a retornar (default: 20)
- `desde` (string): Fecha de inicio YYYY-MM-DD
- `hasta` (string): Fecha de fin YYYY-MM-DD

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/productos/mas-vendidos?limit=10&desde=2025-01-01" \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "total": 10,
  "data": [
    {
      "id_producto": 8,
      "total_vendido": "1250",
      "total_ingresos": "25000.00",
      "producto": {
        "nombre": "Tornillo 1/4 x 2\"",
        "codigo_barra": "7501234567890",
        "precio_venta": "20.00",
        "stock": 500,
        "categoria": {
          "nombre": "Ferretería"
        }
      }
    }
  ]
}
```

---

### 10. Exportar Productos Más Vendidos

**GET** `/api/reportes/productos/mas-vendidos/export`

Exporta los productos más vendidos en formato Excel o PDF.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)`

#### Query Parameters
- `formato` (string, **requerido**): "excel" o "pdf"
- `limit` (number, opcional): Cantidad de productos (default: 20)
- `desde` (string, opcional): Fecha de inicio
- `hasta` (string, opcional): Fecha de fin

#### Columnas Exportadas
| Columna | Descripción |
|---------|-------------|
| ID | Identificador del producto |
| Nombre | Nombre del producto |
| Código Barra | Código de barras |
| Categoría | Categoría del producto |
| Cantidad Vendida | Total de unidades vendidas |
| Ingresos (L) | Total de ingresos generados |
| Stock Actual | Existencia actual |

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/productos/mas-vendidos/export?formato=excel&limit=20" \
  -H "Authorization: Bearer <token>" \
  --output productos-mas-vendidos.xlsx
```

---

## Reportes de Clientes

### 11. Obtener Clientes Más Frecuentes (JSON)

**GET** `/api/reportes/clientes/frecuentes`

Obtiene los clientes con mayor número de compras y estadísticas de gasto.

#### Autenticación
- Requiere: `authenticateToken`

#### Query Parameters (opcionales)
- `limit` (number): Cantidad de clientes a retornar (default: 20)
- `desde` (string): Fecha de inicio YYYY-MM-DD
- `hasta` (string): Fecha de fin YYYY-MM-DD

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/clientes/frecuentes?limit=10" \
  -H "Authorization: Bearer <token>"
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "total": 10,
  "data": [
    {
      "id_cliente": 5,
      "total_compras": "25",
      "total_gastado": "15500.50",
      "cliente": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "telefono": "9876-5432",
        "correo": "juan.perez@example.com",
        "direccion": "Col. Centro, Tegucigalpa"
      }
    }
  ]
}
```

---

### 12. Exportar Clientes Más Frecuentes

**GET** `/api/reportes/clientes/frecuentes/export`

Exporta los clientes más frecuentes en formato Excel o PDF.

#### Autenticación
- Requiere: `authenticateToken` + `authorizeRoles(1)`

#### Query Parameters
- `formato` (string, **requerido**): "excel" o "pdf"
- `limit` (number, opcional): Cantidad de clientes (default: 20)
- `desde` (string, opcional): Fecha de inicio
- `hasta` (string, opcional): Fecha de fin

#### Columnas Exportadas
| Columna | Descripción |
|---------|-------------|
| ID | Identificador del cliente |
| Nombre | Nombre completo del cliente |
| Teléfono | Teléfono de contacto |
| Correo | Correo electrónico |
| Total Compras | Número de compras realizadas |
| Total Gastado (L) | Suma total gastada |
| Ticket Promedio (L) | Promedio de gasto por compra |

#### Ejemplo de Request
```bash
curl -X GET "http://localhost:3000/api/reportes/clientes/frecuentes/export?formato=pdf&limit=50" \
  -H "Authorization: Bearer <token>" \
  --output clientes-frecuentes.pdf
```

---

## Formatos de Exportación

### Excel (.xlsx)

Los archivos Excel generados incluyen:
- **Encabezados con estilo**: Fondo azul, texto blanco, negrita
- **Bordes en todas las celdas**: Para mejor legibilidad
- **Primera fila congelada**: Los encabezados permanecen visibles al hacer scroll
- **Anchos de columna ajustados**: Según el contenido
- **Formato de datos**: Números, fechas y texto formateados correctamente

**Librería utilizada**: `exceljs` v4.4.0

### PDF (.pdf)

Los archivos PDF generados incluyen:
- **Título del reporte**: Centrado en la parte superior
- **Fecha de generación**: En la esquina superior derecha
- **Tabla con encabezados**: Fondo azul con texto blanco
- **Paginación automática**: Con número de página en el footer
- **Orientación**: Portrait o Landscape según el ancho de datos
- **Tamaño de página**: Letter

**Librería utilizada**: `pdfkit` v0.15.0

---

## Códigos de Error

### Tabla de Códigos HTTP

| Código | Descripción | Causa |
|--------|-------------|-------|
| 200 | OK | Operación exitosa |
| 400 | Bad Request | Formato de exportación inválido o parámetros incorrectos |
| 401 | Unauthorized | Token JWT no válido o no proporcionado |
| 403 | Forbidden | Usuario sin permisos de administrador (solo para exportación) |
| 500 | Internal Server Error | Error al generar el reporte o archivo |

### Ejemplos de Errores

#### Error 400 - Formato inválido
```json
{
  "success": false,
  "error": "Formato inválido. Use \"excel\" o \"pdf\""
}
```

#### Error 401 - No autenticado
```json
{
  "success": false,
  "error": "Token no válido o no proporcionado"
}
```

#### Error 403 - Sin permisos
```json
{
  "success": false,
  "error": "Acceso denegado. Se requiere rol de administrador"
}
```

#### Error 500 - Error interno
```json
{
  "success": false,
  "error": "Error al generar Excel: [detalle del error]"
}
```

---

## Resumen de Endpoints

### Endpoints de Visualización (JSON)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/reportes/ventas` | Ventas por periodo | Token |
| GET | `/api/reportes/compras` | Compras por periodo | Token |
| GET | `/api/reportes/inventario` | Inventario actual | Token |
| GET | `/api/reportes/inventario/bajo-stock` | Productos con bajo stock | Token |
| GET | `/api/reportes/productos/mas-vendidos` | Productos más vendidos | Token |
| GET | `/api/reportes/clientes/frecuentes` | Clientes frecuentes | Token |

### Endpoints de Exportación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/reportes/ventas/export` | Exportar ventas | Token + Admin |
| GET | `/api/reportes/compras/export` | Exportar compras | Token + Admin |
| GET | `/api/reportes/inventario/export` | Exportar inventario | Token + Admin |
| GET | `/api/reportes/inventario/bajo-stock/export` | Exportar bajo stock | Token + Admin |
| GET | `/api/reportes/productos/mas-vendidos/export` | Exportar más vendidos | Token + Admin |
| GET | `/api/reportes/clientes/frecuentes/export` | Exportar clientes | Token + Admin |

---

## Notas Importantes

### Sobre los Datos Exportados

Según los requerimientos del proyecto (Figma), **todos los endpoints de exportación imprimen TODOS los datos de las tablas** que se muestran en el frontend. No hay límites de paginación en las exportaciones.

### Consideraciones de Rendimiento

- Los reportes con grandes volúmenes de datos pueden tardar varios segundos en generarse
- Se recomienda usar filtros de fecha para reducir el tamaño de los reportes
- Los archivos Excel pueden manejar hasta 1,048,576 filas
- Los archivos PDF son más ligeros pero menos interactivos

### Seguridad

- Solo administradores (rol ID = 1) pueden exportar reportes
- Todos los usuarios autenticados pueden visualizar reportes en JSON
- Los tokens JWT deben ser válidos y no expirados
- No se exponen datos sensibles como contraseñas

### Filtros de Fecha

El formato de fecha esperado es **YYYY-MM-DD** (ISO 8601):
- ✅ Válido: `2025-11-24`
- ❌ Inválido: `24/11/2025`, `24-11-2025`, `2025/11/24`

### Nombres de Archivo

Los archivos exportados incluyen un timestamp para evitar colisiones:
- `reporte-ventas-1732464000000.xlsx`
- `inventario-1732464000000.pdf`

---

## Ejemplo de Uso Completo

### Flujo de trabajo típico

```bash
# 1. Obtener token de autenticación
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@ferreteria.com","password":"admin123"}' \
  | jq -r '.token')

# 2. Visualizar ventas del mes actual (JSON)
curl -X GET "http://localhost:3000/api/reportes/ventas?desde=2025-11-01&hasta=2025-11-30" \
  -H "Authorization: Bearer $TOKEN"

# 3. Exportar reporte de ventas a Excel
curl -X GET "http://localhost:3000/api/reportes/ventas/export?formato=excel&desde=2025-11-01&hasta=2025-11-30" \
  -H "Authorization: Bearer $TOKEN" \
  --output ventas-noviembre-2025.xlsx

# 4. Ver productos con bajo stock
curl -X GET http://localhost:3000/api/reportes/inventario/bajo-stock \
  -H "Authorization: Bearer $TOKEN"

# 5. Exportar inventario completo a PDF
curl -X GET "http://localhost:3000/api/reportes/inventario/export?formato=pdf" \
  -H "Authorization: Bearer $TOKEN" \
  --output inventario-completo.pdf

# 6. Top 10 productos más vendidos del año
curl -X GET "http://localhost:3000/api/reportes/productos/mas-vendidos/export?formato=excel&limit=10&desde=2025-01-01" \
  -H "Authorization: Bearer $TOKEN" \
  --output top-10-productos-2025.xlsx
```

---

## Integración con Frontend

### Ejemplo con fetch (JavaScript)

```javascript
// Descargar reporte de ventas en Excel
async function descargarReporteVentas() {
  const token = localStorage.getItem('token');
  const desde = '2025-11-01';
  const hasta = '2025-11-30';

  const response = await fetch(
    `/api/reportes/ventas/export?formato=excel&desde=${desde}&hasta=${hasta}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas-${desde}-${hasta}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } else {
    console.error('Error al descargar reporte');
  }
}
```

---

## Mantenimiento y Mejoras Futuras

### Posibles Mejoras

1. **Reportes personalizados**: Permitir al usuario seleccionar qué columnas exportar
2. **Gráficos en PDF**: Incluir gráficos de tendencias y estadísticas
3. **Envío por correo**: Opción de enviar reportes por email
4. **Reportes programados**: Generación automática periódica
5. **Caché de reportes**: Cachear reportes frecuentes para mejor rendimiento
6. **Más formatos**: CSV, JSON, XML
7. **Filtros avanzados**: Por sucursal, por usuario, por categoría, etc.
8. **Reportes consolidados**: Combinar múltiples reportes en un solo archivo

### Dependencias

```json
{
  "exceljs": "^4.4.0",
  "pdfkit": "^0.15.0"
}
```

Instalar con: `npm install exceljs pdfkit`

---

**Documentación actualizada**: 2025-11-24
**Versión API**: 1.0.0
**Autor**: Equipo de Desarrollo Ferretería Alessandro
