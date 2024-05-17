import cloudinary from "cloudinary";
import cors from "cors";
import express from "express";
import { createServer, Server as HttpServer } from "http";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";

import { dbConnection } from "./database/config";

import { BASE_URL_PORT, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./shared/config/config";

import authRoutes from "./modules/auth/authRoutes";
import roleRoutes from "./modules/role/roleRoutes";
import seedRoutes from "./modules/seeds/seedRoutes";
import userRoutes from "./modules/user/userRoutes";
import categoryRoutes from "./modules/category/categoryRoutes";
import topicRoutes from "./modules/topic/topicRoutes";
import swaggerSpec from "./swaggerOptions";

export class Server {
  private app: express.Application;
  private port: string;
  private httpServer: HttpServer;

  constructor() {
    this.app = express();
    this.port = BASE_URL_PORT as string;
    this.httpServer = createServer(this.app);
    this.connectDataBase();
    this.middlewares();
    this.configureCloudinary();
    this.routes();
  }

  async connectDataBase() {
    await dbConnection();
  }

  public middlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  private configureCloudinary() {
    cloudinary.v2.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  private routes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/user", userRoutes);
    this.app.use("/api/role", roleRoutes);
    this.app.use("/api/seed", seedRoutes);

    this.app.use("/api/category", categoryRoutes);
    this.app.use("/api/topic", topicRoutes);
  }

  private configureSwagger() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}
