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
   * @param req - Request
   * @param res - Response
   */
  async searchGame(req: Request, res: Response) {

    let sessionId = this.generateRandomString(32)
    if (req.cookies.session) {
      sessionId = req.cookies.session;
    }

    const lobby = await this.prisma.lobby.findMany();

    if (lobby.length === 0) {
      await this.prisma.lobby.create({
        data: {
          sessionId: sessionId
        },
      });

      this.logger.log(`Player ${sessionId} joined the lobby`);
      res.cookie('session', sessionId, { httpOnly: true }).json({ session: sessionId });
    } else if (lobby.length === 1 && lobby[0].sessionId !== sessionId) {
      const startedGame = await this.game.createGame(
        lobby[0].sessionId,
        sessionId,
      );
      await this.prisma.lobby.deleteMany();

      this.logger.log(
        `Game ${startedGame.gameId} started between ${lobby[0].sessionId} and ${sessionId}`,
      );
      res.cookie('session', sessionId, { httpOnly: true }).json({ session: sessionId, message: 'Game started. You can access it with your session  id.' });
    } else if (lobby.length === 1 && lobby[0].sessionId === sessionId) {
      await this.prisma.lobby.update({
        where: { sessionId: lobby[0].sessionId },
        data: {},
      });
      this.logger.log(`Player ${sessionId} refreshed the lobby`);
      res.cookie('session', sessionId, { httpOnly: true }).json({ session: sessionId, message: 'You are already in the lobby. Waiting for another player.' });
    } else {
      throw new InternalServerErrorException(
        'Database error: Multiple lobbies found',
      );
    }
  }

  async checkTimeout(seconds: number) {
    const lobby = await this.prisma.lobby.findMany();
    if (lobby.length === 1) {
      const secondsSinceLastAction = Math.floor(
          (Date.now() - new Date(lobby[0].timestamp).getTime()) / 1000,
      );
      if (secondsSinceLastAction > seconds) {
        await this.prisma.lobby.deleteMany();
        this.logger.log(`Lobby timed out`);
      }
    }
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
