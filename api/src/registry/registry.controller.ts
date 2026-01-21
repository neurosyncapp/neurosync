import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { RegistryService } from './registry.service';

@Controller()
export class RegistryController {
  constructor(private registry: RegistryService) {}

  @Get('availability')
  availability(@Query('name') name: string) {
    return this.registry.availability(name || '');
  }

  @Get('explore')
  explore(
    @Query('q') q: string,
