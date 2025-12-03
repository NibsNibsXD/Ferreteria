const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Ventas (con Sistema de Alertas de Bajo Stock)
 */

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Ferretería Alessandro',
    version: '1.0.0',
    description: 'API REST para el sistema de gestión de Ferretería Alessandro',
    contact: {
      name: 'Equipo Backend Ferretería Alessandro',
      email: 'soporte@ferreteria-alessandro.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desarrollo'
    },
    {
      url: 'https://api.ferreteria-alessandro.com',
      description: 'Servidor de producción'
    }
  ],
  tags: [
    {
      name: 'Ventas',
      description: 'Gestión de ventas del sistema. Incluye funcionalidad automática de actualización de stock, detección de productos en bajo stock y envío de alertas por correo electrónico cuando el stock de un producto alcanza o está por debajo del nivel mínimo configurado.'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido del endpoint de autenticación'
      }
    },
    schemas: {
      // Schema para información de alertas de bajo stock
      LowStockAlertInfo: {
        type: 'object',
        description: 'Información sobre productos que quedaron en bajo stock después de la venta',
        properties: {
          id_producto: {
            type: 'integer',
            description: 'ID del producto',
            example: 10
          },
          nombre: {
            type: 'string',
            description: 'Nombre del producto',
            example: 'Martillo de garra 16 oz'
          },
          codigo_barra: {
            type: 'string',
            description: 'Código de barras del producto',
            example: '7501234567890'
          },
          stock_actual: {
            type: 'integer',
            description: 'Stock actual después de la venta',
            example: 5
          },
          stock_minimo: {
            type: 'integer',
            description: 'Stock mínimo configurado para el producto',
            example: 10
          },
          diferencia: {
            type: 'integer',
            description: 'Diferencia entre stock actual y mínimo (valor negativo indica urgencia)',
            example: -5
          }
        }
      },
      // Schema para venta con relaciones
      VentaConRelaciones: {
        type: 'object',
        properties: {
          id_venta: { type: 'integer', example: 2 },
          codigo_factura: { type: 'string', example: 'FAC-1732468012345-789' },
          id_usuario: { type: 'integer', example: 5 },
          id_cliente: { type: 'integer', example: 5 },
          fecha: { type: 'string', format: 'date-time', example: '2025-11-23T15:00:00.000Z' },
          id_metodo_pago: { type: 'integer', example: 1 },
          total: { type: 'number', format: 'decimal', example: 427.50 },
          estado: { type: 'string', example: 'completada' },
          usuario: {
            type: 'object',
            properties: {
              id_usuario: { type: 'integer', example: 5 },
              nombre: { type: 'string', example: 'Juan' },
              apellido: { type: 'string', example: 'Pérez' },
              correo: { type: 'string', format: 'email', example: 'juan.perez@ferreteria.com' }
            }
          },
          cliente: {
            type: 'object',
            properties: {
              id_cliente: { type: 'integer', example: 5 },
              nombre: { type: 'string', example: 'Carlos' },
              apellido: { type: 'string', example: 'Rodríguez' },
              telefono: { type: 'string', example: '+504 8888-7777' }
            }
          },
          metodo_pago: {
            type: 'object',
            properties: {
              id_metodo_pago: { type: 'integer', example: 1 },
              nombre: { type: 'string', example: 'Efectivo' }
            }
          },
          factura: {
            type: 'object',
            properties: {
              id_factura: { type: 'integer', example: 46 },
              id_venta: { type: 'integer', example: 2 },
              subtotal: { type: 'number', format: 'decimal', example: 427.50 },
              detalles: { type: 'array', items: { type: 'object' } }
            }
          }
        }
      },
      // Schema de respuesta exitosa con alertas
      VentaCreadaConAlertas: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            allOf: [
              { $ref: '#/components/schemas/VentaConRelaciones' },
              {
                type: 'object',
                properties: {
                  alertas_bajo_stock: {
                    type: 'array',
                    description: 'Lista de productos que quedaron en bajo stock (solo si aplica)',
                    items: { $ref: '#/components/schemas/LowStockAlertInfo' }
                  }
                }
              }
            ]
          },
          message: {
            type: 'string',
            example: 'Venta creada exitosamente. Se enviaron alertas de bajo stock para 2 productos.'
          }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/api/ventas': {
      post: {
        tags: ['Ventas'],
        summary: 'Crear una nueva venta con detección automática de bajo stock y envío de alertas',
        description: `Registra una nueva venta en el sistema con funcionalidad completa de gestión de inventario y alertas.

**Proceso Automático Completo:**

1. **Validación inicial:**
   - Verifica que existan productos y método de pago
   - Valida stock disponible para cada producto

2. **Creación de venta:**
   - Genera código de factura único (FAC-{timestamp}-{random})
   - Calcula total automáticamente desde productos
   - Crea registro de venta en estado 'completada'

3. **Gestión de factura:**
   - Crea automáticamente la factura asociada
   - Genera detalles de factura para cada producto

4. **Actualización de inventario:**
   - Descuenta del stock la cantidad vendida de cada producto
   - Actualiza el stock en tiempo real

5. **🔔 SISTEMA DE ALERTAS DE BAJO STOCK:**
   - **Detección automática:** Después de actualizar el stock, verifica si algún producto quedó con \`stock_actual <= stock_minimo\`
   - **Envío de correo:** Si hay productos en bajo stock, envía un email de alerta al usuario que registró la venta o al correo configurado en \`ALERT_EMAIL\` (.env)
   - **Contenido del email:**
     - Lista de productos en bajo stock
     - Stock actual vs stock mínimo de cada producto
     - Código de barras para facilitar reorden
   - **Comportamiento "best effort":** Si el servicio de email no está configurado o falla el envío, la venta se completa exitosamente de todos modos (el error solo se registra en logs)
   - **No afecta transacción:** Los fallos en alertas NO revierten la venta

6. **Respuesta:**
   - Retorna venta completa con todas sus relaciones
   - Opcionalmente incluye información de productos que quedaron en bajo stock

**Configuración de Alertas:**
- Configurar \`ALERT_EMAIL\` en .env para destinatario fijo, o el correo del usuario registrador será usado
- Configurar credenciales SMTP en .env (EMAIL_USER, EMAIL_PASS, etc.)
- Si no hay configuración de email, las alertas solo se registran en logs del servidor`,
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id_metodo_pago', 'productos'],
                properties: {
                  id_cliente: {
                    type: 'integer',
                    description: 'ID del cliente (opcional)',
                    example: 5
                  },
                  id_metodo_pago: {
                    type: 'integer',
                    description: 'ID del método de pago',
                    example: 1
                  },
                  productos: {
                    type: 'array',
                    minItems: 1,
                    description: 'Lista de productos a vender',
                    items: {
                      type: 'object',
                      required: ['id_producto', 'cantidad', 'precio_unitario'],
                      properties: {
                        id_producto: { type: 'integer', example: 10 },
                        cantidad: { type: 'integer', minimum: 1, example: 5 },
                        precio_unitario: { type: 'number', format: 'decimal', example: 25.50 },
                        descuento: { type: 'number', format: 'decimal', minimum: 0, example: 0 }
                      }
                    }
                  }
                }
              },
              examples: {
                ventaNormal: {
                  summary: 'Venta normal sin alertas',
                  description: 'Venta donde el stock no queda por debajo del mínimo',
                  value: {
                    id_cliente: 5,
                    id_metodo_pago: 1,
                    productos: [
                      { id_producto: 10, cantidad: 2, precio_unitario: 25.50 }
                    ]
                  }
                },
                ventaConBajoStock: {
                  summary: 'Venta que genera alerta de bajo stock',
                  description: 'Venta que deja un producto con stock <= stock_minimo, generando envío de email',
                  value: {
                    id_cliente: 12,
                    id_metodo_pago: 1,
                    productos: [
                      { id_producto: 15, cantidad: 45, precio_unitario: 12.50 }
                    ]
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: `**Venta creada exitosamente**

La venta se registró correctamente con todas sus operaciones asociadas:
- ✅ Venta y factura creadas
- ✅ Stock actualizado para todos los productos
- ✅ Detalles de factura registrados

**Sobre las alertas de bajo stock:**
- Si uno o más productos quedaron con stock <= stock_minimo:
  - Se envió un correo electrónico de alerta (si el servicio de email está configurado)
  - La respuesta puede incluir información de los productos en alerta en el campo \`alertas_bajo_stock\`
- Si no hay productos en bajo stock, la venta se completa normalmente sin alertas
- Los fallos en el envío de alertas NO afectan la creación exitosa de la venta`,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VentaCreadaConAlertas' },
                examples: {
                  ventaSinAlertas: {
                    summary: 'Venta sin productos en bajo stock',
                    value: {
                      success: true,
                      data: {
                        id_venta: 2,
                        codigo_factura: 'FAC-1732468012345-789',
                        id_usuario: 5,
                        id_cliente: 5,
                        fecha: '2025-11-23T15:00:00.000Z',
                        id_metodo_pago: 1,
                        total: 51.00,
                        estado: 'completada',
                        usuario: { id_usuario: 5, nombre: 'Juan', apellido: 'Pérez', correo: 'juan.perez@ferreteria.com' },
                        cliente: { id_cliente: 5, nombre: 'Carlos', apellido: 'Rodríguez', telefono: '+504 8888-7777' },
                        metodo_pago: { id_metodo_pago: 1, nombre: 'Efectivo' },
                        factura: { id_factura: 46, subtotal: 51.00 }
                      }
                    }
                  },
                  ventaConAlertas: {
                    summary: 'Venta con alertas de bajo stock enviadas',
                    value: {
                      success: true,
                      data: {
                        id_venta: 3,
                        codigo_factura: 'FAC-1732468099999-123',
                        id_usuario: 5,
                        id_cliente: 12,
                        fecha: '2025-11-24T10:00:00.000Z',
                        id_metodo_pago: 1,
                        total: 562.50,
                        estado: 'completada',
                        usuario: { id_usuario: 5, nombre: 'Juan', apellido: 'Pérez', correo: 'juan.perez@ferreteria.com' },
                        cliente: { id_cliente: 12, nombre: 'María', apellido: 'González', telefono: '+504 9999-8888' },
                        metodo_pago: { id_metodo_pago: 1, nombre: 'Efectivo' },
                        factura: { id_factura: 47, subtotal: 562.50 },
                        alertas_bajo_stock: [
                          {
                            id_producto: 15,
                            nombre: 'Clavos 2"',
                            codigo_barra: '7509876543210',
                            stock_actual: 5,
                            stock_minimo: 50,
                            diferencia: -45
                          },
                          {
                            id_producto: 20,
                            nombre: 'Tornillos 3/8',
                            codigo_barra: '7501111222333',
                            stock_actual: 10,
                            stock_minimo: 10,
                            diferencia: 0
                          }
                        ]
                      },
                      message: 'Venta creada exitosamente. Se enviaron alertas de bajo stock para 2 productos.'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Error de validación',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  sinProductos: {
                    summary: 'No se incluyeron productos',
                    value: { success: false, error: 'Debe incluir al menos un producto en la venta' }
                  },
                  stockInsuficiente: {
                    summary: 'Stock insuficiente',
                    value: { success: false, error: 'Stock insuficiente para el producto "Martillo". Disponible: 3, Solicitado: 5' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Sin autenticación',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          500: {
            description: 'Error interno del servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      get: {
        tags: ['Ventas'],
        summary: 'Obtener todas las ventas',
        description: 'Retorna un listado de todas las ventas con soporte para paginación opcional.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', minimum: 1 },
            description: 'Número de página para paginación'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100 },
            description: 'Cantidad de ventas por página'
          }
        ],
        responses: {
          200: {
            description: 'Lista de ventas obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/VentaConRelaciones' } }
                  }
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/ventas/{id}': {
      get: {
        tags: ['Ventas'],
        summary: 'Obtener una venta por ID',
        description: 'Retorna los detalles completos de una venta específica.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'ID de la venta'
          }
        ],
        responses: {
          200: {
            description: 'Venta encontrada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/VentaConRelaciones' }
                  }
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Venta no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Ventas'],
        summary: 'Actualizar una venta existente',
        description: 'Actualiza información de una venta. Requiere rol de Administrador (Rol 1).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'ID de la venta'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_cliente: { type: 'integer' },
                  id_metodo_pago: { type: 'integer' },
                  total: { type: 'number', format: 'float' },
                  estado: { type: 'string', enum: ['completada', 'pendiente', 'anulada'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Venta actualizada exitosamente', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin autorización', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Venta no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
