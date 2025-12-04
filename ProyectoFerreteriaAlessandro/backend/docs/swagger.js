const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger para la API de Ferretería Alessandro
 * OpenAPI 3.0.0
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
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
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
            description: 'Cantidad de productos por página'
          }
        ],
        responses: {
          200: {
            description: 'Lista de productos obtenida exitosamente',
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
                    }
                  }
                },
                examples: {
                  success: {
                    summary: 'Respuesta exitosa',
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
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Token no válido o no proporcionado'
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
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Producto creado exitosamente',
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
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Producto encontrado',
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
      put: {
        tags: ['Productos'],
        summary: 'Actualizar un producto',
        description: 'Actualiza la información de un producto existente. Todos los campos son opcionales (actualización parcial). Requiere autenticación y permisos de administrador.',
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
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Producto actualizado exitosamente',
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
      put: {
        tags: ['Facturas'],
        summary: 'Actualizar una factura',
        description: 'Actualiza la información de una factura existente. Todos los campos son opcionales (actualización parcial). Requiere autenticación y permisos de administrador.',
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
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
