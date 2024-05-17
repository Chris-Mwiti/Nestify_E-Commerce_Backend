import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { TUser, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { AuthService } from 'src/auth/auth.service';

/**
 * @todo:{
 *    1. Add a dto mapper that will enable one to select specific properties of a record to be returned.
 *    2.
 * }
 */

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly recordIdService: RecordIdGeneratorService,
    private readonly loggerService: CustomLoggerService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    this.loggerService.log('Creating User...', {
      label: UsersService.name,
    });

    //Checks if user exists
    const doesUserExist = this.existsByEmail(createUserDto.email);
    if (!doesUserExist) throw new BadRequestException('User already exists');

    const userId = this.recordIdService.generate('USER');
    //Hash password
    if (createUserDto.password) {
      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );
    }

    const userInfoObj = this.userRepository.create({
      userId,
      ...createUserDto,
    });
    const {
      password,
      avatarUrl,
      googleId,
      profileUrl,
      createdAt,
      updatedAt,
      role,
      userId: id,
      ...result
    } = await this.userRepository.save(userInfoObj);
    return result;
  }

  async findAllUsers() {
    this.loggerService.log('Fetching users...', {
      label: UsersService.name,
    });
    const users = await this.userRepository.find();
    return users;
  }

  async findUserById(id: string) {
    this.loggerService.log('Fetching user...', {
      label: UsersService.name,
    });
    const result = await this.userRepository.findOne({
      where: {
        userId: id,
      },
    });
    if (!result) throw new BadRequestException('User does not exist');
    return result;
  }

  async findUserByEmail(email: string) {
    this.loggerService.log('Fetching user...');
    const result = await this.userRepository.findOneBy({
      email: email,
    });
    if (!result) throw new BadRequestException('User does not exist');
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.loggerService.log('Updating user...', {
      label: UsersService.name,
    });
    const updatedResult = await this.userRepository.update(
      {
        userId: id,
      },
      updateUserDto,
    );
    if (!updatedResult) throw new BadRequestException('User does not exist');
    return updatedResult;
  }

  async removeUser(id: string) {
    this.loggerService.log('Deleting user...', {
      label: UsersService.name,
    });
    const removeResult = await this.userRepository.delete({
      userId: id,
    });
    if (!removeResult) throw new BadRequestException('User does exist');
    return removeResult;
  }

  private async existsByEmail(email: string) {
    this.loggerService.log('Fetching user by email...', {
      label: UsersService.name,
    });
    const doesUserExist = await this.userRepository.existsBy({
      email: email,
    });
    return doesUserExist;
  }
}
