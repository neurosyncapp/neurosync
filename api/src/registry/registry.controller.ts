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
    @Query('sort') sort: string,
    @Query('filter') filter: string,
    @Query('limit') limit: string,
  ) {
    return this.registry.explore({ q, sort, filter, limit: Number(limit) });
  }

  @Get('stats')
  stats() {
    return this.registry.stats();
  }

  @Get('activity')
  activity(@Query('limit') limit: string) {
    return this.registry.activity(Number(limit) || 40);
  }

  @Get('resolve/:name')
  async resolve(@Param('name') name: string) {
    const r = await this.registry.resolve(name);
    if (!r) throw new NotFoundException('Name not registered');
    return r;
  }

  @Get('reverse/:wallet')
  reverse(@Param('wallet') wallet: string) {
    return this.registry.reverse(wallet);
  }

  @Get('names/:wallet')
