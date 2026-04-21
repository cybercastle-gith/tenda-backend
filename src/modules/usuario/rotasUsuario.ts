import { Router } from "express";
import { UsuarioControlador } from "./controller/UsuarioControlador";
import { usuarioControlador } from "../../shared/container";

const usuarioRotas = Router();

usuarioRotas.get("/", usuarioControlador.hello.bind(usuarioControlador));

//usuarios gerais
usuarioRotas.post(
  "/usuarios/cadastrar",
  usuarioControlador.cadastrarControlador.bind(usuarioControlador),
);

usuarioRotas.post(
  "/usuarios/login",
  usuarioControlador.loginControlador.bind(usuarioControlador),
);

export default usuarioRotas;
