const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'User management API with authentication',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  apis: ['./routes/*.js'],
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
  },
};

module.exports = {
  swaggerUi,
  swaggerSpec,
  swaggerUiOptions
};
