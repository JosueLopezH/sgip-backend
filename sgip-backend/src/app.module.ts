import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import appConfig from './core/config/app.config';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}