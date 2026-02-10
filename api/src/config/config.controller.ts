import { Controller, Get } from '@nestjs/common';
import { publicConfig } from '../config';

@Controller()
export class ConfigController {
  @Get('config')
  config() {
    return publicConfig();
  }

  @Get('health')
  health() {
    return { ok: true };
  }
}
