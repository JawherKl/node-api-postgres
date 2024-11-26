const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'User API',
        version: '1.0.0',
        description: 'This API allows you to manage users, including authentication and CRUD operations.',
      },
      host: 'localhost:3000',
      basePath: '/',
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'x-auth-token',
          scheme: 'bearer',
          in: 'header',
        },
      },
      security: [
        {
          bearerAuth: [], // Apply bearer auth globally to all routes
        },
      ],
    },
    apis: ['./routes/userRoutes.js', './controllers/userController.js'],
  };
  
// Initialize Swagger JSDoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
