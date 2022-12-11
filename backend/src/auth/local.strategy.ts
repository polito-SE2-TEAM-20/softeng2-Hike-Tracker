import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '@app/common';

import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.verified) {
      throw new HttpException(
        'E-mail verification needed before to log-in',
        403,
      );
    }

    if ((user.role === 2 || user.role === 4) && !user.approved) {
      throw new HttpException(
        'You must be approved from manager before to log-in',
        403,
      );
    }

    return user;
  }
}
