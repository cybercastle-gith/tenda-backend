import { Router } from "express";
import { autenticarJWT } from "../../shared/middlewares/autenticarJWT";
import { enderecoControlador } from "../../shared/container";

const enderecoRotas = Router();

enderecoRotas.post(
  "/endereco/cadastrar",
  autenticarJWT,
  enderecoControlador.cadastrar.bind(enderecoControlador),
);

export default enderecoRotas;
