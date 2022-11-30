import { randomBytes } from 'crypto';

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { DataSource } from 'typeorm';

import { User, UserContext, UserJwtPayload } from '@app/common';
import { safeUser } from '@core/users/users.utils';

import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  private readonly HASH_ROUNDS = 10;

  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.dataSource.getRepository(User).findOneBy({ email });

    if (user && (await this.validatePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  async register({ password, ...data }: RegisterDto): Promise<UserContext> {
    const hashedPassword = await this.hashPassword(password);
    const randomHash = randomBytes(128).toString('hex');

    const user = await this.dataSource.getRepository(User).save({
      ...data,
      password: hashedPassword,
      verificationHash: randomHash,
    });

    await this.mailService.sendMail({
      to: data.email,
      from: 'hikingofficial@protonmail.com',
      subject: 'E-mail verification ✔',
      text:
        'Hi ' +
        data.firstName +
        ', please confirm your e-mail clicking on this link: http://hiking-backend.germangorodnev.com/auth/verify/' +
        randomHash,
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

  async validateRegistration(verificationHash: string): Promise<Object> {
    const user = await this.dataSource
      .getRepository(User)
      .findOneBy({ verificationHash });
      
    if (user === null) 
      throw new HttpException("User doesn't exists", 422);
    
    if (user.verified === true)
      throw new HttpException('User already verified', 409);
    
      await this.dataSource.getRepository(User).save({
        ...user,
        verified: true,
      });
    return { 'Account Verification': 'Successful' };
  }

  async retrieveNotApprovedLocalGuides():Promise<UserContext[]> {
    const users = await this.dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.verified = true')
    .andWhere('user.approved = false')
    .andWhere('user.role = 2')
    .getMany()

    const safeUsers: UserContext[] = users.map((u) => {
      return safeUser(u)
    })

    return safeUsers
  }

  async retrieveNotApprovedHutWorkers():Promise<UserContext[]> {
    const users = await this.dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.verified = true')
    .andWhere('user.approved = false')
    .andWhere('user.role = 4')
    .getMany()

    const safeUsers: UserContext[] = users.map((u) => {
      return safeUser(u)
    })

    return safeUsers
  }

  async approveUser(id: number): Promise<Object>{
    const user = await this.dataSource
    .getRepository(User)
    .findOneBy({ id });

    if (user === null) 
      throw new HttpException("User doesn't exists", 422);

    if (user.role !== 2 && user.role !== 4)
      throw new HttpException('User with this role does not need to be approved', 409);
    
    if (user.verified !== true) 
      throw new HttpException('User needs to verify his email before to be approved', 409);

    await this.dataSource.getRepository(User).save({
      ...user,
      approved: true,
    });
    
    return { 'Account Approvation': 'Successful' };
  }

}
