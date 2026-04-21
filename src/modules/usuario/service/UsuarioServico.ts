import { IUsuarioRepositorio } from "../repository/IUsuarioRepositorio";
import bcrypt from "bcrypt";
import { UsuarioBaseDTO } from "../dtos/UsuarioBase.DTO";
import { UsuarioLoginDTO } from "../dtos/UsuarioLogin.DTO";
import { config } from "../../../../config";
import jwt from "jsonwebtoken";
import { RespostaCadastroDTO } from "../dtos/RespostaCadastro.DTO";

export class UsuarioService {
  constructor(private usuarioRepositorio: IUsuarioRepositorio) {}

  async cadastrar(dados: UsuarioBaseDTO): Promise<RespostaCadastroDTO> {
    if (!dados.email || !dados.senha) {
      throw new Error("Dados obrigatórios faltando.");
    }

    const usuarioExiste = await this.usuarioRepositorio.buscarPorEmail(
      dados.email,
    );
    if (usuarioExiste) {
      throw new Error("Usuário já existe");
    }

    const senhaHash = await bcrypt.hash(dados.senha, 12); // rounds aumentado para 12

    const usuario = await this.usuarioRepositorio.criarUsuario({
      email: dados.email,
      senha: senhaHash,
      papel: dados.papel,
      nome: dados.nome,
      cpf: dados.cpf,
      telefone: dados.telefone,
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      config.secret,
      { expiresIn: "1h" },
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
      },
    };
  }

  async login(dados: UsuarioLoginDTO): Promise<{ token: string; papel: string }> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(dados.email);
    if (!usuario || !(await bcrypt.compare(dados.senha, usuario.senha))) {
      throw new Error("Credenciais inválidas.");
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, papel: usuario.papel },
      config.secret,
      { expiresIn: "3h" },
    );
    return { token, papel: usuario.papel };
  }
}
