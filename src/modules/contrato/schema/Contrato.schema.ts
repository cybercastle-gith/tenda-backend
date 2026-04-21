import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Usuario } from "../../usuario/schema/Usuario.schema";

export enum StatusContrato {
  PENDENTE = "PENDENTE",
  ASSINADO = "ASSINADO",
  CANCELADO = "CANCELADO",
  FINALIZADO = "FINALIZADO",
}

@Entity("contratos")
export class Contrato {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Duração do contrato em meses (ex: 12, 24, 36)
  @Column({ type: "int" })
  duracao_contrato!: number;

  // Quantidade de energia contratada (ex: kWh)
  @Column({ type: "decimal", precision: 10, scale: 2 })
  qtd_energia!: number;

  // Valor do pagamento mensal
  @Column({ type: "decimal", precision: 10, scale: 2 })
  pagamento_mensal!: number;

  @Column({
    type: "enum",
    enum: StatusContrato,
    enumName: "status_contrato_enum",
    default: StatusContrato.PENDENTE,
  })
  status!: StatusContrato;
  
  @Column({ type: "decimal", precision: 10, scale: 2 })
  valor_kwh!: number;

  @Column({ default: false })
  assinado!: boolean;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  custo_total!: number;

  @Column({ type: "timestamp", nullable: true })
  data_assinatura?: Date;

  @Column({ nullable: true })
  ip_assinatura?: string;

  // Relacionamento com o usuário
  @ManyToOne(() => Usuario, { onDelete: "CASCADE" })
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;

  @Column("uuid")
  usuario_id!: string;

  // Datas de controle
  @CreateDateColumn()
  criado_em!: Date;

  @UpdateDateColumn()
  atualizado_em!: Date;
}
