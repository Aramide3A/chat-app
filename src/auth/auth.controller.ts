import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';
import { LocalAuthGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.createUser(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  loginUser(@Request() req, @Body() body) {
    return this.authService.login(req.user);
  }
}
