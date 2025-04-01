import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { OR: [{ username }, { email: username }] },
      });
      if (!user) throw new NotFoundException('User Not Found');

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword)
        throw new UnauthorizedException('Invalid User details');

      return user;
    } catch (error) {
      throw new BadRequestException('User validation failed');
    }
  }

  async login(user: any) {
    try {
      if (!user) throw new NotFoundException('User Not Found');
      const payload = { sub: user.id, username: user.username };
      return { token: await this.jwt.sign(payload) };
    } catch (error) {
      throw new BadRequestException('User Login failed');
    }
  }

  async createUser(body: CreateUserDto) {
    try {
      const { username, email, password } = body;

      const existingUser = await this.prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: { username, email, password: hashPassword },
      });

      return await this.login(newUser);
    } catch (error) {
      console.log(error)
      throw new BadRequestException('User creation failed');
    }
  }
}
