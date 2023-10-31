import { Controller, Get } from '@nestjs/common';

@Controller({
  path: '/',
})
export class HeartbeatController {
  @Get()
  getVersion() {
    return {
      name: process.env.PROJECT_NAME,
      version: process.env.PROJECT_VERSION,
    };
  }
}
