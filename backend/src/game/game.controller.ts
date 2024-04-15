import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { PlayDto } from './dto/play.dto';
import { Cron } from '@nestjs/schedule';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':sessionId')
  async getGame(@Param('sessionId') sessionId: string) {
    return this.gameService.getGame(sessionId);
  }

  @Post(':sessionId/play')
  async playGame(@Body() cord: PlayDto, @Param('sessionId') sessionId: string) {
    return this.gameService.playGame(sessionId, cord.x, cord.y);
  }

  @Cron('*/15 * * * * *')
  handleCron() {
    this.gameService.checkTimeout(1000);
  }
}
