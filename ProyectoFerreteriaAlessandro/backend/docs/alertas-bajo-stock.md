# Alertas de Bajo Stock

Este documento describe la funcionalidad de alertas automáticas por correo electrónico cuando el stock de productos alcanza o cae por debajo del stock mínimo configurado.

## Descripción General

El sistema de alertas de bajo stock se activa **automáticamente** cada vez que se registra una venta en el endpoint `POST /api/ventas`. Después de actualizar el stock de los productos involucrados, el sistema verifica si alguno quedó en o por debajo del umbral de stock mínimo y, de ser así, envía un correo de alerta al usuario responsable.

---

## ¿Dónde se Dispara la Validación?

### Endpoint Trigger
- **Ruta**: `POST /api/ventas`
- **Archivo**: `backend/controllers/venta.controller.js`
- **Función**: `createVenta()`

### Flujo de Ejecución

1. **Crear Venta**: Se crea el registro de venta en la base de datos
2. **Crear Factura**: Se genera la factura asociada a la venta
3. **Crear Detalles**: Se crean los detalles de factura con los productos vendidos
4. **Actualizar Stock**: Para cada producto vendido:
   - Se valida que haya stock suficiente
   - Se descuenta la cantidad vendida del stock actual
   - Se actualiza el campo `stock` del producto
5. **Commit de Transacción**: Se confirman todos los cambios en la base de datos
6. **Verificar Bajo Stock**: Se ejecuta `checkAndSendLowStockAlerts()`
7. **Enviar Alerta**: Si se detectan productos en bajo stock, se envía un correo

**IMPORTANTE**: La verificación y envío de alertas ocurre **DESPUÉS** del commit de la transacción, por lo que **nunca afectará la creación de la venta**, incluso si el envío de correo falla.

---

## Regla de Negocio

### Condición de Alerta

Un producto dispara una alerta cuando:

```javascript
stock_actual <= stock_minimo
```

- **`stock_actual`**: Stock del producto después de descontar la venta
- **`stock_minimo`**: Valor configurado en la base de datos (campo `stock_minimo` del modelo `Producto`)

### Valores por Defecto

Según el modelo `Producto`:
- **stock**: default 0
- **stock_minimo**: default 5

---

## Contenido del Correo de Alerta

### Asunto
```
⚠️ Alerta de Bajo Stock - Ferretería Alessandro
```

### Cuerpo (Texto Plano)

```
Estimado usuario,

Se ha detectado que los siguientes productos han alcanzado o están por debajo del stock mínimo:

- Martillo de Carpintero (7501234567890)
  Stock actual: 3 unidades
  Stock mínimo: 5 unidades
  Déficit: 2 unidades

- Tornillos 2" (7501234567891)
  Stock actual: 5 unidades
  Stock mínimo: 10 unidades
  Déficit: 5 unidades

Por favor, considere reabastecer estos productos lo antes posible para evitar desabastecimiento.

---
Este es un mensaje automático del sistema de Ferretería Alessandro.
Fecha: 24/11/2025, 10:30:45
```

### Información Incluida

Para cada producto en bajo stock:
- **Nombre del producto**
- **Código de barra** (si existe)
- **Stock actual** (después de la venta)
- **Stock mínimo** (configurado en BD)
- **Déficit** (calculado como: stock_minimo - stock_actual)

---

## Destinatario del Correo

El sistema determina el destinatario en el siguiente orden de prioridad:

### 1. Usuario Autenticado (Prioridad Alta)
Si el usuario que realiza la venta está autenticado y tiene un correo configurado:
```javascript
req.user.correo  // ej: "vendedor@ferreteria.com"
```

### 2. Correo de Alertas Configurado (Fallback)
Si no se puede obtener el correo del usuario, se usa el correo configurado en `.env`:
```
ALERT_EMAIL=admin@ferreteria.com
```

### 3. Sin Destinatario
Si ninguna de las opciones anteriores está disponible:
- Se loguea una advertencia en consola
- **NO** se envía el correo
- La venta se procesa normalmente

---

## Configuración Requerida

### Variables de Entorno (.env)

Agregar las siguientes variables al archivo `.env` en la raíz del backend:

```bash
# ============================================
# CONFIGURACIÓN DE CORREO SMTP
# ============================================

# Servidor SMTP (Gmail, Outlook, etc.)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Credenciales SMTP
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion

# Correo remitente (puede ser el mismo que SMTP_USER)
FROM_EMAIL=noreply@ferreteria.com

# Correo destinatario por defecto para alertas
ALERT_EMAIL=admin@ferreteria.com
```

### Ejemplo para Gmail

Si usas Gmail, necesitas generar una "Contraseña de Aplicación":

1. Ir a: https://myaccount.google.com/apppasswords
2. Generar una nueva contraseña para "Correo"
3. Usar esa contraseña en `SMTP_PASS`

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ferreteria.alessandro@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
FROM_EMAIL=ferreteria.alessandro@gmail.com
ALERT_EMAIL=admin@ferreteria.com
```

### Ejemplo para Outlook/Office 365

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ferreteria@outlook.com
SMTP_PASS=tu-contraseña
FROM_EMAIL=ferreteria@outlook.com
ALERT_EMAIL=admin@ferreteria.com
```

---

## Dependencias

### Nodemailer

La funcionalidad de correo utiliza la librería `nodemailer`.

**Instalación**:
```bash
npm install nodemailer
```

**Versión en package.json**:
```json
{
  "dependencies": {
    "nodemailer": "^6.9.8"
  }
}
```

---

## Archivos Involucrados

### 1. Servicio de Email
**Archivo**: `backend/services/email.service.js`

**Funciones**:
- `sendLowStockAlertEmail({ to, productos })` - Envía el correo de alerta
- `isEmailConfigured()` - Verifica si SMTP está configurado
- `getAlertRecipientEmail(req)` - Obtiene el correo destinatario

### 2. Servicio de Ventas
**Archivo**: `backend/services/venta.service.js`

**Funciones**:
- `createVenta(data, req)` - Crea la venta y actualiza stock
- `checkAndSendLowStockAlerts({ productos, venta, req })` - Detecta y envía alertas

### 3. Controlador de Ventas
**Archivo**: `backend/controllers/venta.controller.js`

**Funciones**:
- `createVenta(req, res)` - Endpoint HTTP que orquesta el proceso

### 4. Rutas de Ventas
**Archivo**: `backend/routes/ventas.routes.js`

**Rutas**:
- `POST /api/ventas` - Crear venta (con alertas automáticas)

### 5. Modelo de Producto
**Archivo**: `backend/models/producto.js`

**Campos relevantes**:
- `stock` (INTEGER) - Stock actual del producto
- `stock_minimo` (INTEGER) - Umbral de alerta

---

## Manejo de Errores

### Principio: "Best Effort"

El envío de alertas opera bajo el principio de **"best effort"** (mejor esfuerzo):

- ✅ **Si el correo se envía exitosamente**: Se loguea el éxito en consola
- ❌ **Si el correo falla**:
  - Se captura el error
  - Se loguea en consola con `console.error()`
  - **NO** se hace `throw` del error
  - La respuesta del endpoint sigue siendo exitosa (201)

### Errores que NO Afectan la Venta

Los siguientes errores en el envío de correo **NO** rompen la creación de la venta:

1. **Credenciales SMTP incorrectas**
2. **Servidor SMTP no disponible**
3. **Correo destinatario inválido**
4. **Timeout de conexión SMTP**
5. **Límite de envío excedido**
6. **Cualquier error de nodemailer**

### Log de Errores

Cuando falla el envío de correo, se loguea:

```
Error al enviar alerta de bajo stock: [mensaje de error]
La venta se procesó correctamente, pero la alerta falló.
```

### Errores que SÍ Afectan la Venta

Solo los errores críticos de la lógica de negocio rompen la venta:

- Stock insuficiente para un producto
- Producto no encontrado
- Error al crear venta/factura/detalles
- Error de transacción en base de datos

Estos errores resultan en:
- Rollback de la transacción
- Respuesta HTTP 400 o 500
- **NO** se envía correo de alerta

---

## Ejemplos de Uso

### Ejemplo 1: Crear Venta Normal (Sin Alerta)

**Request**:
```bash
POST /api/ventas
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_cliente": 5,
  "id_metodo_pago": 1,
  "productos": [
    {
      "id_producto": 10,
      "cantidad": 2,
      "precio_unitario": 25.50
    }
  ]
}
```

**Escenario**:
- Producto 10 tenía stock de 50 unidades
- Después de vender 2, queda con 48 unidades
- Stock mínimo es 5
- **48 > 5**: NO se envía alerta

**Response**:
```json
{
  "success": true,
  "message": "Venta creada exitosamente",
  "data": {
    "id_venta": 1,
    "codigo_factura": "FAC-1732464000000-123",
    "total": "51.00",
    // ... resto de la venta
  }
}
```

### Ejemplo 2: Crear Venta que Dispara Alerta

**Request**:
```bash
POST /api/ventas
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_cliente": 5,
  "id_metodo_pago": 1,
  "productos": [
    {
      "id_producto": 10,
      "cantidad": 48,
      "precio_unitario": 25.50
    }
  ]
}
```

**Escenario**:
- Producto 10 tenía stock de 50 unidades
- Después de vender 48, queda con 2 unidades
- Stock mínimo es 5
- **2 <= 5**: SÍ se envía alerta

**Response** (igual que ejemplo 1):
```json
{
  "success": true,
  "message": "Venta creada exitosamente",
  "data": { ... }
}
```

**Correo enviado a**: `vendedor@ferreteria.com` (usuario autenticado)

**Log en consola**:
```
Enviando alerta de bajo stock a: vendedor@ferreteria.com
Productos en alerta: Tornillo 1/4 x 2"
Correo de alerta de bajo stock enviado: <abc123@smtp.gmail.com>
Alerta de bajo stock enviada exitosamente
```

### Ejemplo 3: Múltiples Productos en Alerta

**Request**:
```bash
POST /api/ventas
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_cliente": 5,
  "id_metodo_pago": 1,
  "productos": [
    {
      "id_producto": 10,
      "cantidad": 48,
      "precio_unitario": 25.50
    },
    {
      "id_producto": 15,
      "cantidad": 90,
      "precio_unitario": 15.00
    }
  ]
}
```

**Escenario**:
- Producto 10: 50 → 2 (stock_minimo: 5) ⚠️
- Producto 15: 95 → 5 (stock_minimo: 10) ⚠️

**Correo enviado**:
```
Se ha detectado que los siguientes productos han alcanzado o están por debajo del stock mínimo:

- Tornillo 1/4 x 2" (7501234567890)
  Stock actual: 2 unidades
  Stock mínimo: 5 unidades
  Déficit: 3 unidades

- Clavos 2" (7501234567899)
  Stock actual: 5 unidades
  Stock mínimo: 10 unidades
  Déficit: 5 unidades
```

---

## TODOs y Mejoras Futuras

### 1. Plantillas HTML para Correos
Actualmente los correos son texto plano. Se podría mejorar con:
- Plantillas HTML con estilos
- Logo de la empresa
- Tabla formateada de productos
- Botones de acción ("Ver inventario", "Crear orden de compra")

**Librería sugerida**: `handlebars` o `ejs`

### 2. Múltiples Destinatarios
Permitir enviar alertas a varios correos simultáneamente:
```bash
ALERT_EMAIL=admin@ferreteria.com,gerente@ferreteria.com,compras@ferreteria.com
```

### 3. Acumulación de Alertas
En lugar de enviar un correo por cada venta, acumular alertas y enviar:
- Un resumen diario
- Al alcanzar X productos en alerta
- Solo una vez por producto hasta que se reabastezca

### 4. Niveles de Alerta
Definir múltiples niveles:
- **Crítico**: stock <= stock_minimo * 0.5
- **Advertencia**: stock <= stock_minimo
- **Preventivo**: stock <= stock_minimo * 1.5

### 5. Notificaciones Push
Además del correo, enviar:
- Notificaciones push al frontend
- Mensajes de WhatsApp (Twilio)
- Alertas en dashboard administrativo

### 6. Historial de Alertas
Crear tabla en BD para guardar:
- Fecha de la alerta
- Producto afectado
- Stock en ese momento
- Correo destinatario
- Estado del envío (éxito/fallo)

### 7. Configuración por Usuario
Permitir que cada usuario configure:
- Si quiere recibir alertas
- Qué tipo de alertas
- Horarios de envío
- Categorías de productos a monitorear

### 8. Integración con Sistema de Compras
Cuando se detecta bajo stock:
- Crear automáticamente una orden de compra sugerida
- Calcular cantidad óptima a pedir
- Enviar al proveedor preferido

### 9. Alertas por Sucursal
Si hay múltiples sucursales, alertar solo al responsable de cada una:
```javascript
productos.filter(p => p.id_sucursal === req.user.id_sucursal)
```

### 10. Testing y Logs
- Crear tests unitarios para `email.service.js`
- Crear tests de integración para el flujo completo
- Implementar logging estructurado (Winston, Bunyan)
- Monitorear tasa de éxito/fallo de envíos

---

## Solución de Problemas

### Problema: No se envían correos

**Diagnóstico**:
1. Verificar que `SMTP_USER` y `SMTP_PASS` estén configurados
2. Verificar que `ALERT_EMAIL` esté configurado o que el usuario tenga correo
3. Revisar logs de consola

**Solución**:
```bash
# Verificar configuración
echo $SMTP_USER
echo $ALERT_EMAIL

# Probar credenciales SMTP manualmente
# (usar herramienta como Postman o telnet)
```

### Problema: Correo va a spam

**Solución**:
- Configurar registros SPF, DKIM y DMARC en el dominio
- Usar un servicio de correo transaccional (SendGrid, Mailgun, AWS SES)
- Agregar remitente a lista blanca del destinatario

### Problema: Error "Invalid login"

**Causa**: Credenciales incorrectas o autenticación de 2 factores

**Solución Gmail**:
1. Habilitar "Acceso de aplicaciones menos seguras" (no recomendado)
2. O mejor: Usar contraseña de aplicación (recomendado)

**Solución Outlook**:
- Verificar que la cuenta no tenga 2FA activado
- O usar OAuth2 en lugar de contraseña

### Problema: Timeout de conexión

**Solución**:
- Verificar firewall/antivirus
- Probar con puerto 465 (SSL) en lugar de 587 (TLS)
- Verificar que el servidor permita conexiones salientes SMTP

---

## Seguridad

### Buenas Prácticas Implementadas

1. ✅ **Credenciales en .env**: No están hardcodeadas
2. ✅ **Autenticación requerida**: Endpoint protegido con JWT
3. ✅ **Transacciones de BD**: Rollback automático en caso de error
4. ✅ **Validación de stock**: No se puede vender más de lo disponible
5. ✅ **Logs de errores**: Todos los fallos se loguean
6. ✅ **Best effort**: Fallos de correo no rompen ventas

### Recomendaciones Adicionales

1. **Limitar tasa de envío**: Implementar throttling para evitar spam
2. **Sanitizar datos**: Validar formato de correos destinatarios
3. **Encriptar credenciales**: Usar servicios como AWS Secrets Manager
4. **Rotar credenciales**: Cambiar SMTP_PASS periódicamente
5. **Monitorear**: Alertar si la tasa de fallos es alta

---

## Conclusión

El sistema de alertas de bajo stock está diseñado para:
- ✅ Funcionar automáticamente sin intervención manual
- ✅ No interferir con el proceso de ventas
- ✅ Ser configurable y flexible
- ✅ Ser robusto ante fallos

Para más información o soporte, consultar:
- Código fuente en `backend/services/`
- Logs de aplicación
- Documentación de nodemailer: https://nodemailer.com/

---

**Última actualización**: 2025-11-24
**Versión**: 1.0.0
**Autor**: Equipo de Desarrollo Ferretería Alessandro
