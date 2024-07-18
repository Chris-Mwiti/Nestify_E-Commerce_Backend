import { CustomLoggerService } from "src/utils/custom-logger/custom-logger.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export class UsersService {
  constructor(private readonly loggerService:CustomLoggerService,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>
  ){}

  async getUsers(query: {
    skip?: number,
    take?: number,
  }){
    try {
      if(query.skip && query.take){
        const foundUsers = await this.userRepository.find({
          skip: query.skip,
          take: query.take
        })
        return foundUsers;
      }
      const foundUsers = await this.userRepository.find();
      return foundUsers;
    } catch (fetchError) {
      this.loggerService.error(fetchError.message);
      throw new InternalServerErrorException("Could not fetch users")
    }
  } 
  
  async getUser(id:string){
    try {
      this.loggerService.log("Fetching user...");
      const foundUser = await this.userRepository.findOne({
        where: {
          id
        }
      }) 
      if(!foundUser) throw new NotFoundException("User could not be found")
    } catch (fetchError) {
      this.loggerService.error(fetchError.message)

      if(fetchError instanceof NotFoundException) throw fetchError

      throw new InternalServerErrorException("Could not fetch user");
    }
  }
}