const swaggerJsdoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API documentation for Book Store System",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;