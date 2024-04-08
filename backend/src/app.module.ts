import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LobbyModule } from './lobby/lobby.module';
import { GameModule } from './game/game.module';
import { StaticModule } from './static/static.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    LobbyModule,
    GameModule,
    StaticModule,
  ],
})
export class AppModule {}
