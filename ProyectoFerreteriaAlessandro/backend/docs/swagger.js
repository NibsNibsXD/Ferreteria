const swaggerJsdoc = require('swagger-jsdoc');

/**
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
            description: 'Cantidad de ventas por página',
            example: 10
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
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/VentaConRelaciones' }
                    }
                  }
                },
                examples: {
                  ventasConPaginacion: {
                    summary: 'Lista de ventas con paginación',
                    value: {
                      success: true,
                      data: [
                        {
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
                  error: 'Error al obtener ventas: Database connection failed'
                }
              }
            }
          }
        }
      },
      post: {
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
            description: 'Venta creada exitosamente con factura y detalles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/VentaConRelaciones' }
                  }
                },
                example: {
                  success: true,
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
            description: 'Error de validación - Datos inválidos o faltantes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
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
            description: 'Sin autenticación - Token no proporcionado o inválido',
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
            description: 'ID de la venta',
            example: 1
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
                },
                example: {
                  success: true,
                  data: {
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
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
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
            description: 'ID de la venta a actualizar',
            example: 1
          }
        ],
        requestBody: {
          required: true,
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
            description: 'Venta actualizada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
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

const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
