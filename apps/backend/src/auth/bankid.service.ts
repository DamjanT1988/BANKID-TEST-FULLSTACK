import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { UserService } from '../user/user.service';

@Injectable()
export class BankIdService {
  constructor(
    @Inject('REDIS') private redis: Redis,
    private userService: UserService,
  ) {}

  async initiate(personNumber: string) {
    const orderRef = uuid();
    // TODO: call BankID test API with cert/key from env
    await this.redis.set(orderRef, personNumber, 'EX', 300);
    return orderRef;
  }

  async status(orderRef: string) {
    const personNumber = await this.redis.get(orderRef);
    if (!personNumber) return { status: 'failed' };
    // TODO: call BankID collect API
    // stub: return pending
    return { status: 'pending' };
  }

  async cancel(orderRef: string) {
    await this.redis.del(orderRef);
    return;
  }
}
