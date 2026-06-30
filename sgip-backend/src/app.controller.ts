import { Controller, Get, Request } from '@nestjs/common';
import { Public } from './core/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  getHello(): object {
    return { status: 'ok', app: 'SGIP Backend', version: '1.0.0' };
  }

  @Get('perfil')
  getPerfil(@Request() req: any): object {
    return { mensaje: 'Ruta protegida', usuario: req.user };
  }
}