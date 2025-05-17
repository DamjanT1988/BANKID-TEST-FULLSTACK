import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankIdSession } from './entities/bankid-session.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankIdSession]), UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
