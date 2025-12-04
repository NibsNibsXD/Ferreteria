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
