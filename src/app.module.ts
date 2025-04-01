import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MessageModule,
    RoomModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
