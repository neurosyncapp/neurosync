import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { CONFIG } from '../config';

@Injectable()
export class DbService implements OnModuleInit {
  private readonly log = new Logger('Db');
  pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({ connectionString: CONFIG.databaseUrl, max: 8 });
    await this.waitForDb();
    await this.migrate();
    this.log.log('Database ready');
  }

  private async waitForDb() {
    for (let i = 0; i < 30; i++) {
      try {
        await this.pool.query('SELECT 1');
        return;
      } catch {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    throw new Error('Database not reachable');
  }

  private async migrate() {
    await this.pool.query(`
