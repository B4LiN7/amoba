import {Controller, Get, Param, Post, Body, Res} from '@nestjs/common';
import { GameService } from './game.service';
import { PlayDto } from './dto/play.dto';
import { Cron } from '@nestjs/schedule';
import {Response} from "express";

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':sessionId')
  async getGame(@Param('sessionId') sessionId: string, @Res() res: Response) {
    return this.gameService.getGame(sessionId, res);
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
