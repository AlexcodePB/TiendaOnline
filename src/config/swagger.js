const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skate Shop API',
      version: '1.0.0',
      description: 'API REST para tienda de skateboard con autenticación JWT y control de acceso basado en roles',
      contact: {
        name: 'Skate Shop Team',
        email: 'admin@skateshop.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT en el formato: Bearer {token}'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '64f5a123b12345678901234'
            },
            name: {
              type: 'string',
              example: 'Juan Pérez',
              minLength: 2,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@email.com'
            },
            phone: {
              type: 'string',
              example: '+34123456789'
            },
            role: {
              type: 'string',
              enum: ['client', 'admin'],
              example: 'client'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Juan Pérez',
              minLength: 2,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@email.com'
            },
            password: {
              type: 'string',
              example: '12345678',
              minLength: 8
            },
            phone: {
              type: 'string',
              example: '+34123456789'
            },
            role: {
              type: 'string',
              enum: ['client', 'admin'],
              example: 'client'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '64f5a123b12345678901234'
            },
            name: {
              type: 'string',
              example: 'Element Section 8.25\"',
              minLength: 2,
              maxLength: 100
            },
            description: {
              type: 'string',
              example: 'Tabla de skateboard Element con gráfico Section, 8.25 pulgadas de ancho',
              minLength: 10,
              maxLength: 500
            },
            price: {
              type: 'number',
              example: 79.99,
              minimum: 0
            },
            image: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  example: 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg'
                },
                public_id: {
                  type: 'string',
                  example: 'table-element_x8vqyp'
                }
              },
              required: ['url', 'public_id']
            },
            stock: {
              type: 'integer',
              example: 15,
              minimum: 0
            },
            category: {
              type: 'string',
              enum: ['tables', 'wheels', 'trucks', 'bearings', 'grip-tape', 'hardware', 'tools', 'clothing', 'accessories'],
              example: 'tables'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'description', 'price', 'image', 'stock', 'category'],
          properties: {
            name: {
              type: 'string',
              example: 'Element Section 8.25\"',
              minLength: 2,
              maxLength: 100
            },
            description: {
              type: 'string',
              example: 'Tabla de skateboard Element con gráfico Section, 8.25 pulgadas de ancho',
              minLength: 10,
              maxLength: 500
            },
            price: {
              type: 'number',
              example: 79.99,
              minimum: 0
            },
            image: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  example: 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg'
                },
                public_id: {
                  type: 'string',
                  example: 'table-element_x8vqyp'
                }
              },
              required: ['url', 'public_id']
            },
            stock: {
              type: 'integer',
              example: 15,
              minimum: 0
            },
            category: {
              type: 'string',
              enum: ['tables', 'wheels', 'trucks', 'bearings', 'grip-tape', 'hardware', 'tools', 'clothing', 'accessories'],
              example: 'tables'
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'test@test.com'
            },
            password: {
              type: 'string',
              example: '12345678'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login exitoso'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              example: 1
            },
            totalPages: {
              type: 'integer',
              example: 3
            },
            total: {
              type: 'integer',
              example: 25
            },
            hasNextPage: {
              type: 'boolean',
              example: true
            },
            hasPrevPage: {
              type: 'boolean',
              example: false
            },
            itemsPerPage: {
              type: 'integer',
              example: 10
            }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '64f5a123b12345678901234'
            },
            userId: {
              type: 'string',
              example: '64f5a123b12345678901235'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              }
            },
            totalItems: {
              type: 'integer',
              example: 5
            },
            totalAmount: {
              type: 'number',
              example: 249.95
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T12:45:00.000Z'
            }
          }
        },
        CartItem: {
          type: 'object',
          properties: {
            productId: {
              $ref: '#/components/schemas/Product'
            },
            quantity: {
              type: 'integer',
              example: 2,
              minimum: 1
            },
            price: {
              type: 'number',
              example: 79.99,
              minimum: 0
            },
            addedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        CartStats: {
          type: 'object',
          properties: {
            totalItems: {
              type: 'integer',
              example: 5
            },
            totalAmount: {
              type: 'number',
              example: 249.95
            },
            uniqueProducts: {
              type: 'integer',
              example: 3
            },
            averageItemPrice: {
              type: 'number',
              example: 49.99
            }
          }
        },
        AddToCartInput: {
          type: 'object',
          required: ['productId'],
          properties: {
            productId: {
              type: 'string',
              example: '64f5a123b12345678901234'
            },
            quantity: {
              type: 'integer',
              example: 1,
              minimum: 1,
              default: 1
            }
          }
        },
        UpdateCartInput: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: {
              type: 'string',
              example: '64f5a123b12345678901234'
            },
            quantity: {
              type: 'integer',
              example: 3,
              minimum: 0,
              description: 'Si es 0, el producto se elimina del carrito'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Mensaje de error'
            },
            details: {
              oneOf: [
                {
                  type: 'string',
                  example: 'Detalles del error'
                },
                {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  example: ['Error de validación 1', 'Error de validación 2']
                }
              ]
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y autorización'
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios (requiere autenticación)'
      },
      {
        name: 'Products',
        description: 'Gestión de productos de skateboard'
      },
      {
        name: 'Cart',
        description: 'Gestión del carrito de compras'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;