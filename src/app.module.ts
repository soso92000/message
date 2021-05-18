import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { AuthentificationService } from './authentification/services/authentification.service';
import { AuthentificationModule } from './authentification/authentification.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authentification/passport/jwtAuthentification.guard';

@Module({
  imports: [InMemoryDBModule.forRoot({}), TypeOrmModule.forRoot(), MessagesModule, UsersModule, AuthentificationModule],
  controllers: [AppController],
  providers: [AppService, AuthentificationService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
