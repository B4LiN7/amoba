import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private logger: Logger) {
    super();
    this.logger = new Logger(PrismaService.name);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database reachable at startup');
    } catch (err) {
      this.logger.error(`Database unreachable at startup: ${err}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}