import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from 'src/game/game.service';

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
   * @param session - The session of the player searching for a game
   */
  async searchGame(session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1;

    const lobby = await this.prisma.lobby.findMany();

    if (lobby.length === 0) {
      try {
        await this.prisma.lobby.create({
          data: {
            sessionId: session.id,
          },
        });
        return { session: session.id };
      } catch (e) {
        console.log(`Error while adding to database: ${e}`);
        throw new InternalServerErrorException(
          'Database error: You most likely already in lobby',
        );
      }
    } else if (lobby.length === 1 && lobby[0].sessionId !== session.id) {
      const startedGame = await this.game.createGame(
        lobby[0].sessionId,
        session.id,
      );
      await this.prisma.lobby.deleteMany();

      this.logger.log(
        `Game ${startedGame.gameId} started between ${lobby[0].sessionId} and ${session.id}`,
      );
      return {
        session: session.id,
        message: 'Game started. You can access it with your session id.',
      };
    } else if (lobby.length === 1 && lobby[0].sessionId === session.id) {
      await this.prisma.lobby.update({
        where: { sessionId: lobby[0].sessionId },
        data: {},
      });
      return {
        session: session.id,
        message: 'You are already in the lobby. Waiting for another player.',
      };
    } else {
      throw new InternalServerErrorException(
        'Database error: Multiple lobbies found',
      );
    }
  }

  async checkTimeout(timeout: number) {
    this.logger.log('Lobby timed out test');
  }
}
