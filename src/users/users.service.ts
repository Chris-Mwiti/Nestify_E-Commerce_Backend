import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { TUser, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordIdGeneratorService } from 'src/record-id-generator/record-id-generator.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>,
    private readonly recordIdService:RecordIdGeneratorService 
  ){}

  async create(createUserDto:CreateUserDto) {
    try {
      const userId = this.recordIdService.generate("USER");
      const userInfoObj = this.userRepository.create({ userId, ...createUserDto});
      
      const response = this.userRepository.save(userInfoObj);
      return response
    }catch(createError){
      throw new InternalServerErrorException(createError.message);
    }
  }

  findAll() {
    try {
      const users = this.userRepository.find();
      return users
    } catch(fetchError){
      
      throw new InternalServerErrorException();
    }
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
