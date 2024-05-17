import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {

  private logger:Logger = new Logger(RoleGuard.name);

  constructor(private readonly reflactor:Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflactor.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    /**
     * @todo: update to support each route handler to support roles metadata if not throw an error
     */
    if(!requiredRoles){
      return true
    }

    const { user } = context.switchToHttp().getRequest();

    const isUserAuthorized = requiredRoles.some((role) => {
      let currRole:number;
      currRole = user.role == "admin" ? Role.ADMIN : Role.USER;

      return currRole >= role
    });
    this.logger.warn('Role guard in action...')
    if(!isUserAuthorized) throw new ForbiddenException('Admin users are the only ones authorized');

    return true
  }
}
