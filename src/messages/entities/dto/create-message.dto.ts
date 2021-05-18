import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Recipient id',
        default: 1,
        type: Number,
      })
    to: number;

    @IsNotEmpty()
    @IsIn(['email', 'sms'])
    @ApiProperty({
        description: 'Message type',
        type: String,
        enum: ['sms', 'mail']
      })
    type: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Message text',
        type: String,
        example: 'Je suis un message'
      })
    message: string;
}
