# 📦 Base de Datos - Ferretería Alessandro

## 🗂️ Estructura de la Base de Datos

### Tablas Principales

1. **roles** - Roles de usuarios del sistema
2. **sucursal** - Sucursales de la ferretería
3. **usuarios** - Usuarios del sistema
4. **productos** - Inventario de productos
5. **clientes** - Registro de clientes
6. **compras** - Compras a proveedores
7. **detalle_compras** - Detalle de cada compra
8. **ventas** - Ventas realizadas
9. **factura** - Facturas de ventas
10. **detalle_factura** - Detalle de facturas
11. **caja** - Cajas registradoras
12. **cierres_caja** - Cierres diarios de caja

---

## 🚀 Comandos para Ejecutar

### 1. Crear la base de datos
```bash
npm run db:create
```

### 2. Ejecutar todas las migraciones
```bash
npm run db:migrate
```

### 3. Cargar datos de prueba (seeders)
```bash
npm run db:seed
```

### 4. Revertir seeders (limpiar datos)
```bash
npm run db:seed:undo
```

### 5. Revertir última migración
```bash
npm run db:migrate:undo
```

---

## 👥 Usuarios de Prueba

| Usuario | Correo | Contraseña | Rol |
|---------|--------|------------|-----|
| Alessandro Rodriguez | alessandro@ferreteria.com | admin123 | Administrador |
| María González | maria.gonzalez@ferreteria.com | gerente123 | Gerente |
| Carlos Mejía | carlos.mejia@ferreteria.com | cajero123 | Cajero |

---

## 📊 Datos de Prueba Incluidos

- ✅ 5 Roles de usuario
- ✅ 3 Sucursales (Tegucigalpa, Comayagüela, San Pedro Sula)
- ✅ 5 Usuarios con contraseñas hasheadas
- ✅ 25 Productos de ferretería (herramientas, construcción, pinturas, plomería, electricidad)
- ✅ 8 Clientes
- ✅ 3 Compras con sus detalles
- ✅ 5 Ventas con facturas y detalles
- ✅ 3 Cajas registradoras
- ✅ 3 Cierres de caja

---

## 🏪 Categorías de Productos

1. **Herramientas** - Martillos, destornilladores, llaves
2. **Herramientas Eléctricas** - Taladros, sierras
3. **Construcción** - Cemento, arena, varillas, blocks
4. **Pinturas** - Látex, aceite, brochas, rodillos
5. **Plomería** - Tubos PVC, llaves, inodoros
6. **Electricidad** - Cables, interruptores, focos LED

---

## 🔑 Relaciones Importantes

- `usuarios` → `sucursal` (Cada usuario pertenece a una sucursal)
- `usuarios` → `roles` (Cada usuario tiene un rol)
- `ventas` → `usuarios` + `clientes` (Venta realizada por usuario a cliente)
- `factura` → `ventas` (Una venta puede tener una factura)
- `detalle_factura` → `factura` + `productos` (Productos en la factura)
- `compras` → `usuarios` (Compra registrada por usuario)
- `detalle_compras` → `compras` + `productos` (Productos comprados)
- `caja` → `usuarios` + `sucursal` (Caja asignada a usuario en sucursal)
- `cierres_caja` → `caja` + `usuarios` (Cierre realizado por usuario)

---

## 📝 Notas

- Todas las contraseñas están hasheadas con bcrypt
- Los precios están en Lempiras (HNL)
- Las fechas están en formato timestamp
- Los códigos de factura siguen el formato: `FAC-YYYY-NNNN`
- El stock se actualiza automáticamente en las operaciones

---

## ⚠️ Importante

Las migraciones y seeders NO están en GitHub (están en `.gitignore`).
Para compartir la estructura de la base de datos, usa los scripts de exportación:

```powershell
cd backend
.\export-db.ps1
```

Esto generará un archivo SQL con toda la estructura y datos.
