import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async getAllRooms() {
    try {
      const allRooms = this.prisma.room.findMany();
      return allRooms;
    } catch (error) {
      throw new BadRequestException('Error Getting All Rooms');
    }
  }

  async getSpecificRoom(roomId) {
    try {
      const specificRoom = this.prisma.room.findUnique({
        where: { roomId },
      });
      return specificRoom;
    } catch (error) {
      throw new BadRequestException('Error Getting Specific Room');
    }
  }

  async createRoom(userId, body) {
    try {
      const roomId = uuid().slice(0, 6);
      console.log(roomId);
      const newRoom = await this.prisma.room.create({
        data: {
          creator: { connect: { id: userId } },
          name: body.name,
          roomId,
        },
      });
      return newRoom;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating room');
    }
  }

  async joinRoom(roomId, userId) {
    try {
      const getRoom = await this.prisma.room.findUnique({
        where: { roomId },
      });
      if (!getRoom) throw new NotFoundException('Room Not Found');

      if (getRoom.creatorId === userId)
        throw new BadRequestException('You are the creator of the room!');

      if (getRoom.memberIds.includes(userId))
        throw new BadRequestException('You are already a member of the room!');

      const updateRoom = [...getRoom.memberIds, userId];

      const joinRoom = await this.prisma.room.update({
        where: { roomId },
        data: {
          memberIds: updateRoom,
        },
      });
      return { message: 'You are now a member of this room' };
    } catch (error) {
      throw new BadRequestException('Error Joining Room');
    }
  }

  async leaveRoom(roomId, userId) {
    try {
      const getRoom = await this.prisma.room.findUnique({
        where: { roomId },
      });
      if (!getRoom) throw new NotFoundException('Room Not Found');
      const members = getRoom.memberIds;

      if (!members.includes(userId))
        throw new BadRequestException('You are not a member of this room!');

      const updatedMembers = members.filter((member) => member != userId);

      if (updatedMembers.length === 0) {
        const deleteRoom = await this.prisma.room.delete({
          where: { roomId },
        });
        return { message: 'You have successfully left this room' };
      }

      const leaveRoom = await this.prisma.room.update({
        where: { roomId },
        data: {
          memberIds: updatedMembers,
        },
      });
      return { message: 'You have successfully left this room' };
    } catch (error) {
      throw new BadRequestException('Error leaving Room');
    }
  }

  async deleteRoom(roomId, userId) {
    try {
        const getRoom = await this.prisma.room.findUnique({
            where: { roomId },
          });
          if (!getRoom) throw new NotFoundException('Room Not Found');

        if (getRoom.creatorId != userId) throw new UnauthorizedException("Only the creator can delete a room")

        const deleteRoom = await this.prisma.room.delete({
            where : {roomId}
        })

        return {message : "Room deleted successfully"}
    } catch (error) {
        throw new BadRequestException('Error deleting Room');
    }
  }
}
