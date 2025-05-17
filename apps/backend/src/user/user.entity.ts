import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BankIdSession } from '../auth/entities/bankid-session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  personalNumber: string;

  @OneToMany(() => BankIdSession, (session) => session.user)
  sessions: BankIdSession[];
}
