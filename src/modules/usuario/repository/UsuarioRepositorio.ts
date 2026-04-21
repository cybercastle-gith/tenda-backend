import { Repository } from "typeorm";
import { Usuario } from "../schema/Usuario.schema";
import { IUsuarioRepositorio } from "./IUsuarioRepositorio";
import { UsuarioBaseDTO } from "../dtos/UsuarioBase.DTO";

export class UsuarioRepository implements IUsuarioRepositorio {
  constructor(private repositorio: Repository<Usuario>) {}

  async criarUsuario(dados: UsuarioBaseDTO): Promise<Usuario> {
    const usuario = this.repositorio.create(dados);
    await this.repositorio.save(usuario);

    return usuario;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const user = await this.repositorio.findOne({
      where: { email },
    });

    return user;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return await this.repositorio.findOne({
      where: { id },
    });
  }
}
