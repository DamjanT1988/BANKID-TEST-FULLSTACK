import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { z } from 'zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initiate')
  async initiate(@Body() body: any) {
    const schema = z.object({ personalNumber: z.string().length(12) });
    const { personalNumber } = schema.parse(body);
    return this.authService.initiate(personalNumber);
  }

  @Get('status')
  async status(@Query('orderRef') orderRef: string) {
    return this.authService.status(orderRef);
  }

  @Post('cancel')
  async cancel(@Body() body: any) {
    const schema = z.object({ orderRef: z.string() });
    const { orderRef } = schema.parse(body);
    return this.authService.cancel(orderRef);
  }
}
