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

@Entity("enderecos")
export class Endereco {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 8 })
  cep!: string;

  @Column({ length: 50 })
  rua!: string;

  @Column({ length: 10 })
  numero!: string;

  @Column({ length: 100 })
  bairro!: string;

  @Column({ length: 100 })
  cidade!: string;

  @Column({ length: 100, nullable: true })
  complemento?: string;

  @Column()
  usuario_id!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.enderecos, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;

  @CreateDateColumn()
  criado_em!: Date;

  @UpdateDateColumn()
  atualizado_em!: Date;
}
