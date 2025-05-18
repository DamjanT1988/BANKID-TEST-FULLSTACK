// apps/backend/src/user/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { BankIdSession } from '../auth/entities/bankid-session.entity'

/**
 * Represents a user in the system.
 * Each user can initiate multiple BankID authentication sessions.
 */
@Entity()
export class User {
  /**
   * Primary key as a UUID, automatically generated.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string

  /**
   * Unique personal number (YYYYMMDDNNNN) used to identify the user.
   */
  @Column({ unique: true })
  personalNumber: string

  /**
   * One-to-many relationship to BankIdSession.
   * A user may start multiple sessions over time.
   */
  @OneToMany(() => BankIdSession, (session) => session.user)
  sessions: BankIdSession[]
}
