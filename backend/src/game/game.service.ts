import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) {
    this.logger = new Logger(GameService.name);
  }

  /**
   * Gets the current game state.
   * @param sessionId - The session ID of the player requesting the game state
   */
  async getGame(sessionId: string) {
    const game = await this.prisma.game.findFirst({
      where: {
        OR: [{ session1: sessionId }, { session2: sessionId }],
      },
    });
    if (!game) {
      throw new BadRequestException('No game found for this session');
    }

    this.logger.log(`Game ${game.gameId} requested by ${sessionId}`);
    return {
      yourSymbol: game.session1 === sessionId ? 'X' : 'O',
      state: JSON.parse(game.state),
      winner: this.checkWin(JSON.parse(game.state)),
    };
  }

  /**
   * Makes a move in the game.
   * @param sessionId - The session ID of the player making the move
   * @param x - The X coordinate of the move
   * @param y - The Y coordinate of the move
   */
  async playGame(sessionId: string, x: number, y: number) {
    const game = await this.prisma.game.findFirst({
      where: {
        OR: [{ session1: sessionId }, { session2: sessionId }],
      },
    });
    const board = JSON.parse(game.state);
    if (this.checkWin(board) !== null) {
      throw new BadRequestException('The game is already over');
    }

    const player = game.session1 === sessionId ? 'X' : 'O';
    const newBoard = this.moveOnBoard(board, player, x, y);
    await this.prisma.game.update({
      where: { gameId: game.gameId },
      data: { state: JSON.stringify(newBoard) },
    });

    this.logger.log(`Game ${game.gameId} updated by ${sessionId}`);
    return {
      yourSymbol: game.session1 === sessionId ? 'X' : 'O',
      state: newBoard,
      winner: this.checkWin(newBoard),
    };
  }

  /**
   * Creates a new game between two players.
   * @param session1Id - The session ID of the first player
   * @param session2Id - The session ID of the second player
   */
  async createGame(session1Id: string, session2Id: string) {
    return this.prisma.game.create({
      data: {
        session1: session1Id,
        session2: session2Id,
        state: this.createBoard(5),
      },
    });
  }

  /**
   * Creates a new board for a game.
   * @param size - The size of the board (size x size)
   */
  private createBoard(size: number): string {
    if (size < 3) {
      throw new BadRequestException('Board size must be at least 3x3');
    } else if (size > 10) {
      throw new BadRequestException('Board size must be at most 10x10');
    }
    const board = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ''),
    );
    return JSON.stringify(board);
  }

  /**
   * Makes a move on the board.
   * @param board - The current game state
   * @param player - The player making the move
   * @param x - The X coordinate of the move
   * @param y - The Y coordinate of the move
   * @private
   */
  private moveOnBoard(
    board: string[][],
    player: 'X' | 'O',
    x: number,
    y: number,
  ): string[][] {
    const errorArray: string[] = [];

    if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) {
      errorArray.push('Move is out of bounds');
    }
    if (board[x][y] !== '') {
      errorArray.push('Cell is already taken');
    }

    const numberOfOs = board.reduce((acc, row) => {
      return acc + row.filter((cell) => cell === 'O').length;
    }, 0);
    const numberOfXs = board.reduce((acc, row) => {
      return acc + row.filter((cell) => cell === 'X').length;
    }, 0);
    if (player === 'O' && numberOfOs >= numberOfXs) {
      errorArray.push('It is not your (O) turn');
    }
    if (player === 'X' && numberOfXs > numberOfOs) {
      errorArray.push('It is not your (X) turn');
    }

    if (errorArray.length > 0) {
      throw new BadRequestException(errorArray);
    }

    board[x][y] = player;
    return board;
  }

  /**
   * Checks if the game has been won.
   * @param board - The current game state
   * @param winLength - The number of consecutive cells needed to win
   * @returns 'X' if player X has won, 'O' if player O has won, null if the game is a draw, and undefined if the game is still ongoing
   */
  private checkWin(
    board: string[][],
    winLength: number = board[0].length,
  ): 'X' | 'O' | 'DRAW' | null {
    // Check for a draw
    let numberOfEmptyCells = 0;
    for (const row of board) {
      numberOfEmptyCells += row.filter((cell) => cell === '').length;
    }
    if (numberOfEmptyCells === 0) {
      return 'DRAW';
    }

    // Check rows
    for (const row of board) {
      let count = 0;
      let last = '';
      for (const cell of row) {
        if (cell === last && cell !== '') {
          count++;
          if (count === winLength) {
            return cell as 'X' | 'O';
          }
        } else {
          count = 1;
          last = cell;
        }
      }
    }

    // Check columns
    // board[0].length is the number of columns
    // board.length is the number of rows
    for (let i = 0; i < board[0].length; i++) {
      let count = 0;
      let last = '';
      for (let j = 0; j < board.length; j++) {
        const cell = board[j][i];
        if (cell === last && cell !== '') {
          count++;
          if (count === winLength) {
            return cell as 'X' | 'O';
          }
        } else {
          count = 1;
          last = cell;
        }
      }
    }

    // Check diagonals
    for (let i = 0; i < board.length; i++) {
      let count = 0;
      let last = '';
      for (let j = 0; j < board[0].length; j++) {
        if (i + j >= board.length) {
          break;
        }
        const cell = board[i + j][j];
        if (cell === last && cell !== '') {
          count++;
          if (count === winLength) {
            return cell as 'X' | 'O';
          }
        } else {
          count = 1;
          last = cell;
        }
      }
    }

    // Check reverse diagonals
    for (let i = 0; i < board.length; i++) {
      let count = 0;
      let last = '';
      for (let j = 0; j < board[0].length; j++) {
        if (i + j >= board.length) {
          break;
        }
        const cell = board[i + j][board[0].length - 1 - j];
        if (cell === last && cell !== '') {
          count++;
          if (count === winLength) {
            return cell as 'X' | 'O';
          }
        } else {
          count = 1;
          last = cell;
        }
      }
    }

    return null;
  }

  /**
   * Checks if any games have timed out and deletes them.
   * @param seconds - The number of seconds after which a game is considered timed out
   */
  async checkTimeout(seconds: number) {
    const games = await this.prisma.game.findMany();
    for (const game of games) {
      const secondsSinceLastAction = Math.floor(
        (Date.now() - new Date(game.lastActionTimestamp).getTime()) / 1000,
      );
      if (secondsSinceLastAction > seconds) {
        await this.prisma.game.delete({ where: { gameId: game.gameId } });
        this.logger.log(`Game ${game.gameId} has timed out`);
      }
    }
  }

  /**
   * Writes the current game state to the console. Debugging purposes only.
   * @param board - The current game state
   */
  private writeGameToConsole(board: string[][]) {
    console.log('Current game state:');
    for (const row of board) {
      console.log(row.join(' '));
    }
    console.log(`Win? ${this.checkWin(board, 3)}\n`);
  }
}
