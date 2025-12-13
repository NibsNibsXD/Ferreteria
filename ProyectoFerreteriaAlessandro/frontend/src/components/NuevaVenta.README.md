# Componente NuevaVenta

Componente de React con Tailwind CSS para registrar ventas, conectado con el backend.

## Características

- ✅ Escaneo de código de barras
- ✅ Búsqueda manual de productos
- ✅ Gestión de carrito de compra
- ✅ Selección de cliente (opcional)
- ✅ Métodos de pago
- ✅ Cálculo automático de ISV (15%)
- ✅ Notificaciones con Toast personalizadas
- ✅ Validación de stock en tiempo real
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Integración completa con backend

## Uso

```jsx
import { NuevaVenta } from './components/NuevaVenta';

function App() {
  const user = {
    id_usuario: 1,
    nombre: "Juan Pérez"
  };

  return <NuevaVenta user={user} />;
}
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `user` | Object | Sí | Objeto con información del usuario (id_usuario, nombre) |

## Dependencias

### Backend Endpoints

El componente requiere los siguientes endpoints del backend:

- `GET /api/productos` - Listar productos activos
- `GET /api/clientes` - Listar clientes
- `GET /api/metodos-pago` - Listar métodos de pago
- `POST /api/ventas` - Crear nueva venta

### Servicios Frontend

Se agregaron los siguientes servicios en `/src/services/index.js`:

```javascript
export const clienteService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
};

export const metodoPagoService = {
  getAll: () => api.get('/metodos-pago'),
  getById: (id) => api.get(`/metodos-pago/${id}`),
  create: (data) => api.post('/metodos-pago', data),
  update: (id, data) => api.put(`/metodos-pago/${id}`, data),
};
```

## Componentes Adicionales Creados

### Toast Component (`/src/components/Toast.jsx`)

Sistema de notificaciones elegante con Tailwind CSS:

- `Toast` - Componente individual de notificación
- `ToastContainer` - Contenedor para múltiples notificaciones

### useToast Hook (`/src/hooks/useToast.js`)

Hook personalizado para gestionar notificaciones:

```javascript
const toast = useToast();

// Métodos disponibles
toast.success('Operación exitosa');
toast.error('Error al procesar');
toast.info('Información importante');
```

## Flujo de Trabajo

1. **Carga inicial**: Al montar el componente, carga productos, clientes y métodos de pago
2. **Escaneo de código**: El usuario puede escanear códigos de barras con el input enfocado
3. **Búsqueda manual**: Alternativamente, puede buscar productos por nombre, código o categoría
4. **Gestión del carrito**: Los productos se agregan al carrito con validación de stock
5. **Finalización**: Se registra la venta con el backend y se genera un código de factura único

## Validaciones

- Stock disponible antes de agregar/actualizar cantidades
- Método de pago obligatorio
- Al menos un producto en el carrito
- Formato correcto de datos para el backend

## Formato de Datos de Venta

```javascript
{
  codigo_factura: "FAC-2025-XXXX",
  id_usuario: 1,
  id_cliente: 12, // o null para cliente general
  id_metodo_pago: 1,
  total: 1250.50, // Incluye ISV del 15%
  fecha: "2025-12-11T14:30:00.000Z",
  estado: "completada"
}
```

## Estilos

El componente usa Tailwind CSS puro con la paleta de colores de la ferretería:

- Color primario: `#0f4c81` (azul)
- Background hover: `#0a3a61` (azul oscuro)
- Background suave: `#f7fafc` (gris muy claro)

## Mejoras Futuras

- [ ] Integración con impresora térmica
- [ ] Soporte para descuentos
- [ ] Historial de ventas del día
- [ ] Múltiples métodos de pago por venta
- [ ] Búsqueda de productos por categoría
- [ ] Edición de productos antes de agregar
- [ ] Vista previa de factura antes de finalizar
- [ ] Exportar factura a PDF
