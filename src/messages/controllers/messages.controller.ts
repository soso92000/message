import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../entities/dto/create-message.dto';
import { UpdateMessageDto } from '../entities/dto/update-message.dto';
import { OrderByParams, IdParams, SendParams } from 'src/utils/validation.params';
import { ReplyMessageDto } from '../entities/dto/reply-message.dto';
import { ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('messages')
@UseInterceptors(ClassSerializerInterceptor)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Create message' })
  @ApiBody({type: [CreateMessageDto]})
  @Post()
  create(@Req() req, @Body() createMessageDto: CreateMessageDto) {
    const { user } = req;
    return this.messagesService.create(user, createMessageDto);
  }

  @ApiOperation({ summary: 'reply message' })
  @Post(':id/reply')
  reply(@Req() req, @Param() { id }: IdParams, @Body() replyMessageDto: ReplyMessageDto) {
    const { user } = req;
    return this.messagesService.reply(user, id, replyMessageDto);
  }

  @ApiOperation({ summary: 'find all message' })
  @Get()
  findAll(@Req() req, @Query() q,  @Query() { send }: SendParams, @Query() { orderby }: OrderByParams) {
    const { user } = req;
    console.log('send', send);return this.messagesService.findAll(user, { send, orderby });
  }

  @Get('bin')
  findDelete(@Req() req, @Query('order_by') { orderby }: OrderByParams) {
    const { user } = req;
    return this.messagesService.findAll(user, { deleted:true, orderby });
  }

  @Get(':id')
  findOne(@Req() req, @Param() { id }: IdParams) {
    const { user } = req;
    return this.messagesService.findOne(user, +id);
  }

  @Patch(':id')
  update(@Req() req, @Param() { id }: IdParams, @Body() updateMessageDto: UpdateMessageDto) {
    const { user } = req;
    return this.messagesService.update(user, +id, updateMessageDto);
  }

  @Patch(':id/read')
  read(@Req() req,@Param() { id }: IdParams) {
    const { user } = req;
    return this.messagesService.read(user, +id);
  }

  @Delete(':id')
  remove(@Req() req, @Param() { id }: IdParams) {
    const { user } = req;
    return this.messagesService.remove(user, +id);
  }


}
