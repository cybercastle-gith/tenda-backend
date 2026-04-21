import { Router } from "express";
import usuarioRotas from "./modules/usuario/rotasUsuario";
import contratoRotas from "./modules/contrato/routesContrato";
import enderecoRotas from "./modules/endereco/enderecoRotas";
import rotasFatura from "./modules/fatura/routesFatura";

const routesMain = Router();

routesMain.use(usuarioRotas);
routesMain.use(contratoRotas);
routesMain.use(enderecoRotas);
routesMain.use(rotasFatura);

export default routesMain;
