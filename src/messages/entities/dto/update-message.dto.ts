import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto{
    @IsNotEmpty()
    @ApiProperty({
        description: 'Message text',
        type: String,
        example: 'Je suis un message'
      })
    message: string;
}
