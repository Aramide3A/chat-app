import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  createProfile(@Request() req, @Body() body: CreateProfileDto) {
    return this.userService.createProfile(req.user.userId, body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getUSer(@Request() req) {
    return this.userService.getUser(req.user.sub);
  }
}
