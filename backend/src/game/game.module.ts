import { Logger, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GameController],
  providers: [GameService, Logger],
  exports: [GameService],
})
export class GameModule {}
