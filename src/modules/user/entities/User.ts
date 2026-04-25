import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  password_hash!: string;

  @Column({ type: 'varchar', default: 'CLIENT' })
  role!: string; // 'CLIENT' or 'ADMIN'

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 14 })
  cpf!: string;

  @Column({ nullable: true })
  phone!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date; // soft delete (RN05)
}