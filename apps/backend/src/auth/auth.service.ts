import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankIdSession } from './entities/bankid-session.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(BankIdSession)
    private sessionsRepo: Repository<BankIdSession>,
  ) {}

  async initiate(personalNumber: string) {
    const orderRef = uuidv4();
    const session = this.sessionsRepo.create({
      orderRef,
      personalNumber,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${orderRef}`,
      status: 'pending',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await this.sessionsRepo.save(session);
    return { orderRef, qrCodeUrl: session.qrCode };
  }

  async status(orderRef: string) {
    const session = await this.sessionsRepo.findOne({ where: { orderRef } });
    if (!session) throw new NotFoundException();
    let hintCode = null;
    // For test: after 10s switch to userSign, after 20s complete
    const age = Date.now() - session.expiresAt.getTime() + 5 * 60 * 1000;
    if (age > 20000) {
      session.status = 'complete';
    } else if (age > 10000) {
      session.status = 'userSign';
      hintCode = 'SKICKA';
    }
    await this.sessionsRepo.save(session);
    return { status: session.status, hintCode };
  }

  async cancel(orderRef: string) {
    const session = await this.sessionsRepo.findOne({ where: { orderRef } });
    if (!session) throw new NotFoundException();
    await this.sessionsRepo.remove(session);
    return { cancelled: true };
  }
}
