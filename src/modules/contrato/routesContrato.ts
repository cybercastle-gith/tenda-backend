import { Router } from "express";
import { autenticarJWT } from "../../shared/middlewares/autenticarJWT";
import { ContratoRepositorio } from "./repository/ContratoRepositorio";
import { AppDataSource } from "../../shared/database/data-source";
import { Contrato } from "./schema/Contrato.schema";
import { ContratoService } from "./service/ContratoService";
import { ContratoControlador } from "./controller/ContratoControlador";

const contratoRotas = Router();

const contratoRepositorio = new ContratoRepositorio(
  AppDataSource.getRepository(Contrato),
);

const contratoService = new ContratoService(contratoRepositorio);
const contratoControlador = new ContratoControlador(contratoService);

contratoRotas.post(
  "/gerar/contrato",
  autenticarJWT,
  contratoControlador.criar.bind(contratoControlador),
);

contratoRotas.post(
  "/contrato/:id/assinar",
  autenticarJWT,
  contratoControlador.assinar.bind(contratoControlador),
);

export default contratoRotas;
