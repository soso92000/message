import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMessageDto } from '../entities/dto/create-message.dto';
import { UpdateMessageDto } from '../entities/dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MessageRepository } from '../repository/message.repository';
import { ReplyMessageDto } from '../entities/dto/reply-message.dto';
import { ServiceFactory } from './typeMessage/type-message.factory';

@Injectable()
export class MessagesService {
  constructor(private messageRepository: MessageRepository, @InjectRepository(User) private userRepository: Repository<User>, readonly serviceFactory: ServiceFactory){}

  async create(currentUser: User, createMessageDto: CreateMessageDto): Promise<Message> {

    const userFrom = currentUser;
    const userTo = await this.userRepository.findOne(createMessageDto.to);

    if (!userTo) {
      throw new HttpException('The recipient is not in db', HttpStatus.BAD_REQUEST);
    }
    if(userFrom.id === userTo.id) {
      throw new HttpException('User cannot be the same person who send and receive the message', HttpStatus.BAD_REQUEST);
    }

    let message = this.messageRepository.create({ ...createMessageDto, to: userTo, from: userFrom });

    message = await this.messageRepository.save(message);

    this.sendMessage(message);

    return message;
  }

  async reply(user: User, messageId: number, replyMessageDto: ReplyMessageDto) {

    const message = await this.messageRepository.findOne(messageId);
    this.isAllowed(user, message, { to: true });

    if (message.reply) {
      throw new HttpException('Message are already been responded', HttpStatus.CONFLICT);
    }

    const replyMessage = this.messageRepository.reply(message, replyMessageDto.message);

    this.sendMessage(replyMessage);
    return replyMessage; 
  }


  async findAll(user: User, { deleted = false, orderby = 'DESC', send = false  } : { deleted?: boolean; send?: boolean; orderby?: string }): Promise<Message[]> {
    let res;
    console.log('findall', send, orderby )
    if (deleted) {
      console.log('IN 1')
      res = await this.messageRepository.findAllDeletedMessage(user, orderby);
    } else if(send) {
      console.log('IN 2')
      res = await this.messageRepository.findAllMessagesSend(user, orderby);
    } else {
      console.log('IN 3')
      res = this.messageRepository.findAllMessagesReceived(user, orderby);
    }
    return res;
  }

  async findOne(user: User, id: number): Promise<Message> {
    const message = await this.messageRepository.findOne(id, { where: { deleted: false }});
    this.isAllowed(user, message, { to: true })
    return message;
  }

  async update(user: User, id: number, updateMessageDto: UpdateMessageDto) : Promise<UpdateResult>{
    const message = await this.messageRepository.findOne(id);
    this.isAllowed(user, message, { from: true });
    message.message = updateMessageDto.message;
    const res = await this.userRepository.update(id, message);
    return res;
  }

  async read(user: User, id: number): Promise<string> {
    let message = await this.messageRepository.findOne(id);
    this.isAllowed(user, message, { to: true })
    if (!message.hasRead) {
      await this.messageRepository.update(id, { hasRead: true });
    }
    return 'message updated';
  }

  async remove(user: User, id: number): Promise<string> {
    const message = await this.messageRepository.findOne(id);
    this.isAllowed(user, message, { to: true })
    message.deleted = true;await this.messageRepository.update(id, { deleted: true });
    // await this.messageRepository.softDelete(id);

    return 'Delete with succes';
  }

  private sendMessage(message) {
    const typeMessage = this.serviceFactory.getService(message.type);
    return typeMessage.send(message)
  }

  private isAllowed(user: User, message: Message, { from = false, to = false }: { from?: boolean, to?: boolean}) {
    if (!message) {
      throw new HttpException('Message doesnt exist', HttpStatus.NOT_FOUND);
    }
    if (from && message.from.id !== user.id ) {
      throw new HttpException('It is not one of your message', HttpStatus.BAD_REQUEST);
    }
    if (to && message.to.id !== user.id ) {
      throw new HttpException('You are not the recipient of the message', HttpStatus.BAD_REQUEST);
    }
  }
}
