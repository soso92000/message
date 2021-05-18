import { IsEmail, IsNotEmpty, IsNumberString, IsMobilePhone, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'User name',
        type: String,
      })
    name: string;
    @IsEmail()
    @ApiProperty({
        description: 'User email',
        type: String,
      })
    email:string;
    @IsNotEmpty()
    @IsNumberString()
    @IsMobilePhone('fr-FR', {}, { message: 'phone must be a french phone number'}) // mettre dans une varaible de conf
    @ApiProperty({
        description: 'User phone number',
        type: String,
      })
    phone: string;
    @IsNotEmpty()
    @ApiProperty({
        description: 'User password',
        type: String,
      })
    password: string;

}
