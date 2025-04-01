import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(userId, roomId, body: string) {
    try {
      const newMessage = await this.prisma.message.create({
        data: {
          user: {
            connect: { id: userId },
          },
          room: {
            connect: { id: roomId },
          },
          content: body,
        },
      });
      return newMessage;
    } catch (error) {
      throw new BadRequestException('Error creating message');
    }
  }

  async getAllMessages(roomId) {
    try {
      const getMessages = await this.prisma.message.findMany({
        where: { roomId },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      throw new BadRequestException('Error creating message');
    }
  }
}
