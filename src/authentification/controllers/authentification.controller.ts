import { Controller, Post, Body, HttpCode, UseGuards, Req, Get } from '@nestjs/common';
import { AuthentificationService } from '../services/authentification.service';
import { CreateUserDto } from 'src/users/entities/dto/create-user.dto';
import { LocalAuthenticationGuard } from '../passport/localAuthentification.guard';
import RequestWithUser from '../entity/interfaces/requestWithUser.interface';
import { Public } from '../decorators/public.decorator';
import { ApiBody, ApiExtraModels, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/entities/dto/login.dto';

@Controller('')
export class AuthentificationController {
    constructor(
        private readonly authenticationService: AuthentificationService
      ) {}

     
      @Public()
      @Post('register')
      async register(@Body() createUserDto: CreateUserDto) {
        await this.authenticationService.create(createUserDto);
        return 'You have been registered';
      }
     
      @ApiBody({type: [LoginUserDto]})
      @Public()
      @HttpCode(200)
      @UseGuards(LocalAuthenticationGuard)
      @Post('login')
      async logIn(@Req() request: RequestWithUser) {
        return this.authenticationService.login(request.user);
      }

      @ApiBearerAuth()
      @Get('logout')
      async logout(@Req() req) {
        return this.authenticationService.logout(req.user);
      }
}
