// src/modules/contrato/service/ContratoService.ts
import { IContratoRepositorio } from "../repository/IContratoRepositorio";
import { CriarContratoDTO } from "../dtos/CriarContrato.DTO";
import { StatusContrato } from "../schema/Contrato.schema";

export class ContratoService {
  constructor(private contratoRepositorio: IContratoRepositorio) {}

  private readonly PLANOS: Record<number, { valor_kwh: number }> = {
    12: { valor_kwh: 0.4 },
    24: { valor_kwh: 0.37 },
    36: { valor_kwh: 0.34 },
  };

  async criar(dados: CriarContratoDTO, usuario_id: string) {
    const plano = this.PLANOS[dados.duracao_contrato];

    if (!plano) {
      throw new Error(
        "Duração do contrato invalida. Utilize 12, 24 ou 36 meses",
      );
    }

    if (!dados.qtd_energia || dados.qtd_energia <= 0) {
      throw new Error("A quantidade de energia deve ser maior que zero.");
    }

    const valor_kwh = plano.valor_kwh;

    const pagamento_mensal = dados.qtd_energia * valor_kwh;
    const custo_total = pagamento_mensal * dados.duracao_contrato;

    const contrato = await this.contratoRepositorio.criar({
      duracao_contrato: dados.duracao_contrato,
      qtd_energia: dados.qtd_energia,
      valor_kwh: valor_kwh,
      pagamento_mensal,
      custo_total,
      status: StatusContrato.PENDENTE,
      usuario_id,
    });

    return contrato;
  }

  async assinar(contratoId: string, usuario_id: string, ip: string) {
    const contrato = await this.contratoRepositorio.buscarPorId(contratoId);

    if (!contrato || contrato.usuario_id !== usuario_id) {
      throw new Error("Contrato não encontrado ou não autorizado.");
    }

    if (contrato.assinado) {
      throw new Error("Contrato já assinado.");
    }

    contrato.assinado = true;
    contrato.status = StatusContrato.ASSINADO;
    contrato.data_assinatura = new Date();
    contrato.ip_assinatura = ip;

    return await this.contratoRepositorio.salvar(contrato);
  }
}
