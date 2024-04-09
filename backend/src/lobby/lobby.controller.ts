import { Controller, Get, Session } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import {Cron} from "@nestjs/schedule";
@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Get()
  async searchGame(@Session() session: Record<string, any>) {
    return this.lobbyService.searchGame(session);
  }

  @Cron('*/15 * * * * *')
  handleCron() {
    this.lobbyService.checkTimeout(100);
  }
}
