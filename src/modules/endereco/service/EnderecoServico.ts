import { IUsuarioRepositorio } from "../../usuario/repository/IUsuarioRepositorio";
import { EnderecoDTO } from "../dto/Endereco.DTO";
import { IEnderecoRepository } from "../repository/IEnderecoRepositorio";

export class EnderecoServico {
  constructor(
    private repositorio: IEnderecoRepository,
    private usuarioRepositorio: IUsuarioRepositorio,
  ) {}

  async cadastrar(dados: EnderecoDTO) {
    const usuarioExiste = await this.usuarioRepositorio.buscarPorId(
      dados.usuario_id,
    );

    if (!usuarioExiste) {
      throw new Error("Usuário não encontrado!");
    }

    //TODO: validar complemento tambem
    const enderecoExiste = await this.repositorio.buscarPorCepENumero(
      dados.cep,
      dados.numero,
      dados.usuario_id,
    );

    if (enderecoExiste) {
      throw new Error("Você já cadastrou este endereço (mesmo CEP e número).");
    }

    return await this.repositorio.cadastrar(dados);
  }
}
