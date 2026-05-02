import express, { Application } from "express";
import { AppDataSource } from "./src/shared/database/data-source";
import { config } from "./config";
import cors from "cors";
import helmet from "helmet";
import routesMain from "./src/routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/shared/docs/swagger";
import { errorHandler } from "./src/shared/middlewares/errorHandler";
import { RefreshTokenCleanupService } from "./src/modules/auth/service/RefreshTokenCleanupService";

export class App {
  private _app: Application;

  constructor() {
    this._app = express();
    this.config();
    this.routes();
  }

  private config() {
    this._app.use(helmet());

    this._app.use(cors());

    this._app.use(express.json());
    this._app.set("trust proxy", true);

    this._app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private routes() {
    this._app.use(routesMain);
    this._app.use(errorHandler);
  }

  private async initDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log("DataBase connected");
    } catch (error) {
      console.error("DataBase error:", error);
      process.exit(1); // Terminates the application if unable to connect
    }
  }

  public async listen(): Promise<void> {
    await this.initDatabase(); // Waits for database connection
    RefreshTokenCleanupService.start(config.refreshTokenCleanupIntervalMinutes);

    this._app.listen(config.port, "0.0.0.0", () =>
      console.log(`🚀 Server running at http://0.0.0.0:${config.port}`),
    );

    console.log(`📚 Documentation available at: http://localhost:${config.port}/api-docs`);
  }

  public get app() {
    return this._app;
  }
}
