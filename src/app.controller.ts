import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  home() {
    return {
      status: 'ok',
      message: 'EliteFund API is running 🚀',
    };
  }
}
