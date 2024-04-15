import {Controller, Get, Req, Res} from '@nestjs/common';
import { LobbyService } from './lobby.service';
import {Cron} from "@nestjs/schedule";
import {Request, Response} from "express";

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Get()
  async searchGame(@Req() req: Request, @Res() res: Response) {
    return this.lobbyService.searchGame(req, res);
  }

  @Cron('*/15 * * * * *')
  handleCron() {
    this.lobbyService.checkTimeout(1000);
  }
}
