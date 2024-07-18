import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import AppRouter from 'api-contract';
import { TsRestException, tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { Controller, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import PROVIDER_KEYS from 'src/utils/interceptor/ts/providers.keys';

type StatusCode = "400" | "500" | "201"
 
@Controller()
@Roles(Role.USER)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(PROVIDER_KEYS)
  ) {}

  @TsRestHandler(AppRouter.users)
    async usersHandler(){
      return tsRestHandler(AppRouter.users, {
        getAllUsers(args) {
          try {
            const users = await th
          } catch (fetchErr) {
            
          }
        },
      })
  }
}
