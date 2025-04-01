import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
        include: { profile: true },
      });
      if (!user) throw new NotFoundException('User Not Found');
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(username: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { OR: [{ username }, { email: username }] },
      });
      if (!user) throw new NotFoundException('User Not Found');
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createProfile(id: string, body: CreateProfileDto) {
    try {
      console.log(id)
      const { first_name, last_name, phone } = body;
      const newProfile = await this.prisma.profile.create({
        data: { user: { connect: { id } }, first_name, last_name, phone },
      });
      return newProfile;
    } catch (error) {
      console.log(error)
      throw new BadRequestException("Error creating profile");
    }
  }
}
