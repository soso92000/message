import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { MessageRepository } from './repository/message.repository';
import { ServiceFactory } from './services/typeMessage/type-message.factory';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRepository]),TypeOrmModule.forFeature([User]), UsersModule, ServiceFactory],
  controllers: [MessagesController],
  providers: [MessagesService, ServiceFactory]
})
export class MessagesModule {}