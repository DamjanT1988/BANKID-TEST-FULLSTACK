import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';

@Entity()
export class BankIdSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderRef: string;

  @Column()
  personalNumber: string;

  @Column()
  qrCode: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  hintCode: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
