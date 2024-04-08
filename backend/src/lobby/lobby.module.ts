import { Logger, Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [PrismaModule, GameModule],
  controllers: [LobbyController],
  providers: [LobbyService, Logger],
})
export class LobbyModule {}
