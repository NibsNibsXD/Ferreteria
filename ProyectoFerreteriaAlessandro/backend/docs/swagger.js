const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger para la API de Ferretería Alessandro
 * OpenAPI 3.0.0
 */
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Ventas
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Compras
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Métodos de Pago
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
      name: 'Compras',
      description: 'Gestión de compras del sistema. Incluye operaciones de registro, consulta, actualización y eliminación de compras. Permite gestionar las compras de productos a proveedores, incluyendo los detalles de cada compra (productos, cantidades y precios).'
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
      Compra: {
        type: 'object',
        properties: {
          id_compra: {
            type: 'integer',
            readOnly: true,
            description: 'ID único de la compra',
            example: 1
          },
          id_usuario: {
            type: 'integer',
            nullable: true,
            description: 'ID del usuario que registró la compra',
            example: 3
          },
          fecha: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de la compra',
            example: '2025-11-23T08:00:00.000Z'
          },
          total: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Monto total de la compra',
            example: 5000.00
          }
        },
        required: ['total']
      },
      CompraConRelaciones: {
        allOf: [
          { $ref: '#/components/schemas/Compra' },
          {
            type: 'object',
            properties: {
              usuario: {
                type: 'object',
                nullable: true,
                properties: {
                  id_usuario: { type: 'integer', example: 3 },
                  nombre: { type: 'string', example: 'María González' },
                  correo: { type: 'string', format: 'email', example: 'maria@ferreteria.com' }
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
                items: {
                  type: 'object',
                  properties: {
                    id_detalle: { type: 'integer', example: 1 },
                    id_compra: { type: 'integer', example: 1 },
                    id_producto: { type: 'integer', example: 15 },
                    cantidad: { type: 'integer', minimum: 1, example: 50 },
                    precio_unitario: { type: 'number', format: 'decimal', example: 80.00 },
                    subtotal: {
                      type: 'number',
                      format: 'decimal',
                      description: 'Calculado automáticamente como cantidad * precio_unitario',
                      example: 4000.00
                    },
                    producto: {
                      type: 'object',
                      properties: {
                        id_producto: { type: 'integer', example: 15 },
                        nombre: { type: 'string', example: 'Tornillos 1/4' },
                        codigo: { type: 'string', example: 'TOR-001' },
                        descripcion: { type: 'string', example: 'Tornillos de acero inoxidable 1/4 pulgada' }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      CompraCreateRequest: {
        type: 'object',
        required: ['total'],
        properties: {
          id_usuario: {
            type: 'integer',
            nullable: true,
            description: 'ID del usuario que registra la compra (opcional)',
            example: 3
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
            description: 'Monto total de la compra',
            example: 5000.00
          },
          fecha: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de la compra (opcional, por defecto: fecha actual)',
            example: '2025-11-23T08:00:00.000Z'
          },
          detalles: {
            type: 'array',
            description: 'Arreglo de detalles de la compra (opcional)',
            items: {
              type: 'object',
              required: ['id_producto', 'cantidad', 'precio_unitario'],
              properties: {
                id_producto: {
                  type: 'integer',
                  description: 'ID del producto',
                  example: 10
                  description: 'ID del producto comprado',
                  example: 15
                },
                cantidad: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Cantidad a vender',
                  example: 5
                  description: 'Cantidad de unidades compradas',
                  example: 50
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
                  description: 'Precio unitario de compra',
                  example: 80.00
                }
              }
            }
          }
        }
      },
      CompraUpdateRequest: {
        type: 'object',
        properties: {
          id_usuario: {
            type: 'integer',
            nullable: true,
            description: 'ID del usuario',
            example: 3
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
            description: 'Monto total de la compra',
            example: 5500.00
          },
          fecha: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de la compra',
            example: '2025-11-23T09:00:00.000Z'
          }
        }
      },
      DetalleCompra: {
        type: 'object',
        required: ['id_producto', 'cantidad', 'precio_unitario'],
        properties: {
          id_detalle: {
            type: 'integer',
            readOnly: true,
            description: 'ID único del detalle',
            example: 1
          },
          id_compra: {
            type: 'integer',
            description: 'ID de la compra asociada',
            example: 1
          },
          id_producto: {
            type: 'integer',
            description: 'ID del producto',
            example: 15
          },
          cantidad: {
            type: 'integer',
            minimum: 1,
            description: 'Cantidad comprada',
            example: 50
          },
          precio_unitario: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Precio unitario de compra',
            example: 80.00
          },
          subtotal: {
            type: 'number',
            format: 'decimal',
            readOnly: true,
            description: 'Subtotal calculado automáticamente (cantidad * precio_unitario)',
            example: 4000.00
      description: 'Servidor de producción'
    }
  ],
  tags: [
    {
      name: 'Métodos de pago',
      description: 'Gestión de métodos de pago del sistema. Los métodos de pago definen las formas en que los clientes pueden pagar sus compras (efectivo, tarjeta, transferencia, etc.). Se relacionan directamente con ventas y facturas. Incluye soporte para eliminación lógica mediante el campo activo.'
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
      MetodoPago: {
        type: 'object',
        properties: {
          id_metodo_pago: {
            type: 'integer',
            readOnly: true,
            description: 'ID único del método de pago',
            example: 1
          },
          nombre: {
            type: 'string',
            maxLength: 50,
            description: 'Nombre del método de pago (debe ser único)',
            example: 'Efectivo'
          },
          descripcion: {
            type: 'string',
            nullable: true,
            description: 'Descripción detallada del método de pago',
            example: 'Pago en efectivo al momento de la compra'
          },
          activo: {
            type: 'boolean',
            default: true,
            description: 'Estado activo/inactivo del método de pago. Usar para eliminación lógica',
            example: true
          }
        },
        required: ['nombre']
      },
      MetodoPagoCreateRequest: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: {
            type: 'string',
            maxLength: 50,
            minLength: 1,
            description: 'Nombre del método de pago (debe ser único)',
            example: 'PayPal'
          },
          descripcion: {
            type: 'string',
            nullable: true,
            description: 'Descripción detallada del método de pago (opcional)',
            example: 'Pagos en línea mediante PayPal'
          },
          activo: {
            type: 'boolean',
            default: true,
            description: 'Estado activo/inactivo (opcional, por defecto: true)',
            example: true
          }
        }
      },
      MetodoPagoUpdateRequest: {
        type: 'object',
        properties: {
          nombre: {
            type: 'string',
            maxLength: 50,
            minLength: 1,
            description: 'Nombre del método de pago (debe ser único)',
            example: 'PayPal Internacional'
          },
          descripcion: {
            type: 'string',
            nullable: true,
            description: 'Descripción detallada del método de pago',
            example: 'Pagos en línea mediante PayPal, acepta múltiples monedas'
          },
          activo: {
            type: 'boolean',
            description: 'Estado activo/inactivo. Usar false para eliminación lógica',
            example: true
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
            example: 'Error al procesar la solicitud'
          }
        }
      }
    }
  },
  paths: {
    '/api/compras': {
      get: {
        tags: ['Compras'],
        summary: 'Obtener todas las compras',
        description: 'Retorna un listado de todas las compras registradas en el sistema. Incluye información del usuario que registró la compra y los detalles de cada compra (productos, cantidades, precios). Soporta paginación opcional.',
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
            description: 'Cantidad de facturas por página'
              maximum: 100
            },
            description: 'Cantidad de compras por página',
            example: 10
          }
        ],
        responses: {
          200: {
            description: 'Lista de facturas obtenida exitosamente',
            description: 'Lista de compras obtenida exitosamente',
    '/api/metodos-pago': {
      get: {
        tags: ['Métodos de pago'],
        summary: 'Obtener todos los métodos de pago',
        description: 'Retorna un listado de todos los métodos de pago registrados en el sistema, ordenados por ID de forma ascendente. Incluye tanto métodos activos como inactivos.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de métodos de pago obtenida exitosamente',
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
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CompraConRelaciones' }
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/MetodoPago' }
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
                      id_compra: 1,
                      id_usuario: 3,
                      fecha: '2025-11-23T08:00:00.000Z',
                      total: 5000.00,
                      usuario: {
                        id_usuario: 3,
                        nombre: 'María González',
                        correo: 'maria@ferreteria.com'
                      },
                      detalles: [
                        {
                          id_detalle: 1,
                          id_compra: 1,
                          id_producto: 15,
                          cantidad: 50,
                          precio_unitario: 80.00,
                          subtotal: 4000.00,
                          producto: {
                            id_producto: 15,
                            nombre: 'Tornillos 1/4',
                            codigo: 'TOR-001'
                          }
                        },
                        {
                          id_detalle: 2,
                          id_compra: 1,
                          id_producto: 16,
                          cantidad: 50,
                          precio_unitario: 20.00,
                          subtotal: 1000.00,
                          producto: {
                            id_producto: 16,
                            nombre: 'Tuercas 1/4',
                            codigo: 'TUE-001'
                          }
                        }
                      ]
                      id_metodo_pago: 1,
                      nombre: 'Efectivo',
                      descripcion: 'Pago en efectivo al momento de la compra',
                      activo: true
                    },
                    {
                      id_metodo_pago: 2,
                      nombre: 'Tarjeta de Crédito',
                      descripcion: 'Visa, MasterCard, American Express',
                      activo: true
                    },
                    {
                      id_metodo_pago: 3,
                      nombre: 'Tarjeta de Débito',
                      descripcion: 'Tarjetas de débito bancarias',
                      activo: true
                    },
                    {
                      id_metodo_pago: 4,
                      nombre: 'Transferencia Bancaria',
                      descripcion: 'Transferencia electrónica bancaria',
                      activo: true
                    },
                    {
                      id_metodo_pago: 5,
                      nombre: 'SINPE Móvil',
                      descripcion: 'Sistema de pagos móviles de Costa Rica',
                      activo: true
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
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
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
                  error: 'Error al obtener compras: Database connection failed'
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Error al obtener métodos de pago: Database connection failed'
                }
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
        tags: ['Compras'],
        summary: 'Registrar una nueva compra',
        description: `Registra una nueva compra en el sistema. Permite incluir los detalles de la compra (productos, cantidades y precios) en la misma petición.

**Proceso al crear compra:**
1. Se crea el registro de compra con el total especificado
2. Si se incluyen detalles, se crean los registros de DetalleCompra
3. El subtotal de cada detalle se calcula automáticamente como cantidad * precio_unitario
4. Se retorna la compra completa con todos sus detalles y relaciones

**Nota importante:** Al registrar una compra, conceptualmente debería actualizarse el inventario de los productos comprados (aumentar el stock). Esta lógica debe implementarse a nivel de servicio o mediante triggers de base de datos según las necesidades del negocio.`,
        tags: ['Métodos de pago'],
        summary: 'Crear un nuevo método de pago',
        description: 'Registra un nuevo método de pago en el sistema. El nombre del método debe ser único. Solo usuarios con rol de Administrador (Rol 1) pueden crear métodos de pago.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CompraCreateRequest' },
              examples: {
                compraCompleta: {
                  summary: 'Compra con detalles de productos',
                  value: {
                    id_usuario: 3,
                    total: 5000.00,
                    fecha: '2025-11-23T08:00:00.000Z',
                    detalles: [
                      {
                        id_producto: 15,
                        cantidad: 50,
                        precio_unitario: 80.00
                      },
                      {
                        id_producto: 16,
                        cantidad: 50,
                        precio_unitario: 20.00
                      }
                    ]
                  }
                },
                compraSinDetalles: {
                  summary: 'Compra básica sin detalles',
                  value: {
                    id_usuario: 3,
                    total: 3500.00
                  }
                },
                compraSinUsuario: {
                  summary: 'Compra sin usuario asignado',
                  value: {
                    total: 2000.00,
                    detalles: [
                      {
                        id_producto: 20,
                        cantidad: 100,
                        precio_unitario: 20.00
                      }
                    ]
              schema: { $ref: '#/components/schemas/MetodoPagoCreateRequest' },
              examples: {
                metodoPagoCompleto: {
                  summary: 'Método de pago completo',
                  value: {
                    nombre: 'PayPal',
                    descripcion: 'Pagos en línea mediante PayPal',
                    activo: true
                  }
                },
                metodoPagoMinimo: {
                  summary: 'Método de pago con solo nombre',
                  value: {
                    nombre: 'Criptomonedas'
                  }
                },
                metodoPagoInactivo: {
                  summary: 'Método de pago creado como inactivo',
                  value: {
                    nombre: 'Cheque',
                    descripcion: 'Pago mediante cheque bancario',
                    activo: false
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Factura creada exitosamente',
            description: 'Compra registrada exitosamente',
            description: 'Método de pago creado exitosamente',
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
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Compra registrada exitosamente' },
                    data: { $ref: '#/components/schemas/CompraConRelaciones' }
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Método de pago creado exitosamente' },
                    data: { $ref: '#/components/schemas/MetodoPago' }
                  }
                },
                example: {
                  success: true,
                  message: 'Compra registrada exitosamente',
                  data: {
                    id_compra: 2,
                    id_usuario: 3,
                    fecha: '2025-11-23T08:00:00.000Z',
                    total: 5000.00,
                    usuario: {
                      id_usuario: 3,
                      nombre: 'María González',
                      correo: 'maria@ferreteria.com'
                    },
                    detalles: [
                      {
                        id_detalle: 3,
                        id_compra: 2,
                        id_producto: 15,
                        cantidad: 50,
                        precio_unitario: 80.00,
                        subtotal: 4000.00,
                        producto: {
                          id_producto: 15,
                          nombre: 'Tornillos 1/4',
                          codigo: 'TOR-001',
                          descripcion: 'Tornillos de acero inoxidable 1/4 pulgada'
                        }
                      },
                      {
                        id_detalle: 4,
                        id_compra: 2,
                        id_producto: 16,
                        cantidad: 50,
                        precio_unitario: 20.00,
                        subtotal: 1000.00,
                        producto: {
                          id_producto: 16,
                          nombre: 'Tuercas 1/4',
                          codigo: 'TUE-001',
                          descripcion: 'Tuercas de acero inoxidable 1/4 pulgada'
                        }
                      }
                    ]
                  message: 'Método de pago creado exitosamente',
                  data: {
                    id_metodo_pago: 6,
                    nombre: 'PayPal',
                    descripcion: 'Pagos en línea mediante PayPal',
                    activo: true
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
            description: 'Error de validación - Datos inválidos o faltantes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  totalRequerido: {
                    summary: 'Total no proporcionado',
                    value: {
                      success: false,
                      error: 'El total de la compra es requerido y debe ser mayor o igual a 0'
                    }
                  },
                  detallesInvalidos: {
                    summary: 'Detalles no son un arreglo',
                    value: {
                      success: false,
                      error: 'Los detalles deben ser un arreglo'
                  nombreRequerido: {
                    summary: 'Nombre no proporcionado',
                    value: {
                      success: false,
                      error: 'El nombre del método de pago es requerido'
                    }
                  },
                  nombreDuplicado: {
                    summary: 'Nombre ya existe',
                    value: {
                      success: false,
                      error: 'Ya existe un método de pago con ese nombre'
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Solo administradores pueden crear compras'
                  error: 'Acceso denegado. Solo administradores pueden crear métodos de pago'
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
    '/api/facturas/{id}': {
      get: {
        tags: ['Facturas'],
        summary: 'Obtener una factura por ID',
        description: 'Retorna la información detallada de una factura específica, incluyendo venta asociada, método de pago y todos los detalles (líneas) de la factura.',
    '/api/compras/{id}': {
      get: {
        tags: ['Compras'],
        summary: 'Obtener una compra por ID',
        description: 'Retorna los detalles completos de una compra específica, incluyendo el usuario que la registró y todos los detalles de la compra con información de los productos.',
    '/api/metodos-pago/{id}': {
      get: {
        tags: ['Métodos de pago'],
        summary: 'Obtener un método de pago por ID',
        description: 'Retorna los detalles de un método de pago específico mediante su ID.',
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
            description: 'ID de la compra',
            description: 'ID del método de pago',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Factura encontrada',
            description: 'Compra encontrada exitosamente',
            description: 'Método de pago encontrado exitosamente',
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
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CompraConRelaciones' }
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MetodoPago' }
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
                    id_compra: 1,
                    id_usuario: 3,
                    fecha: '2025-11-23T08:00:00.000Z',
                    total: 5000.00,
                    usuario: {
                      id_usuario: 3,
                      nombre: 'María González',
                      correo: 'maria@ferreteria.com'
                    },
                    detalles: [
                      {
                        id_detalle: 1,
                        id_compra: 1,
                        id_producto: 15,
                        cantidad: 50,
                        precio_unitario: 80.00,
                        subtotal: 4000.00,
                        producto: {
                          id_producto: 15,
                          nombre: 'Tornillos 1/4',
                          codigo: 'TOR-001',
                          descripcion: 'Tornillos de acero inoxidable 1/4 pulgada'
                        }
                      },
                      {
                        id_detalle: 2,
                        id_compra: 1,
                        id_producto: 16,
                        cantidad: 50,
                        precio_unitario: 20.00,
                        subtotal: 1000.00,
                        producto: {
                          id_producto: 16,
                          nombre: 'Tuercas 1/4',
                          codigo: 'TUE-001',
                          descripcion: 'Tuercas de acero inoxidable 1/4 pulgada'
                        }
                      }
                    ]
                    id_metodo_pago: 1,
                    nombre: 'Efectivo',
                    descripcion: 'Pago en efectivo al momento de la compra',
                    activo: true
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
            description: 'Factura no encontrada',
                  error: 'Acceso denegado. Solo administradores pueden actualizar ventas'
                }
              }
            }
          },
          404: {
            description: 'Venta no encontrada',
            description: 'Compra no encontrada',
            description: 'Método de pago no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Factura no encontrada'
                  error: 'Venta no encontrada'
                  error: 'Compra no encontrada'
                  error: 'Método de pago no encontrado'
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
        tags: ['Compras'],
        summary: 'Actualizar una compra existente',
        description: 'Actualiza la información de una compra. Solo se modifican los campos proporcionados en el body. Requiere rol de Administrador (Rol 1). **Nota:** Esta operación no actualiza los detalles de la compra, solo los campos principales (usuario, total, fecha).',
        tags: ['Métodos de pago'],
        summary: 'Actualizar un método de pago existente',
        description: 'Actualiza la información de un método de pago. Solo se modifican los campos proporcionados en el body. Requiere rol de Administrador (Rol 1). **Recomendación:** Para deshabilitar un método de pago, usar este endpoint con `activo: false` en lugar de eliminarlo (eliminación lógica).',
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
            description: 'ID de la compra a actualizar',
            description: 'ID del método de pago a actualizar',
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
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CompraUpdateRequest' },
              examples: {
                actualizarTotal: {
                  summary: 'Actualizar solo el total',
                  value: {
                    total: 5500.00
                  }
                },
                actualizarCompleto: {
                  summary: 'Actualización completa',
                  value: {
                    id_usuario: 3,
                    total: 5500.00,
                    fecha: '2025-11-23T09:00:00.000Z'
                  }
                },
                actualizarFecha: {
                  summary: 'Actualizar solo la fecha',
                  value: {
                    fecha: '2025-11-24T10:00:00.000Z'
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MetodoPagoUpdateRequest' },
              examples: {
                actualizarNombre: {
                  summary: 'Actualizar solo nombre',
                  value: {
                    nombre: 'PayPal Internacional'
                  }
                },
                actualizarDescripcion: {
                  summary: 'Actualizar solo descripción',
                  value: {
                    descripcion: 'Pago en efectivo, colones o dólares'
                  }
                },
                deshabilitarMetodo: {
                  summary: 'Deshabilitar método (eliminación lógica)',
                  value: {
                    activo: false
                  }
                },
                actualizarCompleto: {
                  summary: 'Actualización completa',
                  value: {
                    nombre: 'PayPal Internacional',
                    descripcion: 'Pagos en línea mediante PayPal, acepta múltiples monedas',
                    activo: true
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
            description: 'Compra actualizada exitosamente',
            description: 'Método de pago actualizado exitosamente',
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
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Método de pago actualizado exitosamente' },
                    data: { $ref: '#/components/schemas/MetodoPago' }
                  }
                },
                example: {
                  success: true,
                  message: 'Método de pago actualizado exitosamente',
                  data: {
                    id_metodo_pago: 6,
                    nombre: 'PayPal Internacional',
                    descripcion: 'Pagos en línea mediante PayPal, acepta múltiples monedas',
                    activo: true
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
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Compra actualizada exitosamente' },
                    data: { $ref: '#/components/schemas/CompraConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  message: 'Compra actualizada exitosamente',
                  data: {
                    id_compra: 1,
                    id_usuario: 3,
                    fecha: '2025-11-23T09:00:00.000Z',
                    total: 5500.00,
                    usuario: {
                      id_usuario: 3,
                      nombre: 'María González',
                      correo: 'maria@ferreteria.com'
                    },
                    detalles: [
                      {
                        id_detalle: 1,
                        id_compra: 1,
                        id_producto: 15,
                        cantidad: 50,
                        precio_unitario: 80.00,
                        subtotal: 4000.00,
                        producto: {
                          id_producto: 15,
                          nombre: 'Tornillos 1/4',
                          codigo: 'TOR-001',
                          descripcion: 'Tornillos de acero inoxidable 1/4 pulgada'
                        }
                      }
                    ]
                  }
            description: 'Error de validación - Nombre duplicado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Ya existe un método de pago con ese nombre'
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Solo administradores pueden actualizar compras'
                  error: 'Acceso denegado. Solo administradores pueden actualizar métodos de pago'
                }
              }
            }
          },
          404: {
            description: 'Factura no encontrada',
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            description: 'Compra no encontrada',
            description: 'Método de pago no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Factura no encontrada'
                  error: 'Compra no encontrada'
                  error: 'Método de pago no encontrado'
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
        tags: ['Compras'],
        summary: 'Eliminar una compra',
        description: 'Elimina permanentemente una compra del sistema, incluyendo todos sus detalles asociados. Esta operación es irreversible. Requiere rol de Administrador (Rol 1). **ADVERTENCIA:** Esta operación elimina permanentemente el registro de la base de datos. Considere implementar eliminación lógica (campo estado o activo) en lugar de eliminación física para mantener el historial. También evalúe el impacto en el inventario: ¿se debe revertir el aumento de stock que se hizo al registrar la compra?',
        tags: ['Métodos de pago'],
        summary: 'Eliminar un método de pago',
        description: `Elimina permanentemente un método de pago del sistema. Esta operación es irreversible. Requiere rol de Administrador (Rol 1).

**⚠️ ADVERTENCIAS IMPORTANTES:**
- Esta operación elimina permanentemente el registro de la base de datos
- Antes de eliminar, asegúrese de que el método de pago NO esté siendo utilizado en ventas o facturas existentes, ya que esto podría causar problemas de integridad referencial
- **RECOMENDACIÓN:** En lugar de eliminar, considere usar PUT con \`activo: false\` para implementar eliminación lógica. Esto preserva el historial y evita problemas de integridad de datos`,
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
            description: 'ID de la compra a eliminar',
            example: 1
            description: 'ID del método de pago a eliminar',
            example: 6
          }
        ],
        responses: {
          200: {
            description: 'Factura eliminada exitosamente',
            description: 'Compra eliminada exitosamente',
            description: 'Método de pago eliminado exitosamente',
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
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Compra eliminada exitosamente' }
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Método de pago eliminado exitosamente' }
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
              }
            }
          },
          404: {
            description: 'Factura no encontrada',
                  error: 'Acceso denegado. Solo administradores pueden eliminar ventas'
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Solo administradores pueden eliminar compras'
                  error: 'Acceso denegado. Solo administradores pueden eliminar métodos de pago'
                }
              }
            }
          },
          404: {
            description: 'Venta no encontrada',
            description: 'Compra no encontrada',
            description: 'Método de pago no encontrado',
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
                  error: 'Compra no encontrada'
                  error: 'Método de pago no encontrado'
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
            description: 'Error interno del servidor (puede incluir errores de integridad referencial)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'No se puede eliminar el método de pago porque está siendo utilizado en ventas existentes'
                }
              }
            }
          }
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
