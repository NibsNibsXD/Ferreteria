const swaggerJsdoc = require('swagger-jsdoc');

/**
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
                  error: 'Error al obtener métodos de pago: Database connection failed'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Métodos de pago'],
        summary: 'Crear un nuevo método de pago',
        description: 'Registra un nuevo método de pago en el sistema. El nombre del método debe ser único. Solo usuarios con rol de Administrador (Rol 1) pueden crear métodos de pago.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
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
            description: 'Método de pago creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Método de pago creado exitosamente' },
                    data: { $ref: '#/components/schemas/MetodoPago' }
                  }
                },
                example: {
                  success: true,
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
            description: 'Error de validación - Datos inválidos o faltantes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
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
            description: 'ID del método de pago',
            example: 1
          }
        ],
        responses: {
          200: {
            description: 'Método de pago encontrado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MetodoPago' }
                  }
                },
                example: {
                  success: true,
                  data: {
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
            description: 'Sin autenticación - Token no proporcionado o inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          404: {
            description: 'Método de pago no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
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
            description: 'ID del método de pago a actualizar',
            example: 1
          }
        ],
        requestBody: {
          required: true,
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
            description: 'Método de pago actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
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
            description: 'Sin autorización - Usuario no tiene rol de administrador',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Acceso denegado. Solo administradores pueden actualizar métodos de pago'
                }
              }
            }
          },
          404: {
            description: 'Método de pago no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
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
            description: 'ID del método de pago a eliminar',
            example: 6
          }
        ],
        responses: {
          200: {
            description: 'Método de pago eliminado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Método de pago eliminado exitosamente' }
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
                  error: 'Acceso denegado. Solo administradores pueden eliminar métodos de pago'
                }
              }
            }
          },
          404: {
            description: 'Método de pago no encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: 'Método de pago no encontrado'
                }
              }
            }
          },
          500: {
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
