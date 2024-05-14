import cors from "cors";
import express from "express";
import { createServer, Server as HttpServer } from "http";

import { dbConnection } from "./database/config";

import { BASE_URL_PORT } from "./shared/config/config";

import authRoutes from "./modules/auth/authRoutes";
import roleRoutes from "./modules/role/roleRoutes";
import seedRoutes from "./modules/seeds/seedRoutes";
import userRoutes from "./modules/user/userRoutes";

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
    this.routes();
  }

  async connectDataBase() {
    await dbConnection();
  }

  public middlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.static("public"));
    this.app.use(express.json());
  }

  private routes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/user", userRoutes);
    this.app.use("/api/role", roleRoutes);
    this.app.use("/api/seed", seedRoutes);
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}
