import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1776356804581 implements MigrationInterface {
    name = 'Init1776356804581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "enderecos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cep" character varying(8) NOT NULL, "rua" character varying(50) NOT NULL, "numero" character varying(10) NOT NULL, "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "complemento" character varying(100), "usuario_id" uuid NOT NULL, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_208b05002dcdf7bfbad378dcac1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."status_contrato_enum" AS ENUM('PENDENTE', 'ASSINADO', 'CANCELADO', 'FINALIZADO')`);
        await queryRunner.query(`CREATE TABLE "contratos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "duracao_contrato" integer NOT NULL, "qtd_energia" numeric(10,2) NOT NULL, "pagamento_mensal" numeric(10,2) NOT NULL, "status" "public"."status_contrato_enum" NOT NULL DEFAULT 'PENDENTE', "valor_kwh" numeric(10,2) NOT NULL, "assinado" boolean NOT NULL DEFAULT false, "custo_total" numeric(10,2) NOT NULL, "data_assinatura" TIMESTAMP, "ip_assinatura" character varying, "usuario_id" uuid NOT NULL, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cfae35069d6f59da899c17ed397" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(50) NOT NULL, "email" character varying(150) NOT NULL, "telefone" character varying(25) NOT NULL, "senha" character varying(255) NOT NULL, "cpf" character varying(14) NOT NULL, "papel" character varying NOT NULL DEFAULT 'CLIENTE', "ativo" boolean NOT NULL DEFAULT true, "email_verificado" boolean NOT NULL DEFAULT false, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "enderecos" ADD CONSTRAINT "FK_702a2d47c2a196c1c8596dbf2b5" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contratos" ADD CONSTRAINT "FK_0b90461358ccc16ad91f287c793" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contratos" DROP CONSTRAINT "FK_0b90461358ccc16ad91f287c793"`);
        await queryRunner.query(`ALTER TABLE "enderecos" DROP CONSTRAINT "FK_702a2d47c2a196c1c8596dbf2b5"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "contratos"`);
        await queryRunner.query(`DROP TYPE "public"."status_contrato_enum"`);
        await queryRunner.query(`DROP TABLE "enderecos"`);
    }

}
