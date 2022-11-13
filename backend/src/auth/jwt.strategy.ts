import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';

import { JWT_SECRET, User, UserContext, UserJwtPayload } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate({ id }: UserJwtPayload): Promise<UserContext> {
    const _user = await this.dataSource.getRepository(User).findOneBy({ id });

    if (!_user) {
      throw new UnauthorizedException();
    }

    const user: User = { ..._user };

    delete user.password;

    return user;
  }
}
