import { Contrato } from "../schema/Contrato.schema";

export interface IContratoRepositorio {
  criar(dados: Partial<Contrato>): Promise<Contrato>;
  buscarPorId(id: string): Promise<Contrato | null>;
  listarPorUsuario(usuario_id: string): Promise<Contrato[]>;
  salvar(contrato: Contrato): Promise<Contrato>;
}