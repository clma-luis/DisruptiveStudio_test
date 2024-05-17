import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { BASE_URL_PORT } from "./shared/config/config";

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
        url: `http://localhost:8080`,
        description: "Api local prueba disruptivestudio_test",
      },
    ],
  },
  apis: [
    path.resolve(__dirname, "./modules/auth/*.ts"),
    path.resolve(__dirname, "./modules/role/*.ts"),
    path.resolve(__dirname, "./modules/seeds/*.ts"),
    path.resolve(__dirname, "./modules/user/*.ts"),
    path.resolve(__dirname, "./modules/category/*.ts"),
    path.resolve(__dirname, "./modules/topic/*.ts"),
    path.resolve(__dirname, "./modules/*.ts"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
