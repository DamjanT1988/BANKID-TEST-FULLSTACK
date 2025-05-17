import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BankIdModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { i18nConfig } from './i18n/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    i18nConfig,
    TypeOrmModule.forRoot({ 
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    BankIdModule
  ],
})
export class AppModule {}
