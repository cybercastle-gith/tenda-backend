import { EnderecoControlador } from "../../modules/endereco/controller/EnderecoControlador";
import { EnderecoRepositorio } from "../../modules/endereco/repository/EnderecoRepositorio";
import { Endereco } from "../../modules/endereco/schema/Endereco.schema";
import { EnderecoServico } from "../../modules/endereco/service/EnderecoServico";
import { UsuarioControlador } from "../../modules/usuario/controller/UsuarioControlador";
import { UsuarioRepository } from "../../modules/usuario/repository/UsuarioRepositorio";
import { Usuario } from "../../modules/usuario/schema/Usuario.schema";
import { UsuarioService } from "../../modules/usuario/service/UsuarioServico";
import { AppDataSource } from "../database/data-source";

const enderecoRepo = new EnderecoRepositorio(
  AppDataSource.getRepository(Endereco),
);
const usuarioRepo = new UsuarioRepository(AppDataSource.getRepository(Usuario));

const enderecoService = new EnderecoServico(enderecoRepo, usuarioRepo);
const usuarioService = new UsuarioService(usuarioRepo);


export const usuarioControlador = new UsuarioControlador(usuarioService);
export const enderecoControlador = new EnderecoControlador(enderecoService);