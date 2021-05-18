import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../entities/dto/create-user.dto';
import { UpdateUserDto } from '../entities/dto/update-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    let user = this.userRepository.create({ ...createUserDto });
    user = await this.userRepository.save(user); 
    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  findOneByMail(email: string) {
    return this.userRepository.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userRepository.softDelete(id);
  }
}
