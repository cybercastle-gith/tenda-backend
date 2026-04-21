import { Repository } from "typeorm";
import { IEnderecoRepository } from "./IEnderecoRepositorio";
import { Endereco } from "../schema/Endereco.schema";
import { EnderecoDTO } from "../dto/Endereco.DTO";

export class EnderecoRepositorio implements IEnderecoRepository {
  constructor(private repositorio: Repository<Endereco>) {}

  async cadastrar(dados: EnderecoDTO): Promise<Endereco> {
    const endereco = this.repositorio.create();

    Object.assign(endereco, {
      ...dados,
      complemento: dados.complemento ?? null,
    });

    return await this.repositorio.save(endereco);
  }

  async buscarPorCepENumero(
    cep: string,
    numero: string,
    usuario_id: string,
  ): Promise<Endereco | null> {
    return await this.repositorio.findOne({
      where: {
        cep: cep,
        numero: numero,
        usuario: { id: usuario_id },
      },
    });
  }
}
