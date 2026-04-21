import { Usuario } from "../schema/Usuario.schema";

export interface IUsuarioRepositorio {
  criarUsuario(data: Partial<Usuario>): Promise<Usuario>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorId(id: string): Promise<Usuario | null>;
}
