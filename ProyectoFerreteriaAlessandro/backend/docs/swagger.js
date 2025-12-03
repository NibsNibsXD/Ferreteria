const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Detalles de Compra
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
      name: 'Detalles de compra',
      description: 'Gestión de detalles (líneas/items) de compras. Los detalles de compra representan los productos individuales incluidos en cada compra, especificando cantidad, precio unitario y subtotal. Se relacionan con Compras y Productos. Incluye cálculo automático de subtotales.'
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
      DetalleCompra: {
        type: 'object',
        properties: {
          id_detalle: {
            type: 'integer',
            readOnly: true,
            description: 'ID único del detalle de compra',
            example: 1
          },
          id_compra: {
            type: 'integer',
            nullable: true,
            description: 'ID de la compra asociada',
            example: 5
          },
          id_producto: {
            type: 'integer',
            nullable: true,
            description: 'ID del producto comprado',
            example: 10
          },
          cantidad: {
            type: 'integer',
            minimum: 1,
            description: 'Cantidad de unidades compradas',
            example: 50
          },
          precio_unitario: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Precio unitario de compra',
            example: 15.50
          },
          subtotal: {
            type: 'number',
            format: 'decimal',
            nullable: true,
            description: 'Subtotal calculado automáticamente (cantidad * precio_unitario). Se puede proporcionar manualmente para casos especiales (descuentos, ajustes)',
            example: 775.00
          }
        },
        required: ['cantidad', 'precio_unitario']
      },
      DetalleCompraConRelaciones: {
        allOf: [
          { $ref: '#/components/schemas/DetalleCompra' },
          {
            type: 'object',
            properties: {
              compra: {
                type: 'object',
                nullable: true,
                properties: {
                  id_compra: { type: 'integer', example: 5 },
                  fecha: { type: 'string', format: 'date-time', example: '2025-11-20T10:30:00.000Z' },
                  total: { type: 'number', format: 'decimal', example: 1550.00 },
                  id_usuario: { type: 'integer', example: 2 }
                }
              },
              producto: {
                type: 'object',
                nullable: true,
                properties: {
                  id_producto: { type: 'integer', example: 10 },
                  nombre: { type: 'string', example: 'Tornillo 1/4 x 2"' },
                  codigo_barra: { type: 'string', example: '7501234567890' },
                  descripcion: { type: 'string', example: 'Tornillo de acero galvanizado' },
                  precio_compra: { type: 'number', format: 'decimal', example: 12.00 },
                  precio_venta: { type: 'number', format: 'decimal', example: 20.00 },
                  stock: { type: 'integer', example: 500 }
                }
              }
            }
          }
        ]
      },
      DetalleCompraCreateRequest: {
        type: 'object',
        required: ['id_compra', 'id_producto', 'cantidad', 'precio_unitario'],
        properties: {
          id_compra: {
            type: 'integer',
            description: 'ID de la compra asociada',
            example: 5
          },
          id_producto: {
            type: 'integer',
            description: 'ID del producto comprado',
            example: 10
          },
          cantidad: {
            type: 'integer',
            minimum: 1,
            description: 'Cantidad de unidades compradas (debe ser mayor a 0)',
            example: 50
          },
          precio_unitario: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Precio unitario de compra (debe ser >= 0)',
            example: 15.50
          },
          subtotal: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Subtotal opcional. Si no se proporciona, se calcula automáticamente como cantidad * precio_unitario',
            example: 775.00
          }
        }
      },
      DetalleCompraUpdateRequest: {
        type: 'object',
        properties: {
          id_compra: {
            type: 'integer',
            description: 'ID de la compra asociada',
            example: 5
          },
          id_producto: {
            type: 'integer',
            description: 'ID del producto comprado',
            example: 10
          },
          cantidad: {
            type: 'integer',
            minimum: 1,
            description: 'Cantidad de unidades compradas (debe ser mayor a 0)',
            example: 60
          },
          precio_unitario: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Precio unitario de compra (debe ser >= 0)',
            example: 16.00
          },
          subtotal: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Subtotal. Si no se proporciona, se recalcula automáticamente',
            example: 960.00
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
    '/api/detalles-compra': {
      get: {
        tags: ['Detalles de compra'],
        summary: 'Obtener todos los detalles de compra',
        description: 'Retorna un listado de todos los detalles de compra registrados en el sistema, ordenados por ID de forma ascendente. Incluye información de la compra asociada y el producto. Soporta paginación opcional.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'integer',
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
              maximum: 100
            },
            description: 'Cantidad de detalles por página',
            example: 10
          }
        ],
        responses: {
          200: {
            description: 'Lista de detalles de compra obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/DetalleCompraConRelaciones' }
                    }
                  }
                },
                example: {
                  success: true,
                  data: [
                    {
                      id_detalle: 1,
                      id_compra: 5,
                      id_producto: 10,
                      cantidad: 50,
                      precio_unitario: 15.50,
                      subtotal: 775.00,
                      compra: {
                        id_compra: 5,
                        fecha: '2025-11-20T10:30:00.000Z',
                        total: 1550.00,
                        id_usuario: 2
                      },
                      producto: {
                        id_producto: 10,
                        nombre: 'Tornillo 1/4 x 2"',
                        codigo_barra: '7501234567890',
                        precio_compra: 12.00,
                        precio_venta: 20.00
                      }
                    }
                  ]
                }
              }
            }
          },
          401: {
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
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Error al obtener detalles de compra: Database connection failed'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Detalles de compra'],
        summary: 'Crear un nuevo detalle de compra',
        description: `Crea un nuevo detalle (línea/item) de compra. Solo usuarios con rol de Administrador (Rol 1) pueden crear detalles de compra.

**Proceso automático:**
- El subtotal se calcula automáticamente como \`cantidad * precio_unitario\` si no se proporciona
- Se retorna el detalle completo con información de la compra y producto asociados

**Nota importante:** Actualmente NO se actualiza automáticamente el stock del producto. Esta lógica debe implementarse según las necesidades del negocio (triggers de BD, lógica en service, o transacciones en módulo de Compra).`,
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DetalleCompraCreateRequest' },
              examples: {
                detalleCompleto: {
                  summary: 'Detalle con subtotal manual',
                  value: {
                    id_compra: 5,
                    id_producto: 10,
                    cantidad: 50,
                    precio_unitario: 15.50,
                    subtotal: 775.00
                  }
                },
                detalleAutomatico: {
                  summary: 'Detalle con subtotal automático',
                  value: {
                    id_compra: 5,
                    id_producto: 10,
                    cantidad: 50,
                    precio_unitario: 15.50
                  }
                },
                detalleMinimo: {
                  summary: 'Detalle con campos mínimos',
                  value: {
                    id_compra: 8,
                    id_producto: 25,
                    cantidad: 100,
                    precio_unitario: 8.75
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Detalle de compra creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Detalle de compra creado exitosamente' },
                    data: { $ref: '#/components/schemas/DetalleCompraConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  message: 'Detalle de compra creado exitosamente',
                  data: {
                    id_detalle: 1,
                    id_compra: 5,
                    id_producto: 10,
                    cantidad: 50,
                    precio_unitario: 15.50,
                    subtotal: 775.00,
                    compra: {
                      id_compra: 5,
                      fecha: '2025-11-20T10:30:00.000Z',
                      total: 1550.00,
                      id_usuario: 2
                    },
                    producto: {
                      id_producto: 10,
                      nombre: 'Tornillo 1/4 x 2"',
                      codigo_barra: '7501234567890',
                      descripcion: 'Tornillo de acero galvanizado',
                      precio_compra: 12.00,
                      precio_venta: 20.00,
                      stock: 500
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Error de validación - Datos inválidos o faltantes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  compraRequerida: {
                    summary: 'ID de compra no proporcionado',
                    value: {
                      success: false,
                      error: 'El ID de la compra es requerido'
                    }
                  },
                  productoRequerido: {
                    summary: 'ID de producto no proporcionado',
                    value: {
                      success: false,
                      error: 'El ID del producto es requerido'
                    }
                  },
                  cantidadInvalida: {
                    summary: 'Cantidad inválida',
                    value: {
                      success: false,
                      error: 'La cantidad debe ser mayor a 0'
                    }
                  },
                  precioInvalido: {
                    summary: 'Precio inválido',
                    value: {
                      success: false,
                      error: 'El precio unitario es requerido y debe ser mayor o igual a 0'
                    }
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Solo administradores pueden crear detalles de compra'
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
    '/api/detalles-compra/{id}': {
      get: {
        tags: ['Detalles de compra'],
        summary: 'Obtener un detalle de compra por ID',
        description: 'Retorna la información detallada de un detalle de compra específico, incluyendo información completa de la compra asociada y el producto.',
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
            description: 'ID del detalle de compra',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Detalle de compra encontrado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/DetalleCompraConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  data: {
                    id_detalle: 1,
                    id_compra: 5,
                    id_producto: 10,
                    cantidad: 50,
                    precio_unitario: 15.50,
                    subtotal: 775.00,
                    compra: {
                      id_compra: 5,
                      fecha: '2025-11-20T10:30:00.000Z',
                      total: 1550.00,
                      id_usuario: 2
                    },
                    producto: {
                      id_producto: 10,
                      nombre: 'Tornillo 1/4 x 2"',
                      codigo_barra: '7501234567890',
                      descripcion: 'Tornillo de acero galvanizado',
                      precio_compra: 12.00,
                      precio_venta: 20.00,
                      stock: 500
                    }
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
          404: {
            description: 'Detalle de compra no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Detalle de compra no encontrado'
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
        tags: ['Detalles de compra'],
        summary: 'Actualizar un detalle de compra existente',
        description: 'Actualiza la información de un detalle de compra. Solo se modifican los campos proporcionados en el body. Requiere rol de Administrador (Rol 1). **Nota:** Si se actualizan cantidad o precio_unitario y no se proporciona subtotal, éste se recalcula automáticamente.',
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
            description: 'ID del detalle de compra a actualizar',
            example: 1
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DetalleCompraUpdateRequest' },
              examples: {
                actualizarCantidad: {
                  summary: 'Actualizar solo cantidad',
                  value: {
                    cantidad: 60
                  }
                },
                actualizarPrecio: {
                  summary: 'Actualizar solo precio',
                  value: {
                    precio_unitario: 16.00
                  }
                },
                actualizarCantidadYPrecio: {
                  summary: 'Actualizar cantidad y precio (subtotal se recalcula)',
                  value: {
                    cantidad: 60,
                    precio_unitario: 16.00
                  }
                },
                actualizarCompleto: {
                  summary: 'Actualización completa con subtotal manual',
                  value: {
                    id_compra: 5,
                    id_producto: 10,
                    cantidad: 60,
                    precio_unitario: 16.00,
                    subtotal: 960.00
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Detalle de compra actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Detalle de compra actualizado exitosamente' },
                    data: { $ref: '#/components/schemas/DetalleCompraConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  message: 'Detalle de compra actualizado exitosamente',
                  data: {
                    id_detalle: 1,
                    id_compra: 5,
                    id_producto: 10,
                    cantidad: 60,
                    precio_unitario: 16.00,
                    subtotal: 960.00,
                    compra: {
                      id_compra: 5,
                      fecha: '2025-11-20T10:30:00.000Z',
                      total: 1550.00,
                      id_usuario: 2
                    },
                    producto: {
                      id_producto: 10,
                      nombre: 'Tornillo 1/4 x 2"',
                      codigo_barra: '7501234567890',
                      descripcion: 'Tornillo de acero galvanizado',
                      precio_compra: 12.00,
                      precio_venta: 20.00,
                      stock: 500
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Error de validación - Datos inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  cantidadInvalida: {
                    summary: 'Cantidad inválida',
                    value: {
                      success: false,
                      error: 'La cantidad debe ser mayor a 0'
                    }
                  },
                  precioInvalido: {
                    summary: 'Precio inválido',
                    value: {
                      success: false,
                      error: 'El precio unitario debe ser mayor o igual a 0'
                    }
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Solo administradores pueden actualizar detalles de compra'
                }
              }
            }
          },
          404: {
            description: 'Detalle de compra no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Detalle de compra no encontrado'
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
        tags: ['Detalles de compra'],
        summary: 'Eliminar un detalle de compra',
        description: `Elimina permanentemente un detalle de compra del sistema. Esta operación es irreversible. Requiere rol de Administrador (Rol 1).

**⚠️ ADVERTENCIAS:**
- Esta operación elimina permanentemente el registro de la base de datos
- Al eliminar detalles de una compra, considere recalcular el total de la compra
- **Nota:** Actualmente NO se ajusta el stock del producto automáticamente. Evaluar implementar esta lógica según necesidades del negocio
- Considere implementar soft delete (campo activo/estado) para mantener historial y auditoría`,
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
            description: 'ID del detalle de compra a eliminar',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Detalle de compra eliminado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Detalle de compra eliminado exitosamente' }
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Solo administradores pueden eliminar detalles de compra'
                }
              }
            }
          },
          404: {
            description: 'Detalle de compra no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Detalle de compra no encontrado'
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

const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
