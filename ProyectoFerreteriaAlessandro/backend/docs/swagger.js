const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger para la API de Ferretería Alessandro
 * OpenAPI 3.0.0
 */
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Ventas
 */

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Ferretería Alessandro',
    version: '1.0.0',
    description: 'API REST para el sistema de gestión de Ferretería Alessandro',
    contact: {
      name: 'Equipo de Desarrollo',
      email: 'dev@ferreteria-alessandro.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
      name: 'Equipo Backend Ferretería Alessandro',
      email: 'soporte@ferreteria-alessandro.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
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
      name: 'Productos',
      description: 'Gestión de productos del inventario'
    },
    {
      name: 'Facturas',
      description: 'Gestión de facturas de venta'
      name: 'Ventas',
      description: 'Gestión de ventas del sistema. Incluye operaciones de registro, consulta, actualización y eliminación de ventas. El proceso de venta incluye la creación automática de facturas, actualización de stock de productos y envío de alertas de bajo stock.'
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
      // ============================================
      // SCHEMA: Producto
      // ============================================
      Producto: {
        type: 'object',
        required: ['nombre', 'precio_compra', 'precio_venta'],
        properties: {
          id_producto: {
            type: 'integer',
            description: 'ID único del producto (autoincremental)',
            example: 1,
            readOnly: true
          },
          nombre: {
            type: 'string',
            maxLength: 100,
            description: 'Nombre del producto',
            example: 'Martillo de Carpintero 16oz'
          },
          descripcion: {
            type: 'string',
            description: 'Descripción detallada del producto',
            example: 'Martillo profesional de acero con mango de fibra de vidrio',
            nullable: true
          },
          codigo_barra: {
            type: 'string',
            maxLength: 50,
            description: 'Código de barras del producto',
            example: '7501234567890',
            nullable: true
          },
          id_categoria: {
            type: 'integer',
            description: 'ID de la categoría a la que pertenece el producto',
            example: 5,
            nullable: true
          },
          precio_compra: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Precio de compra del producto (en Lempiras)',
            example: 85.50
          },
          precio_venta: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Precio de venta del producto (en Lempiras)',
            example: 125.00
          },
          stock: {
            type: 'integer',
            minimum: 0,
            description: 'Cantidad disponible en inventario',
            example: 50,
            default: 0
          },
          stock_minimo: {
            type: 'integer',
            minimum: 0,
            description: 'Cantidad mínima de stock antes de alerta',
            example: 10,
            default: 5
          },
          activo: {
            type: 'boolean',
            description: 'Indica si el producto está activo en el sistema',
            example: true,
            default: true
          },
          fecha_registro: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de registro del producto',
            example: '2025-11-24T10:30:00.000Z',
            readOnly: true
          }
        }
      },
      ProductoConRelaciones: {
        allOf: [
          { $ref: '#/components/schemas/Producto' },
          {
            type: 'object',
            properties: {
              categoria: {
                type: 'object',
                description: 'Información de la categoría del producto',
                properties: {
                  id_categoria: {
                    type: 'integer',
                    example: 5
                  },
                  nombre: {
                    type: 'string',
                    example: 'Herramientas'
                  }
                }
              }
            }
          }
        ]
      },
      // ============================================
      // SCHEMA: Factura
      // ============================================
      Factura: {
        type: 'object',
        properties: {
          id_factura: {
            type: 'integer',
            description: 'ID único de la factura (autoincremental)',
            example: 1,
            readOnly: true
          },
          id_venta: {
            type: 'integer',
            description: 'ID de la venta asociada',
            example: 10,
            nullable: true
          },
          No_Reg_Exonerados: {
            type: 'string',
            maxLength: 100,
            description: 'Número de registro de exonerados',
            example: 'EXO-2025-001',
            nullable: true
          },
          Orden_Compra_Exenta: {
            type: 'string',
            maxLength: 100,
            description: 'Número de orden de compra exenta',
            example: 'OCE-2025-123',
            nullable: true
          },
          Condiciones_Pago: {
            type: 'string',
            maxLength: 20,
            description: 'Condiciones de pago (ej: contado, crédito 30 días)',
            example: 'Contado',
            nullable: true
          },
          OrdenEstado: {
            type: 'string',
            maxLength: 20,
            description: 'Estado de la orden de compra',
            example: 'Completada',
            nullable: true
          },
          RTN: {
            type: 'string',
            maxLength: 50,
            description: 'RTN (Registro Tributario Nacional) del cliente',
            example: '08019876543210',
            nullable: true
          },
          REG_SGA: {
            type: 'string',
            maxLength: 50,
            description: 'Registro SGA (Sistema de Gestión Administrativa)',
            example: 'SGA-2025-456',
            nullable: true
          },
          subtotal: {
            type: 'number',
            format: 'decimal',
            description: 'Subtotal de la factura (antes de impuestos)',
            example: 1500.00,
            nullable: true
          },
          id_metodo_pago: {
            type: 'integer',
            description: 'ID del método de pago utilizado',
            example: 1,
            nullable: true
          }
        }
      },
      FacturaConRelaciones: {
        allOf: [
          { $ref: '#/components/schemas/Factura' },
          {
            type: 'object',
            properties: {
              venta: {
                type: 'object',
                description: 'Información de la venta asociada',
                properties: {
                  id_venta: {
                    type: 'integer',
                    example: 10
                  },
                  codigo_factura: {
                    type: 'string',
                    example: 'FAC-2025-001'
                  },
                  total: {
                    type: 'number',
                    example: 1725.00
                  },
                  fecha: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-11-24T10:30:00.000Z'
                  }
                }
              },
              metodo_pago: {
                type: 'object',
                description: 'Información del método de pago',
                properties: {
                  id_metodo_pago: {
                    type: 'integer',
                    example: 1
                  },
                  nombre: {
                    type: 'string',
                    example: 'Efectivo'
                  }
                }
              },
              detalles: {
                type: 'array',
                description: 'Detalles (líneas) de la factura',
                items: {
                  type: 'object',
                  properties: {
                    id_detalle_factura: {
                      type: 'integer',
                      example: 1
                    },
                    id_producto: {
                      type: 'integer',
                      example: 5
                    },
                    cantidad: {
                      type: 'integer',
                      example: 10
                    },
                    precio_unitario: {
                      type: 'number',
                      example: 125.00
                    },
                    Rebajas_Otorgadas: {
                      type: 'number',
                      example: 0
                    }
                  }
                }
              }
            }
          }
        ]
      },
      // ============================================
      // SCHEMAS: Respuestas Genéricas
      // ============================================
      Venta: {
        type: 'object',
        properties: {
          id_venta: {
            type: 'integer',
            readOnly: true,
            description: 'ID único de la venta',
            example: 1
          },
          codigo_factura: {
            type: 'string',
            maxLength: 50,
            description: 'Código único de la factura (generado automáticamente en POST)',
            example: 'FAC-1732467890123-456'
          },
          id_usuario: {
            type: 'integer',
            nullable: true,
            description: 'ID del usuario que registró la venta',
            example: 5
          },
          id_cliente: {
            type: 'integer',
            nullable: true,
            description: 'ID del cliente que realizó la compra (null para ventas genéricas)',
            example: 12
          },
          fecha: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de la venta',
            example: '2025-11-23T14:30:00.000Z'
          },
          id_metodo_pago: {
            type: 'integer',
            description: 'ID del método de pago utilizado',
            example: 1
          },
          total: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Monto total de la venta (calculado automáticamente desde productos en POST)',
            example: 1250.50
          },
          estado: {
            type: 'string',
            maxLength: 20,
            description: 'Estado de la venta',
            enum: ['completada', 'pendiente', 'anulada'],
            default: 'completada',
            example: 'completada'
          }
        },
        required: ['id_metodo_pago']
      },
      VentaConRelaciones: {
        allOf: [
          { $ref: '#/components/schemas/Venta' },
          {
            type: 'object',
            properties: {
              usuario: {
                type: 'object',
                nullable: true,
                properties: {
                  id_usuario: { type: 'integer', example: 5 },
                  nombre: { type: 'string', example: 'Juan' },
                  apellido: { type: 'string', example: 'Pérez' },
                  correo: { type: 'string', format: 'email', example: 'juan.perez@ferreteria.com' }
                }
              },
              cliente: {
                type: 'object',
                nullable: true,
                properties: {
                  id_cliente: { type: 'integer', example: 12 },
                  nombre: { type: 'string', example: 'María' },
                  apellido: { type: 'string', example: 'González' },
                  telefono: { type: 'string', example: '+504 9999-8888' },
                  direccion: { type: 'string', example: 'San Pedro Sula, Honduras' }
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
                nullable: true,
                properties: {
                  id_factura: { type: 'integer', example: 45 },
                  id_venta: { type: 'integer', example: 1 },
                  subtotal: { type: 'number', format: 'decimal', example: 1250.50 },
                  id_metodo_pago: { type: 'integer', example: 1 },
                  detalles: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id_detalle_factura: { type: 'integer', example: 1 },
                        id_factura: { type: 'integer', example: 45 },
                        id_producto: { type: 'integer', example: 10 },
                        cantidad: { type: 'integer', example: 5 },
                        precio_unitario: { type: 'number', format: 'decimal', example: 25.50 },
                        Rebajas_Otorgadas: { type: 'number', format: 'decimal', example: 0 },
                        producto: {
                          type: 'object',
                          properties: {
                            id_producto: { type: 'integer', example: 10 },
                            nombre: { type: 'string', example: 'Martillo' },
                            codigo_barra: { type: 'string', example: '7501234567890' },
                            precio_venta: { type: 'number', format: 'decimal', example: 25.50 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      VentaCreateRequest: {
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
                id_producto: {
                  type: 'integer',
                  description: 'ID del producto',
                  example: 10
                },
                cantidad: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Cantidad a vender',
                  example: 5
                },
                precio_unitario: {
                  type: 'number',
                  format: 'decimal',
                  minimum: 0,
                  description: 'Precio unitario del producto',
                  example: 25.50
                },
                descuento: {
                  type: 'number',
                  format: 'decimal',
                  minimum: 0,
                  description: 'Descuento aplicado (opcional)',
                  example: 0
                }
              }
            }
          }
        }
      },
      VentaUpdateRequest: {
        type: 'object',
        properties: {
          id_cliente: {
            type: 'integer',
            nullable: true,
            description: 'ID del cliente',
            example: 15
          },
          id_metodo_pago: {
            type: 'integer',
            description: 'ID del método de pago',
            example: 2
          },
          total: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Monto total de la venta',
            example: 3750.00
          },
          estado: {
            type: 'string',
            maxLength: 20,
            description: 'Estado de la venta',
            enum: ['completada', 'pendiente', 'anulada'],
            example: 'anulada'
          }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            description: 'Datos de respuesta (variable según el endpoint)'
          },
          message: {
            type: 'string',
            description: 'Mensaje descriptivo (opcional)',
            description: 'Datos de respuesta'
          },
          message: {
            type: 'string',
            description: 'Mensaje informativo (opcional)',
            example: 'Operación exitosa'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            description: 'Mensaje de error',
            example: 'Descripción del error'
            example: 'Error al procesar la solicitud'
          }
        }
      }
    }
  },
  paths: {
    // ============================================
    // ENDPOINTS: Productos
    // ============================================
    '/api/productos': {
      get: {
        tags: ['Productos'],
        summary: 'Obtener todos los productos',
        description: 'Retorna una lista de todos los productos activos en el inventario. Soporta paginación opcional mediante query parameters.',
    '/api/ventas': {
      get: {
        tags: ['Ventas'],
        summary: 'Obtener todas las ventas',
        description: 'Retorna un listado de todas las ventas registradas en el sistema. Incluye información de usuario, cliente, método de pago y factura asociada. Soporta paginación opcional.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1
            },
            description: 'Número de página para paginación'
              minimum: 1
            },
            description: 'Número de página para paginación',
            example: 1
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              example: 10
            },
            description: 'Cantidad de productos por página'
              maximum: 100
            },
            description: 'Cantidad de ventas por página',
            example: 10
          }
        ],
        responses: {
          200: {
            description: 'Lista de productos obtenida exitosamente',
            description: 'Lista de ventas obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ProductoConRelaciones'
                      }
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/VentaConRelaciones' }
                    }
                  }
                },
                examples: {
                  success: {
                    summary: 'Respuesta exitosa',
                  ventasConPaginacion: {
                    summary: 'Lista de ventas con paginación',
                    value: {
                      success: true,
                      data: [
                        {
                          id_producto: 1,
                          nombre: 'Martillo de Carpintero 16oz',
                          descripcion: 'Martillo profesional de acero',
                          codigo_barra: '7501234567890',
                          id_categoria: 5,
                          precio_compra: 85.50,
                          precio_venta: 125.00,
                          stock: 50,
                          stock_minimo: 10,
                          activo: true,
                          fecha_registro: '2025-11-24T10:30:00.000Z',
                          categoria: {
                            id_categoria: 5,
                            nombre: 'Herramientas'
                          id_venta: 1,
                          codigo_factura: 'FAC-1732467890123-456',
                          id_usuario: 5,
                          id_cliente: 12,
                          fecha: '2025-11-23T14:30:00.000Z',
                          id_metodo_pago: 1,
                          total: 1250.50,
                          estado: 'completada',
                          usuario: {
                            id_usuario: 5,
                            nombre: 'Juan',
                            apellido: 'Pérez',
                            correo: 'juan.perez@ferreteria.com'
                          },
                          cliente: {
                            id_cliente: 12,
                            nombre: 'María',
                            apellido: 'González',
                            telefono: '+504 9999-8888'
                          },
                          metodo_pago: {
                            id_metodo_pago: 1,
                            nombre: 'Efectivo'
                          },
                          factura: {
                            id_factura: 45,
                            id_venta: 1,
                            subtotal: 1250.50
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
            description: 'No autenticado - Token JWT no válido o no proporcionado',
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Token no válido o no proporcionado'
                  error: 'Token no proporcionado'
                }
              }
            }
          },
          500: {
            description: 'Error interno del servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Error al obtener productos: [detalle del error]'
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Error al obtener ventas: Database connection failed'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Productos'],
        summary: 'Crear un nuevo producto',
        description: 'Registra un nuevo producto en el inventario. Requiere autenticación y permisos de administrador.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          description: 'Datos del nuevo producto',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'precio_compra', 'precio_venta'],
                properties: {
                  nombre: {
                    type: 'string',
                    maxLength: 100,
                    example: 'Destornillador Phillips #2'
                  },
                  descripcion: {
                    type: 'string',
                    example: 'Destornillador de precisión con mango ergonómico'
                  },
                  codigo_barra: {
                    type: 'string',
                    maxLength: 50,
                    example: '7501234567891'
                  },
                  id_categoria: {
                    type: 'integer',
                    example: 5
                  },
                  precio_compra: {
                    type: 'number',
                    minimum: 0,
                    example: 45.00
                  },
                  precio_venta: {
                    type: 'number',
                    minimum: 0,
                    example: 65.00
                  },
                  stock: {
                    type: 'integer',
                    minimum: 0,
                    example: 100
                  },
                  stock_minimo: {
                    type: 'integer',
                    minimum: 0,
                    example: 20
                  },
                  activo: {
                    type: 'boolean',
                    example: true
                  }
                }
              },
              examples: {
                productoNuevo: {
                  summary: 'Ejemplo de producto nuevo',
                  value: {
                    nombre: 'Destornillador Phillips #2',
                    descripcion: 'Destornillador de precisión con mango ergonómico',
                    codigo_barra: '7501234567891',
                    id_categoria: 5,
                    precio_compra: 45.00,
                    precio_venta: 65.00,
                    stock: 100,
                    stock_minimo: 20,
                    activo: true
        tags: ['Ventas'],
        summary: 'Crear una nueva venta',
        description: `Registra una nueva venta en el sistema. Este endpoint ejecuta automáticamente las siguientes operaciones:

**Proceso automático al crear venta:**
1. Genera un código de factura único (FAC-{timestamp}-{random})
2. Calcula el total de la venta desde los productos proporcionados
3. Crea el registro de venta en estado 'completada'
4. Crea automáticamente la factura asociada
5. Crea los detalles de factura para cada producto
6. Actualiza el stock de cada producto vendido
7. **Detecta productos en bajo stock** (stock <= stock_minimo)
8. **Envía alertas por correo electrónico** cuando se detecta bajo stock (si el servicio de email está configurado)

**Importante sobre alertas de bajo stock:**
- Las alertas se envían automáticamente sin necesidad de endpoint adicional
- Se verifica cada producto después de actualizar el stock
- El correo se envía al usuario que registra la venta o al email configurado en ALERT_EMAIL (.env)
- Si el servicio de email no está configurado, solo se registra en logs
- Los fallos en el envío de alertas NO afectan la creación de la venta`,
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VentaCreateRequest' },
              examples: {
                ventaBasica: {
                  summary: 'Venta con cliente',
                  value: {
                    id_cliente: 5,
                    id_metodo_pago: 1,
                    productos: [
                      {
                        id_producto: 10,
                        cantidad: 5,
                        precio_unitario: 25.50
                      },
                      {
                        id_producto: 15,
                        cantidad: 2,
                        precio_unitario: 150.00
                      }
                    ]
                  }
                },
                ventaSinCliente: {
                  summary: 'Venta genérica sin cliente',
                  value: {
                    id_metodo_pago: 2,
                    productos: [
                      {
                        id_producto: 8,
                        cantidad: 3,
                        precio_unitario: 45.00
                      }
                    ]
                  }
                },
                ventaConDescuento: {
                  summary: 'Venta con descuento en productos',
                  value: {
                    id_cliente: 12,
                    id_metodo_pago: 1,
                    productos: [
                      {
                        id_producto: 20,
                        cantidad: 10,
                        precio_unitario: 12.50,
                        descuento: 5.00
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Producto creado exitosamente',
            description: 'Venta creada exitosamente con factura y detalles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Producto creado exitosamente'
                    },
                    data: {
                      $ref: '#/components/schemas/ProductoConRelaciones'
                    }
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/VentaConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  message: 'Producto creado exitosamente',
                  data: {
                    id_producto: 2,
                    nombre: 'Destornillador Phillips #2',
                    descripcion: 'Destornillador de precisión con mango ergonómico',
                    codigo_barra: '7501234567891',
                    id_categoria: 5,
                    precio_compra: 45.00,
                    precio_venta: 65.00,
                    stock: 100,
                    stock_minimo: 20,
                    activo: true,
                    fecha_registro: '2025-11-24T11:00:00.000Z',
                    categoria: {
                      id_categoria: 5,
                      nombre: 'Herramientas'
                  data: {
                    id_venta: 2,
                    codigo_factura: 'FAC-1732468012345-789',
                    id_usuario: 5,
                    id_cliente: 5,
                    fecha: '2025-11-23T15:00:00.000Z',
                    id_metodo_pago: 1,
                    total: 427.50,
                    estado: 'completada',
                    usuario: {
                      id_usuario: 5,
                      nombre: 'Juan',
                      apellido: 'Pérez',
                      correo: 'juan.perez@ferreteria.com'
                    },
                    cliente: {
                      id_cliente: 5,
                      nombre: 'Carlos',
                      apellido: 'Rodríguez',
                      telefono: '+504 8888-7777'
                    },
                    metodo_pago: {
                      id_metodo_pago: 1,
                      nombre: 'Efectivo'
                    },
                    factura: {
                      id_factura: 46,
                      id_venta: 2,
                      subtotal: 427.50,
                      id_metodo_pago: 1,
                      detalles: [
                        {
                          id_detalle_factura: 89,
                          id_factura: 46,
                          id_producto: 10,
                          cantidad: 5,
                          precio_unitario: 25.50,
                          Rebajas_Otorgadas: 0,
                          producto: {
                            id_producto: 10,
                            nombre: 'Martillo de garra 16 oz',
                            codigo_barra: '7501234567890',
                            precio_venta: 25.50
                          }
                        },
                        {
                          id_detalle_factura: 90,
                          id_factura: 46,
                          id_producto: 15,
                          cantidad: 2,
                          precio_unitario: 150.00,
                          Rebajas_Otorgadas: 0,
                          producto: {
                            id_producto: 15,
                            nombre: 'Taladro eléctrico 1/2"',
                            codigo_barra: '7509876543210',
                            precio_venta: 150.00
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
            description: 'Datos de entrada inválidos o validación fallida',
            description: 'Error de validación - Datos inválidos o faltantes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  campoRequerido: {
                    summary: 'Campo requerido faltante',
                    value: {
                      success: false,
                      error: 'El nombre es requerido'
                    }
                  },
                  precioInvalido: {
                    summary: 'Precio de venta menor a precio de compra',
                    value: {
                      success: false,
                      error: 'El precio de venta debe ser mayor o igual al precio de compra'
                  sinProductos: {
                    summary: 'No se incluyeron productos',
                    value: {
                      success: false,
                      error: 'Debe incluir al menos un producto en la venta'
                    }
                  },
                  sinMetodoPago: {
                    summary: 'Método de pago faltante',
                    value: {
                      success: false,
                      error: 'El método de pago es requerido'
                    }
                  },
                  stockInsuficiente: {
                    summary: 'Stock insuficiente para un producto',
                    value: {
                      success: false,
                      error: 'Stock insuficiente para el producto "Martillo de garra 16 oz". Disponible: 3, Solicitado: 5'
                    }
                  },
                  productoNoEncontrado: {
                    summary: 'Producto no existe',
                    value: {
                      success: false,
                      error: 'Producto con ID 999 no encontrado'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          403: {
            description: 'No autorizado - Requiere rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Se requiere rol de administrador'
                }
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
      }
    },
    '/api/productos/{id}': {
      get: {
        tags: ['Productos'],
        summary: 'Obtener un producto por ID',
        description: 'Retorna la información detallada de un producto específico incluyendo su categoría.',
          500: {
            description: 'Error interno del servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Error al crear venta: Transaction timeout'
                }
              }
            }
          }
        }
      }
    },
    '/api/ventas/{id}': {
      get: {
        tags: ['Ventas'],
        summary: 'Obtener una venta por ID',
        description: 'Retorna los detalles completos de una venta específica, incluyendo usuario, cliente, método de pago y factura asociada.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1
            },
            description: 'ID del producto',
            description: 'ID de la venta',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Producto encontrado',
            description: 'Venta encontrada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      $ref: '#/components/schemas/ProductoConRelaciones'
                    }
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/VentaConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  data: {
                    id_producto: 1,
                    nombre: 'Martillo de Carpintero 16oz',
                    descripcion: 'Martillo profesional de acero',
                    codigo_barra: '7501234567890',
                    id_categoria: 5,
                    precio_compra: 85.50,
                    precio_venta: 125.00,
                    stock: 50,
                    stock_minimo: 10,
                    activo: true,
                    fecha_registro: '2025-11-24T10:30:00.000Z',
                    categoria: {
                      id_categoria: 5,
                      nombre: 'Herramientas'
                    id_venta: 1,
                    codigo_factura: 'FAC-1732467890123-456',
                    id_usuario: 5,
                    id_cliente: 12,
                    fecha: '2025-11-23T14:30:00.000Z',
                    id_metodo_pago: 1,
                    total: 1250.50,
                    estado: 'completada',
                    usuario: {
                      id_usuario: 5,
                      nombre: 'Juan',
                      correo: 'juan.perez@ferreteria.com'
                    },
                    cliente: {
                      id_cliente: 12,
                      nombre: 'María',
                      telefono: '+504 9999-8888',
                      direccion: 'San Pedro Sula, Honduras'
                    },
                    metodo_pago: {
                      id_metodo_pago: 1,
                      nombre: 'Efectivo'
                    },
                    factura: {
                      id_factura: 45,
                      id_venta: 1,
                      subtotal: 1250.50
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Producto no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Producto no encontrado'
            description: 'Venta no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Venta no encontrada'
                }
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
      put: {
        tags: ['Productos'],
        summary: 'Actualizar un producto',
        description: 'Actualiza la información de un producto existente. Todos los campos son opcionales (actualización parcial). Requiere autenticación y permisos de administrador.',
        tags: ['Ventas'],
        summary: 'Actualizar una venta existente',
        description: 'Actualiza la información de una venta. Solo se modifican los campos proporcionados en el body. Requiere rol de Administrador (Rol 1).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1
            },
            description: 'ID del producto a actualizar',
            description: 'ID de la venta a actualizar',
            example: 1
          }
        ],
        requestBody: {
          required: true,
          description: 'Campos a actualizar (todos opcionales)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: {
                    type: 'string',
                    maxLength: 100
                  },
                  descripcion: {
                    type: 'string'
                  },
                  codigo_barra: {
                    type: 'string',
                    maxLength: 50
                  },
                  id_categoria: {
                    type: 'integer'
                  },
                  precio_compra: {
                    type: 'number',
                    minimum: 0
                  },
                  precio_venta: {
                    type: 'number',
                    minimum: 0
                  },
                  stock: {
                    type: 'integer',
                    minimum: 0
                  },
                  stock_minimo: {
                    type: 'integer',
                    minimum: 0
                  },
                  activo: {
                    type: 'boolean'
                    maxLength: 100,
                    example: 'Martillo de Carpintero 20oz'
                  },
                  descripcion: {
                    type: 'string',
                    example: 'Martillo profesional de acero reforzado'
                  },
                  codigo_barra: {
                    type: 'string',
                    maxLength: 50,
                    example: '7501234567890'
                  },
                  id_categoria: {
                    type: 'integer',
                    example: 5
                  },
                  precio_compra: {
                    type: 'number',
                    minimum: 0,
                    example: 90.00
                  },
                  precio_venta: {
                    type: 'number',
                    minimum: 0,
                    example: 135.00
                  },
                  stock: {
                    type: 'integer',
                    minimum: 0,
                    example: 75
                  },
                  stock_minimo: {
                    type: 'integer',
                    minimum: 0,
                    example: 15
                  },
                  activo: {
                    type: 'boolean',
                    example: true
                  }
                }
              },
              examples: {
                actualizacionParcial: {
                  summary: 'Actualización parcial (solo precio)',
                  value: {
                    precio_compra: 90.00,
                    precio_venta: 135.00
                  }
                },
                actualizacionCompleta: {
                  summary: 'Actualización completa',
                  value: {
                    nombre: 'Martillo de Carpintero 20oz',
                    descripcion: 'Martillo profesional de acero reforzado',
                    precio_compra: 90.00,
                    precio_venta: 135.00,
                    stock: 75,
                    stock_minimo: 15
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VentaUpdateRequest' },
              examples: {
                actualizarEstado: {
                  summary: 'Cambiar estado de venta',
                  value: {
                    estado: 'anulada'
                  }
                },
                actualizarCompleto: {
                  summary: 'Actualización completa',
                  value: {
                    id_cliente: 15,
                    id_metodo_pago: 2,
                    total: 3750.00,
                    estado: 'completada'
                  }
                },
                actualizarMetodoPago: {
                  summary: 'Cambiar método de pago',
                  value: {
                    id_metodo_pago: 3,
                    total: 3500.00
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Producto actualizado exitosamente',
            description: 'Venta actualizada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Producto actualizado exitosamente'
                    },
                    data: {
                      $ref: '#/components/schemas/ProductoConRelaciones'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'El precio de venta debe ser mayor o igual al precio de compra'
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/VentaConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  data: {
                    id_venta: 1,
                    codigo_factura: 'FAC-1732467890123-456',
                    id_usuario: 5,
                    id_cliente: 15,
                    fecha: '2025-11-23T14:30:00.000Z',
                    id_metodo_pago: 2,
                    total: 3750.00,
                    estado: 'completada'
                  }
                }
              }
            }
          },
          401: {
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          403: {
            description: 'No autorizado',
            description: 'No autorizado - Requiere rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Producto no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Producto no encontrado'
                }
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
      delete: {
        tags: ['Productos'],
        summary: 'Eliminar un producto',
        description: 'Elimina un producto del inventario. Requiere autenticación y permisos de administrador.',
        description: 'Elimina un producto del inventario. IMPORTANTE: Esto es una eliminación física (hard delete). Requiere autenticación y permisos de administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1
            },
            description: 'ID del producto a eliminar',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Producto eliminado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Producto eliminado exitosamente'
                    }
                  }
                },
                example: {
                  success: true,
                  message: 'Producto eliminado exitosamente'
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          403: {
            description: 'No autorizado',
            description: 'No autorizado - Requiere rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Producto no encontrado',
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
      }
    },
    // ============================================
    // ENDPOINTS: Facturas
    // ============================================
    '/api/facturas': {
      get: {
        tags: ['Facturas'],
        summary: 'Obtener todas las facturas',
        description: 'Retorna una lista de todas las facturas registradas en el sistema. Incluye información de venta, método de pago y detalles. Soporta paginación opcional.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1
            },
            description: 'Número de página para paginación'
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              example: 10
            },
            description: 'Cantidad de facturas por página'
          }
        ],
        responses: {
          200: {
            description: 'Lista de facturas obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/FacturaConRelaciones'
                      }
                    }
                  }
                },
                example: {
                  success: true,
                  data: [
                    {
                      id_factura: 1,
                      id_venta: 10,
                      No_Reg_Exonerados: null,
                      Orden_Compra_Exenta: null,
                      Condiciones_Pago: 'Contado',
                      OrdenEstado: 'Completada',
                      RTN: '08019876543210',
                      REG_SGA: null,
                      subtotal: 1500.00,
                      id_metodo_pago: 1,
                      venta: {
                        id_venta: 10,
                        codigo_factura: 'FAC-2025-001',
                        total: 1725.00,
                        fecha: '2025-11-24T10:30:00.000Z'
                      },
                      metodo_pago: {
                        id_metodo_pago: 1,
                        nombre: 'Efectivo'
                      },
                      detalles: [
                        {
                          id_detalle_factura: 1,
                          id_producto: 5,
                          cantidad: 10,
                          precio_unitario: 125.00,
                          Rebajas_Otorgadas: 0
                        }
                      ]
                    }
                  ]
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
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
      post: {
        tags: ['Facturas'],
        summary: 'Crear una nueva factura',
        description: 'Registra una nueva factura en el sistema. Típicamente asociada a una venta. Requiere autenticación y permisos de administrador.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          description: 'Datos de la nueva factura',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_venta: {
                    type: 'integer',
                    example: 10,
                    description: 'ID de la venta asociada'
                  },
                  No_Reg_Exonerados: {
                    type: 'string',
                    maxLength: 100,
                    example: 'EXO-2025-001',
                    description: 'Número de registro de exonerados'
                  },
                  Orden_Compra_Exenta: {
                    type: 'string',
                    maxLength: 100,
                    example: 'OCE-2025-123',
                    description: 'Número de orden de compra exenta'
                  },
                  Condiciones_Pago: {
                    type: 'string',
                    maxLength: 20,
                    example: 'Contado',
                    description: 'Condiciones de pago'
                  },
                  OrdenEstado: {
                    type: 'string',
                    maxLength: 20,
                    example: 'Completada',
                    description: 'Estado de la orden'
                  },
                  RTN: {
                    type: 'string',
                    maxLength: 50,
                    example: '08019876543210',
                    description: 'RTN del cliente'
                  },
                  REG_SGA: {
                    type: 'string',
                    maxLength: 50,
                    example: 'SGA-2025-456',
                    description: 'Registro SGA'
                  },
                  subtotal: {
                    type: 'number',
                    example: 1500.00,
                    description: 'Subtotal de la factura'
                  },
                  id_metodo_pago: {
                    type: 'integer',
                    example: 1,
                    description: 'ID del método de pago'
                  }
                }
              },
              examples: {
                facturaNueva: {
                  summary: 'Ejemplo de factura nueva',
                  value: {
                    id_venta: 10,
                    Condiciones_Pago: 'Contado',
                    OrdenEstado: 'Completada',
                    RTN: '08019876543210',
                    subtotal: 1500.00,
                    id_metodo_pago: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Factura creada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Factura creada exitosamente'
                    },
                    data: {
                      $ref: '#/components/schemas/FacturaConRelaciones'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos',
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'El ID de venta es requerido'
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          403: {
            description: 'No autorizado - Requiere rol de administrador',
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
      }
    },
    '/api/facturas/{id}': {
      get: {
        tags: ['Facturas'],
        summary: 'Obtener una factura por ID',
        description: 'Retorna la información detallada de una factura específica, incluyendo venta asociada, método de pago y todos los detalles (líneas) de la factura.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1
            },
            description: 'ID de la factura',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Factura encontrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      $ref: '#/components/schemas/FacturaConRelaciones'
                    }
                  }
                },
                example: {
                  success: true,
                  data: {
                    id_factura: 1,
                    id_venta: 10,
                    No_Reg_Exonerados: null,
                    Orden_Compra_Exenta: null,
                    Condiciones_Pago: 'Contado',
                    OrdenEstado: 'Completada',
                    RTN: '08019876543210',
                    REG_SGA: null,
                    subtotal: 1500.00,
                    id_metodo_pago: 1,
                    venta: {
                      id_venta: 10,
                      codigo_factura: 'FAC-2025-001',
                      total: 1725.00,
                      fecha: '2025-11-24T10:30:00.000Z'
                    },
                    metodo_pago: {
                      id_metodo_pago: 1,
                      nombre: 'Efectivo'
                    },
                    detalles: [
                      {
                        id_detalle_factura: 1,
                        id_producto: 5,
                        cantidad: 10,
                        precio_unitario: 125.00,
                        Rebajas_Otorgadas: 0
                      }
                    ]
                  }
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Factura no encontrada',
                  error: 'Acceso denegado. Solo administradores pueden actualizar ventas'
                }
              }
            }
          },
          404: {
            description: 'Venta no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Factura no encontrada'
                  error: 'Venta no encontrada'
                }
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
      put: {
        tags: ['Facturas'],
        summary: 'Actualizar una factura',
        description: 'Actualiza la información de una factura existente. Todos los campos son opcionales (actualización parcial). Requiere autenticación y permisos de administrador.',
      delete: {
        tags: ['Ventas'],
        summary: 'Eliminar una venta',
        description: 'Elimina permanentemente una venta del sistema. Esta operación es irreversible. Requiere rol de Administrador (Rol 1). **ADVERTENCIA:** Considere implementar eliminación lógica (cambio de estado) en lugar de eliminación física para mantener el historial.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1
            },
            description: 'ID de la factura a actualizar',
            example: 1
          }
        ],
        requestBody: {
          required: true,
          description: 'Campos a actualizar (todos opcionales)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_venta: {
                    type: 'integer',
                    example: 10
                  },
                  No_Reg_Exonerados: {
                    type: 'string',
                    maxLength: 100,
                    example: 'EXO-2025-001'
                  },
                  Orden_Compra_Exenta: {
                    type: 'string',
                    maxLength: 100,
                    example: 'OCE-2025-123'
                  },
                  Condiciones_Pago: {
                    type: 'string',
                    maxLength: 20,
                    example: 'Crédito 30 días'
                  },
                  OrdenEstado: {
                    type: 'string',
                    maxLength: 20,
                    example: 'En Proceso'
                  },
                  RTN: {
                    type: 'string',
                    maxLength: 50,
                    example: '08019876543210'
                  },
                  REG_SGA: {
                    type: 'string',
                    maxLength: 50,
                    example: 'SGA-2025-456'
                  },
                  subtotal: {
                    type: 'number',
                    example: 1600.00
                  },
                  id_metodo_pago: {
                    type: 'integer',
                    example: 2
                  }
                }
              },
              examples: {
                actualizacionParcial: {
                  summary: 'Actualización parcial (solo condiciones de pago)',
                  value: {
                    Condiciones_Pago: 'Crédito 30 días'
                  }
                },
                actualizacionCompleta: {
                  summary: 'Actualización completa',
                  value: {
                    Condiciones_Pago: 'Crédito 30 días',
                    OrdenEstado: 'En Proceso',
                    RTN: '08019876543210',
                    subtotal: 1600.00,
                    id_metodo_pago: 2
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Factura actualizada exitosamente',
            description: 'ID de la venta a eliminar',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Venta eliminada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Factura actualizada exitosamente'
                    },
                    data: {
                      $ref: '#/components/schemas/FacturaConRelaciones'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'No autenticado',
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Venta eliminada exitosamente' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          403: {
            description: 'No autorizado - Requiere rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Factura no encontrada',
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Factura no encontrada'
                }
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
      delete: {
        tags: ['Facturas'],
        summary: 'Eliminar una factura',
        description: 'Elimina una factura del sistema. IMPORTANTE: Esta es una eliminación física (hard delete). Requiere autenticación y permisos de administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1
            },
            description: 'ID de la factura a eliminar',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Factura eliminada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Factura eliminada exitosamente'
                    }
                  }
                },
                example: {
                  success: true,
                  message: 'Factura eliminada exitosamente'
                }
              }
            }
          },
          401: {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          403: {
            description: 'No autorizado - Requiere rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Factura no encontrada',
                  error: 'Acceso denegado. Solo administradores pueden eliminar ventas'
                }
              }
            }
          },
          404: {
            description: 'Venta no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Factura no encontrada'
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Producto no encontrado'
                  error: 'Venta no encontrada'
                }
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
      }
    }
  }
};

/**
 * Opciones para swagger-jsdoc
 */
const options = {
  swaggerDefinition,
 * Se pueden agregar más archivos de rutas aquí para documentación automática
 */
const options = {
  swaggerDefinition,
  // APIs donde buscar anotaciones JSDoc adicionales (opcional)
  apis: [
    './routes/*.routes.js',
    './controllers/*.controller.js'
  ]
const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
