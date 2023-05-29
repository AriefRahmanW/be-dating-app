import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatingModule } from './dating/dating.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    DatingModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
          secret: configService.getOrThrow<string>("JWT_SECRET"),
          signOptions: {
              expiresIn: '10h',
          }
      }),
      inject: [ConfigService]
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
