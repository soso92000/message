import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @IsEmail()
    @ApiProperty({
        description: 'User email',
        type: String,
      })
    email:string;
    @IsNotEmpty()
    @ApiProperty({
        description: 'User password',
        type: String,
      })
    password: string;

}
