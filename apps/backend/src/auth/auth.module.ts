import { Module } from '@nestjs/common';
import { BankIdService } from './bankid.service';
import { BankIdController } from './bankid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import Redis from 'ioredis';

@Module({
  imports: [UserModule],
  controllers: [BankIdController],
  providers: [
    BankIdService,
    {
      provide: 'REDIS',
      useFactory: () => new Redis(process.env.REDIS_URL),
    },
  ],
})
export class BankIdModule {}
