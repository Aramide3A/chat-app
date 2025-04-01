import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createRoom(@Request() req,@Body() body: string) {
    return this.roomService.createRoom(req.user.userId, body);
  }

  @Get(':roomId')
  @UseGuards(JwtAuthGuard)
  getSpecificRoom(@Param('roomId') roomId) {
    return this.roomService.getSpecificRoom(roomId);
  }

  @Put(':roomId/join')
  @UseGuards(JwtAuthGuard)
  joinRoom(@Request() req,@Param('roomId') roomId) {
    return this.roomService.joinRoom(roomId,req.user.userId);
  }

  @Put(':roomId/leave')
  @UseGuards(JwtAuthGuard)
  leaveRoom(@Request() req,@Param('roomId') roomId) {
    return this.roomService.leaveRoom(roomId,req.user.userId);
  }

  @Delete(':roomId/delete')
  @UseGuards(JwtAuthGuard)
  deleteRoom(@Request() req,@Param('roomId') roomId) {
    return this.roomService.deleteRoom(roomId,req.user.userId);
  }
}
