import { Controller, Get } from '@nestjs/common';

@Controller()
export class StaticController {
  @Get()
  getHello() {
    return { message: 'Hello' };
  }
}
