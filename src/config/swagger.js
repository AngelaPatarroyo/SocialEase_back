const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SocialEase API',
      version: '1.0.0',
      description: 'API documentation for SocialEase project'
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'], // Scan routes for Swagger annotations
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
