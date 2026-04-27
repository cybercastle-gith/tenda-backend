import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "../../../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: false, //
  logging: false,
  entities: ["src/modules/**/schema/*.ts"],
  migrations: ["src/shared/database/migrations/*.ts"],
});
