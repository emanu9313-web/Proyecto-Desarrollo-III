import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ConfigModule, ConfigService } from '@nestjs/config';
=======
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
import { JwtModule } from '@nestjs/jwt';
import { AuthProxyController } from './auth-proxy.controller';
import { GatewayAuthGuard } from './gateway-auth.guard';
import { HealthController } from './health.controller';

@Module({
<<<<<<< HEAD
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ secret: config.getOrThrow<string>('JWT_SECRET') }),
    }),
  ],
=======
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
  controllers: [AuthProxyController, HealthController],
  providers: [GatewayAuthGuard],
})
export class AppModule {}
