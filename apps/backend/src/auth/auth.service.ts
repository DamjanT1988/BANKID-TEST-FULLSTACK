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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const autostartUrl = `bankid:///?autostarttoken=${orderRef}&redirect=${encodeURIComponent(
      frontendUrl + '/callback'
    )}`;
    const qrData = encodeURIComponent(autostartUrl);
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
    const session = this.sessionsRepo.create({
      orderRef,
      personalNumber,
      qrCode,
      status: 'pending',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await this.sessionsRepo.save(session);
    return { orderRef, qrCodeUrl: qrCode };
  }

  async status(orderRef: string) {
    const session = await this.sessionsRepo.findOne({ where: { orderRef } });
    if (!session) throw new NotFoundException();
    let hintCode: string | null = null;
    const elapsed = Date.now() - (session.expiresAt.getTime() - 5 * 60 * 1000);
    if (elapsed > 20000) {
      session.status = 'complete';
    } else if (elapsed > 10000) {
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
