import { Controller, Dependencies, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SkipAuth } from './decorator/skip-auth.decorator';
import { RolesGuard } from './guard/roles.guard';

@ApiTags('默认')
@SkipAuth()
@Controller()
export class AppController {
  private start: number;
  constructor(private readonly appService: AppService) {
    this.start = Date.now()
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthcheck')
  async healthcheck(): Promise<{status: string, uptime: string}> {
    const now = Date.now();
    return {
      status: 'API Online',
      uptime: Number((now - this.start) / 1000).toFixed(0)
    }
  }
  
}
