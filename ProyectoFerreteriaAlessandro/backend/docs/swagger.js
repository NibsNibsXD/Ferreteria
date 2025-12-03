const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de Swagger/OpenAPI 3.0 para API Ferretería Alessandro
 * Módulo: Reportes (con exportación a Excel y PDF)
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
      name: 'Reportes',
      description: 'Generación de reportes del sistema con soporte para exportación a Excel y PDF. Incluye reportes de ventas, compras, inventario, productos más vendidos y clientes frecuentes. Los reportes JSON están disponibles para todos los usuarios autenticados, mientras que las exportaciones requieren rol de Administrador.'
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
      // Respuestas genéricas
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            description: 'Datos del reporte',
            items: { type: 'object' }
          },
          total: {
            type: 'integer',
            description: 'Cantidad de registros retornados',
            example: 25
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error al procesar la solicitud' }
        }
      }
    }
  },
  paths: {
    '/api/reportes/ventas': {
      get: {
        tags: ['Reportes'],
        summary: 'Obtener reporte de ventas por periodo (JSON)',
        description: 'Retorna un listado de ventas filtradas por periodo de fechas. Incluye información de usuario, cliente y método de pago. Si no se especifican fechas, retorna todas las ventas.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date', example: '2025-01-01' },
            description: 'Fecha de inicio del periodo (YYYY-MM-DD)'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date', example: '2025-12-31' },
            description: 'Fecha de fin del periodo (YYYY-MM-DD)'
          }
        ],
        responses: {
          200: {
            description: 'Reporte de ventas generado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  data: [
                    {
                      id_venta: 1,
                      codigo_factura: 'FAC-1732467890123-456',
                      fecha: '2025-11-23T14:30:00.000Z',
                      total: 1250.50,
                      estado: 'completada',
                      usuario: { id_usuario: 5, nombre: 'Juan', apellido: 'Pérez' },
                      cliente: { id_cliente: 12, nombre: 'María', apellido: 'González', telefono: '+504 9999-8888' },
                      metodo_pago: { id_metodo_pago: 1, nombre: 'Efectivo' }
                    }
                  ],
                  total: 1
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/ventas/export': {
      get: {
        tags: ['Reportes'],
        summary: 'Exportar reporte de ventas a Excel o PDF',
        description: 'Genera y descarga un archivo Excel (.xlsx) o PDF con el reporte de ventas filtrado por periodo. Solo usuarios con rol de Administrador (Rol 1) pueden exportar reportes.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'formato',
            required: true,
            schema: { type: 'string', enum: ['excel', 'pdf'], example: 'excel' },
            description: 'Formato de exportación: "excel" o "pdf"'
          },
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date', example: '2025-01-01' },
            description: 'Fecha de inicio del periodo (YYYY-MM-DD)'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date', example: '2025-12-31' },
            description: 'Fecha de fin del periodo (YYYY-MM-DD)'
          }
        ],
        responses: {
          200: {
            description: 'Archivo generado exitosamente',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' }
              },
              'application/pdf': {
                schema: { type: 'string', format: 'binary' }
              }
            },
            headers: {
              'Content-Disposition': {
                schema: { type: 'string', example: 'attachment; filename=reporte-ventas-1732468000000.xlsx' },
                description: 'Nombre del archivo descargable'
              }
            }
          },
          400: { description: 'Formato inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, error: 'Formato inválido. Use "excel" o "pdf"' } } } },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin autorización (solo administradores)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error al generar archivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/compras': {
      get: {
        tags: ['Reportes'],
        summary: 'Obtener reporte de compras por periodo (JSON)',
        description: 'Retorna un listado de compras filtradas por periodo de fechas. Incluye información de usuario y detalles de compra.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date', example: '2025-01-01' },
            description: 'Fecha de inicio del periodo (YYYY-MM-DD)'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date', example: '2025-12-31' },
            description: 'Fecha de fin del periodo (YYYY-MM-DD)'
          }
        ],
        responses: {
          200: {
            description: 'Reporte de compras generado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  data: [
                    {
                      id_compra: 1,
                      fecha: '2025-11-20T10:30:00.000Z',
                      total: 5000.00,
                      usuario: { id_usuario: 3, nombre: 'María', apellido: 'González' },
                      detalles: [
                        { id_detalle: 1, id_producto: 15, cantidad: 50, precio_unitario: 80.00, subtotal: 4000.00 }
                      ]
                    }
                  ],
                  total: 1
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/compras/export': {
      get: {
        tags: ['Reportes'],
        summary: 'Exportar reporte de compras a Excel o PDF',
        description: 'Genera y descarga un archivo Excel o PDF con el reporte de compras. Requiere rol de Administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'formato',
            required: true,
            schema: { type: 'string', enum: ['excel', 'pdf'], example: 'pdf' },
            description: 'Formato de exportación'
          },
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de inicio del periodo'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de fin del periodo'
          }
        ],
        responses: {
          200: {
            description: 'Archivo generado exitosamente',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } },
              'application/pdf': { schema: { type: 'string', format: 'binary' } }
            }
          },
          400: { description: 'Formato inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin autorización', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error al generar archivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/inventario': {
      get: {
        tags: ['Reportes'],
        summary: 'Obtener reporte de inventario actual (JSON)',
        description: 'Retorna el listado completo de productos activos con su stock actual, precios y estado.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Reporte de inventario generado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  data: [
                    {
                      id_producto: 10,
                      nombre: 'Tornillo 1/4 x 2"',
                      codigo_barra: '7501234567890',
                      precio_compra: 12.00,
                      precio_venta: 20.00,
                      stock: 500,
                      stock_minimo: 100,
                      activo: true,
                      categoria: { id_categoria: 2, nombre: 'Ferretería' }
                    }
                  ],
                  total: 1
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/inventario/export': {
      get: {
        tags: ['Reportes'],
        summary: 'Exportar reporte de inventario a Excel o PDF',
        description: 'Genera archivo con el inventario actual de productos. Incluye columnas: ID, Código Barra, Nombre, Categoría, Precios, Stock, Stock Mínimo y Estado. Requiere rol de Administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'formato',
            required: true,
            schema: { type: 'string', enum: ['excel', 'pdf'], example: 'excel' },
            description: 'Formato de exportación'
          }
        ],
        responses: {
          200: {
            description: 'Archivo generado exitosamente',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } },
              'application/pdf': { schema: { type: 'string', format: 'binary' } }
            }
          },
          400: { description: 'Formato inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin autorización', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error al generar archivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/inventario/bajo-stock': {
      get: {
        tags: ['Reportes'],
        summary: 'Obtener productos con bajo stock (JSON)',
        description: 'Retorna productos cuyo stock actual es menor o igual al stock mínimo. Ordenados por stock ascendente.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Reporte de bajo stock generado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  data: [
                    {
                      id_producto: 15,
                      nombre: 'Clavos 2"',
                      codigo_barra: '7509876543210',
                      stock: 10,
                      stock_minimo: 50,
                      categoria: { id_categoria: 2, nombre: 'Ferretería' }
                    }
                  ],
                  total: 1
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/inventario/bajo-stock/export': {
      get: {
        tags: ['Reportes'],
        summary: 'Exportar productos con bajo stock',
        description: 'Genera archivo con productos que requieren reposición. Incluye diferencia entre stock actual y mínimo. Requiere rol de Administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'formato',
            required: true,
            schema: { type: 'string', enum: ['excel', 'pdf'] },
            description: 'Formato de exportación'
          }
        ],
        responses: {
          200: {
            description: 'Archivo generado exitosamente',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } },
              'application/pdf': { schema: { type: 'string', format: 'binary' } }
            }
          },
          400: { description: 'Formato inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin autorización', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error al generar archivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/productos/mas-vendidos': {
      get: {
        tags: ['Reportes'],
        summary: 'Obtener productos más vendidos (JSON)',
        description: 'Retorna los productos más vendidos ordenados por cantidad vendida. Permite filtrar por periodo y limitar resultados.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20, example: 20 },
            description: 'Cantidad de productos a retornar (default: 20)'
          },
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de inicio del periodo'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de fin del periodo'
          }
        ],
        responses: {
          200: {
            description: 'Reporte generado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  data: [
                    {
                      id_producto: 10,
                      total_vendido: 150,
                      total_ingresos: 3000.00,
                      producto: {
                        nombre: 'Tornillo 1/4',
                        codigo_barra: '7501234567890',
                        precio_venta: 20.00,
                        stock: 350,
                        categoria: { nombre: 'Ferretería' }
                      }
                    }
                  ],
                  total: 1
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/productos/mas-vendidos/export': {
      get: {
        tags: ['Reportes'],
        summary: 'Exportar productos más vendidos',
        description: 'Genera archivo con estadísticas de productos más vendidos. Incluye cantidad vendida, ingresos totales y stock actual. Requiere rol de Administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'formato',
            required: true,
            schema: { type: 'string', enum: ['excel', 'pdf'] },
            description: 'Formato de exportación'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, default: 20 },
            description: 'Cantidad de productos'
          },
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de inicio del periodo'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de fin del periodo'
          }
        ],
        responses: {
          200: {
            description: 'Archivo generado exitosamente',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } },
              'application/pdf': { schema: { type: 'string', format: 'binary' } }
            }
          },
          400: { description: 'Formato inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin autorización', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error al generar archivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/clientes/frecuentes': {
      get: {
        tags: ['Reportes'],
        summary: 'Obtener clientes más frecuentes (JSON)',
        description: 'Retorna los clientes con mayor cantidad de compras. Incluye total de compras, monto gastado y ticket promedio.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description: 'Cantidad de clientes a retornar'
          },
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de inicio del periodo'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de fin del periodo'
          }
        ],
        responses: {
          200: {
            description: 'Reporte generado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  data: [
                    {
                      id_cliente: 12,
                      total_compras: 15,
                      total_gastado: 25000.00,
                      cliente: {
                        nombre: 'María',
                        apellido: 'González',
                        telefono: '+504 9999-8888',
                        correo: 'maria@example.com'
                      }
                    }
                  ],
                  total: 1
                }
              }
            }
          },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/reportes/clientes/frecuentes/export': {
      get: {
        tags: ['Reportes'],
        summary: 'Exportar clientes más frecuentes',
        description: 'Genera archivo con estadísticas de clientes frecuentes. Incluye total de compras, monto gastado y ticket promedio calculado. Requiere rol de Administrador.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'formato',
            required: true,
            schema: { type: 'string', enum: ['excel', 'pdf'] },
            description: 'Formato de exportación'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, default: 20 },
            description: 'Cantidad de clientes'
          },
          {
            in: 'query',
            name: 'desde',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de inicio del periodo'
          },
          {
            in: 'query',
            name: 'hasta',
            schema: { type: 'string', format: 'date' },
            description: 'Fecha de fin del periodo'
          }
        ],
        responses: {
          200: {
            description: 'Archivo generado exitosamente',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } },
              'application/pdf': { schema: { type: 'string', format: 'binary' } }
            },
            headers: {
              'Content-Disposition': {
                schema: { type: 'string' },
                description: 'Nombre del archivo con timestamp'
              }
            }
          },
          400: { description: 'Formato inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Sin autenticación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Sin autorización', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Error al generar archivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
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
