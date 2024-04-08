import { Controller, Get, Session } from '@nestjs/common';
import { LobbyService } from './lobby.service';
@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Get()
  async searchGame(@Session() session: Record<string, any>) {
    return this.lobbyService.searchGame(session);
  }
}
