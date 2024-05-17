import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "disruptivestudio_test",
      version: "1.0.0",
      description: "Documentación de mi API con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3004",
        description: "Api local prueba disruptivestudio_test",
      },
    ],
  },
  apis: [path.resolve(__dirname, "../modules/**/*.ts")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
