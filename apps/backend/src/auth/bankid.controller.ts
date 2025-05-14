import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BankIdService } from './bankid.service';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const InitiateDto = z.object({ personNumber: z.string() });

@Controller('api/auth')
export class BankIdController {
  constructor(private readonly svc: BankIdService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { personNumber } = InitiateDto.parse(body);
    const orderRef = await this.svc.initiate(personNumber);
    return { orderRef };
  }

  @Get('status/:orderRef')
  async status(@Param('orderRef') orderRef: string) {
    return await this.svc.status(orderRef);
  }

  @Post('cancel/:orderRef')
  async cancel(@Param('orderRef') orderRef: string) {
    await this.svc.cancel(orderRef);
    return { cancelled: true };
  }
}
