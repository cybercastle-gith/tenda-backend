import { EnderecoDTO } from "../dto/Endereco.DTO";
import { Endereco } from "../schema/Endereco.schema";

export interface IEnderecoRepository {
  cadastrar(dados: EnderecoDTO): Promise<Endereco>;
  buscarPorCepENumero(
    cep: string,
    numero: string,
    usuario_id: string,
  ): Promise<Endereco | null>;
}
