import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { CONFIG } from '../config';

@Injectable()
export class DbService implements OnModuleInit {
  private readonly log = new Logger('Db');
  pool: Pool;

  async onModuleInit() {
