import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from 'src/game/game.service';
import { Request, Response } from 'express';

@Injectable()
export class LobbyService {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
    private game: GameService,
  ) {
    this.logger = new Logger(LobbyService.name);
  }

  /**
   * Searches for a game to join.
   * @param req
   */
  async searchGame(req: Request, res: Response) {

    let id;
    if (req.cookies.session) {
      console.log('cookie found');
      id = req.cookies.session;
    }
    else {
      id = this.generateRandomString(32)
    }

    const lobby = await this.prisma.lobby.findMany();

    if (lobby.length === 0) {
      await this.prisma.lobby.create({
        data: {
          sessionId: id
        },
      });
      res.cookie('session', id, { httpOnly: true }).json({ session: id });
    } else if (lobby.length === 1 && lobby[0].sessionId !== id) {
      const startedGame = await this.game.createGame(
        lobby[0].sessionId,
        id,
      );
      await this.prisma.lobby.deleteMany();

      this.logger.log(
        `Game ${startedGame.gameId} started between ${lobby[0].sessionId} and ${id}`,
      );
      res.cookie('session', id, { httpOnly: true }).json({ session: id, message: 'Game started. You can access it with your session id.' });
    } else if (lobby.length === 1 && lobby[0].sessionId === id) {
      await this.prisma.lobby.update({
        where: { sessionId: lobby[0].sessionId },
        data: {},
      });
      res.cookie('session', id, { httpOnly: true }).json({ session: id, message: 'You are already in the lobby. Waiting for another player.' });
    } else {
      throw new InternalServerErrorException(
        'Database error: Multiple lobbies found',
      );
    }
  }

  async checkTimeout(timeout: number) {
    this.logger.log('Lobby timed out test');
  }

  private generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
