import express, { Application } from "express";
import { AppDataSource } from "./src/shared/database/data-source";
import { config } from "./config";
import  cors  from "cors";
import routesMain from "./src/routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/shared/docs/swagger";

export class App {
  private _app: Application;

  constructor() {
    this._app = express();
    this.config();
    this.routes();
  }

  private config() {
    this._app.use(express.json());
    this._app.use(cors()); // Aceita requisições de qualquer origem
    this._app.set("trust proxy", true); 
    this._app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private routes() {
    this._app.use(routesMain);
  }

  private async initDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log("DataBase connected");
    } catch (error) {
      console.error("DataBase error:", error);
      process.exit(1); // Encerra a aplicação se não conseguir conectar
    }
  }

  public async listen(): Promise<void> {
    await this.initDatabase(); // Aguarda a conexão com o banco

    this._app.listen(config.port, "0.0.0.0", () =>
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${config.port}`),
);

    console.log(
      `📚 Documentação disponível em: http://localhost:${config.port}/api-docs",
    `);
  }

  public get app() {
    return this._app;
  }
}
