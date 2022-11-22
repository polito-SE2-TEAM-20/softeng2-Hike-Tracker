import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { DataSource } from 'typeorm';

import { User, UserContext, UserJwtPayload } from '@app/common';
import { safeUser } from '@core/users/users.utils';

import { RegisterDto } from './auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private readonly HASH_ROUNDS = 10;

  constructor(private dataSource: DataSource, private jwtService: JwtService, private mailService: MailerService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.dataSource.getRepository(User).findOneBy({ email });

    if (user && (await this.validatePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  async register({ password, ...data }: RegisterDto): Promise<UserContext> {
    const hashedPassword = await this.hashPassword(password);

    const user = await this.dataSource.getRepository(User).save({
      ...data,
      password: hashedPassword,
    });

    await this.mailService.sendMail({
      to:data.email,
      from:"hikingofficial@protonmail.com",
      subject: 'E-mail verification ✔',
      text: 'Hi '+data.firstName+', please confirm your e-mail clicking on this link: ', 
    });

    // const token = await this.jwtService.signAsync({ id: user.id });

    return safeUser(user);
  }

  async login(user: UserContext) {
    return {
      user: safeUser(user),
      token: await this.signUserJwt(user),
    };
  }

  async signUserJwt(user: UserContext): Promise<string> {
    const payload: UserJwtPayload = { id: user.id };

    return await this.jwtService.signAsync(payload);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.HASH_ROUNDS);
  }
}
