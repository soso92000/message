import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/entities/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InMemoryDBService, InjectInMemoryDBService } from '@nestjs-addons/in-memory-db';
import { JwtEntity} from '../entity/jwt.entity'

@Injectable()
export class AuthentificationService{
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private readonly jwtEntityService: InMemoryDBService<JwtEntity>,  private jwtService: JwtService ){}

    async create(createUserDto: CreateUserDto) {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      try {
        let user = await this.userRepository.create({ ...createUserDto });
        user.password = hashedPassword;
        user = await this.userRepository.save(user); 
        return user;
      } catch(error) {
        if (error.message.includes(createUserDto.email)) {
          throw new HttpException('Email already exist', HttpStatus.CONFLICT);
        }
        if (error.message.includes(createUserDto.phone)) {
          throw new HttpException('Phone number already exist', HttpStatus.CONFLICT);
        }
        throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    async validateUser(email: string, password: string) {
      try {
        const user = await this.userRepository.findOne({ email });
        await this.verifyPassword(password, user.password);
        return user;
      } catch(error) {
         throw new HttpException('Wrong credentials provided', HttpStatus.NOT_FOUND);
      }
      
    }
  
    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
      const isPasswordMatching = await bcrypt.compare(
        plainTextPassword,
        hashedPassword
      );
      if (!isPasswordMatching) {
        throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
      }
    }

    async login(user: any) {
        const payload = { username: user.name, sub: user.id, email: user.email };
        await this.jwtEntityService.create({ id: user.id.toString(), email: user.email });
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    async logout({ userId:id }) {
      return this.jwtEntityService.deleteAsync(id);
    }
}
