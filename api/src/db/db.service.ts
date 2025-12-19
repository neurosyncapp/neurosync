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
      CREATE TABLE IF NOT EXISTS agents (
        name            TEXT PRIMARY KEY,
        pda             TEXT,
        owner           TEXT NOT NULL,
        resolver        TEXT,
        metadata_uri    TEXT,
        category        TEXT,
        capabilities    JSONB,
        registered_at   TIMESTAMPTZ,
        expires_at      TIMESTAMPTZ,
        last_chain_beat TIMESTAMPTZ,
        last_seen       TIMESTAMPTZ,
        heartbeat_count BIGINT DEFAULT 0,
        reputation      INT DEFAULT 0,
        description     TEXT,
        links           JSONB,
        updated_at      TIMESTAMPTZ DEFAULT now()
      );
      ALTER TABLE agents ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE agents ADD COLUMN IF NOT EXISTS links JSONB;
      CREATE INDEX IF NOT EXISTS idx_agents_owner ON agents(owner);
      CREATE INDEX IF NOT EXISTS idx_agents_rep   ON agents(reputation DESC);
      CREATE INDEX IF NOT EXISTS idx_agents_seen  ON agents(last_seen DESC);

      CREATE TABLE IF NOT EXISTS events (
        id      BIGSERIAL PRIMARY KEY,
        type    TEXT NOT NULL,
        name    TEXT NOT NULL,
        owner   TEXT,
        to_addr TEXT,
        tx      TEXT,
        ts      TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts DESC);
    `);
  }

  query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}
