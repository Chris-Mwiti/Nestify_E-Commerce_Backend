import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './constants/saltrounds.constants';

@Injectable()
export class AuthService {

    private async hashPassword(password:string){
        const hashedPwd = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPwd;
    }
}
