const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Compras
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
                  description: 'ID del producto comprado',
                  example: 15
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
            description: 'Cantidad de compras por página',
            example: 10
          }
        ],
        responses: {
          200: {
            description: 'Lista de compras obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CompraConRelaciones' }
                    }
                  }
                },
                example: {
                  success: true,
                  data: [
                    {
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
                  error: 'Error al obtener compras: Database connection failed'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Compras'],
        summary: 'Registrar una nueva compra',
        description: `Registra una nueva compra en el sistema. Permite incluir los detalles de la compra (productos, cantidades y precios) en la misma petición.

**Proceso al crear compra:**
1. Se crea el registro de compra con el total especificado
2. Si se incluyen detalles, se crean los registros de DetalleCompra
3. El subtotal de cada detalle se calcula automáticamente como cantidad * precio_unitario
4. Se retorna la compra completa con todos sus detalles y relaciones

**Nota importante:** Al registrar una compra, conceptualmente debería actualizarse el inventario de los productos comprados (aumentar el stock). Esta lógica debe implementarse a nivel de servicio o mediante triggers de base de datos según las necesidades del negocio.`,
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
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Compra registrada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Compra registrada exitosamente' },
                    data: { $ref: '#/components/schemas/CompraConRelaciones' }
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
                  error: 'Acceso denegado. Solo administradores pueden crear compras'
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
    '/api/compras/{id}': {
      get: {
        tags: ['Compras'],
        summary: 'Obtener una compra por ID',
        description: 'Retorna los detalles completos de una compra específica, incluyendo el usuario que la registró y todos los detalles de la compra con información de los productos.',
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
            description: 'ID de la compra',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Compra encontrada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CompraConRelaciones' }
                  }
                },
                example: {
                  success: true,
                  data: {
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
            description: 'Compra no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Compra no encontrada'
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
        tags: ['Compras'],
        summary: 'Actualizar una compra existente',
        description: 'Actualiza la información de una compra. Solo se modifican los campos proporcionados en el body. Requiere rol de Administrador (Rol 1). **Nota:** Esta operación no actualiza los detalles de la compra, solo los campos principales (usuario, total, fecha).',
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
            description: 'ID de la compra a actualizar',
            example: 1
          }
        ],
        requestBody: {
          required: true,
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
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Compra actualizada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
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
                  error: 'Acceso denegado. Solo administradores pueden actualizar compras'
                }
              }
            }
          },
          404: {
            description: 'Compra no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Compra no encontrada'
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
        tags: ['Compras'],
        summary: 'Eliminar una compra',
        description: 'Elimina permanentemente una compra del sistema, incluyendo todos sus detalles asociados. Esta operación es irreversible. Requiere rol de Administrador (Rol 1). **ADVERTENCIA:** Esta operación elimina permanentemente el registro de la base de datos. Considere implementar eliminación lógica (campo estado o activo) en lugar de eliminación física para mantener el historial. También evalúe el impacto en el inventario: ¿se debe revertir el aumento de stock que se hizo al registrar la compra?',
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
            description: 'ID de la compra a eliminar',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Compra eliminada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Compra eliminada exitosamente' }
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
                  error: 'Acceso denegado. Solo administradores pueden eliminar compras'
                }
              }
            }
          },
          404: {
            description: 'Compra no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Compra no encontrada'
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
