import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthentificationService } from './services/authentification.service';
import { LocalStrategy } from './passport/local.strategy';
import { AuthentificationController } from './controllers/authentification.controller';
import { JwtStrategy } from './passport/jwt.strategy';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
    imports: [InMemoryDBModule.forFeature('jwt', {}), JwtModule.register({
        secret: 'secret', // mettre en variable local
        signOptions: { expiresIn: '360s' },
      }),UsersModule, PassportModule],
    providers: [AuthentificationService, LocalStrategy, JwtStrategy],
    controllers: [AuthentificationController],
    exports: [AuthentificationService, JwtModule],
  })
export class AuthentificationModule {}
