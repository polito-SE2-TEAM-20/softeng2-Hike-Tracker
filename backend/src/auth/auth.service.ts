import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { DataSource } from 'typeorm';

import { User } from '@app/common';

@Injectable()
export class AuthService {
  private readonly HASH_ROUNDS = 10;

  constructor(private dataSource: DataSource, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.dataSource.getRepository(User).findOneBy({ email });

    if (user && (await this.validatePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  async register(user: User) {
    const hashedPassword = await this.hashPassword(user.password);
    this.dataSource
      .getRepository(User)
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          email: user.email,
          password: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      ])
      .execute();
  }

  async login(user: User) {
    const payload = { email: user.email };

    return {
      ...user,
      password: '',
      token: await this.jwtService.signAsync(payload),
    };
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.HASH_ROUNDS);
  }
}
