import { IsNumberString, IsIn, IsOptional, IsString, IsBoolean  } from 'class-validator';
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';
import { from } from 'rxjs';
 
export class OrderByParams {
    @IsOptional()
    @IsString()
    @IsIn(['asc', 'ASC', 'desc', 'DESC'])
    @ApiProperty({
        description: 'Message sorted',
        type: String,
        enum: ['asc', 'desc'],
        default: 'desc',
        required: false
      })
    orderby: string;
}

export class IdParams {
    @IsNumberString()
    @ApiProperty({
        description: 'Message id',
        type: Number,
        example: 1
      })
    id: number;
}

export class SendParams {
    @IsOptional()
    @IsBoolean()
    @Transform(it => {
      switch (it && it.value.toLowerCase()) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return it;
      }
    })
    @ApiProperty({
        description: 'list of messages sent',
        type: Boolean,
        example: 1,
        required: false,
        default: false
      })
    send: boolean;
}

