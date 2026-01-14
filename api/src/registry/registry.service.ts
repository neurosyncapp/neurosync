import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CONFIG } from '../config';
import { normalizeName, isValidName } from '../common/name.util';

export interface AgentRow {
  name: string;
  owner: string;
  resolver: string;
  metadata_uri: string;
  category: string;
  capabilities: string[];
  registered_at: string;
  expires_at: string;
  last_seen: string;
  last_chain_beat: string;
  heartbeat_count: string;
  reputation: number;
}

@Injectable()
export class RegistryService {
  constructor(private db: DbService) {}

  // ---- reputation ----
  computeReputation(opts: {
    registeredAt?: Date;
    heartbeatCount?: number;
    lastSeen?: Date;
  }): number {
    const now = Date.now();
    const ageDays = opts.registeredAt ? (now - opts.registeredAt.getTime()) / 86400000 : 0;
    const age = Math.min(ageDays, 90) / 90; // 0..1
    const beats = Math.min(opts.heartbeatCount || 0, 500) / 500; // 0..1
    let recency = 0;
    if (opts.lastSeen) {
      const dt = now - opts.lastSeen.getTime();
      if (dt < CONFIG.onlineWindowMs) recency = 1;
      else if (dt < 3600000) recency = 0.6;
      else if (dt < 86400000) recency = 0.3;
    }
    const score = age * 35 + beats * 35 + recency * 30;
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  // ---- writes (indexer + heartbeat) ----
  async upsertFromChain(a: {
    name: string;
    pda: string;
    owner: string;
    resolver: string;
    metadataUri: string;
    registeredAt: Date;
    expiresAt: Date | null;
    lastChainBeat: Date | null;
    heartbeatCount: number;
  }) {
    const lastSeen = a.lastChainBeat;
    const reputation = this.computeReputation({
      registeredAt: a.registeredAt,
      heartbeatCount: a.heartbeatCount,
      lastSeen,
    });
    await this.db.query(
      `INSERT INTO agents (name, pda, owner, resolver, metadata_uri, registered_at, expires_at, last_chain_beat, last_seen, heartbeat_count, reputation, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE((SELECT last_seen FROM agents WHERE name=$1),$8),$9,$10, now())
       ON CONFLICT (name) DO UPDATE SET
         pda=EXCLUDED.pda, owner=EXCLUDED.owner, resolver=EXCLUDED.resolver,
         metadata_uri=EXCLUDED.metadata_uri, registered_at=EXCLUDED.registered_at,
         expires_at=EXCLUDED.expires_at, last_chain_beat=EXCLUDED.last_chain_beat,
         last_seen=GREATEST(agents.last_seen, EXCLUDED.last_chain_beat),
         heartbeat_count=GREATEST(agents.heartbeat_count, EXCLUDED.heartbeat_count),
         reputation=EXCLUDED.reputation, updated_at=now()`,
      [
        a.name, a.pda, a.owner, a.resolver, a.metadataUri,
        a.registeredAt, a.expiresAt, a.lastChainBeat, a.heartbeatCount, reputation,
      ],
    );
  }

  async touchPresence(name: string) {
    await this.db.query(
      `UPDATE agents SET last_seen = now(),
         reputation = LEAST(100, reputation + 1), updated_at = now()
       WHERE name = $1`,
      [name],
    );
  }

  async recordEvent(type: string, name: string, owner?: string, tx?: string, to?: string) {
    await this.db.query(
      `INSERT INTO events (type, name, owner, to_addr, tx) VALUES ($1,$2,$3,$4,$5)`,
      [type, name, owner || null, to || null, tx || null],
    );
  }

  async getOwner(name: string): Promise<string | null> {
    const r = await this.db.query(`SELECT owner FROM agents WHERE name=$1`, [name]);
    return r.rows[0]?.owner || null;
  }

  // ---- reads ----
  async availability(raw: string) {
    const name = normalizeName(raw);
    if (!isValidName(name)) return { name: raw, normalized: name, available: false, invalid: true };
    const r = await this.db.query(`SELECT 1 FROM agents WHERE name=$1`, [name]);
    return { name: raw, normalized: name, available: r.rowCount === 0 };
  }

  async explore(params: { q?: string; sort?: string; filter?: string; limit?: number }) {
    const limit = Math.min(Number(params.limit) || 60, 200);
    const where: string[] = [];
    const args: any[] = [];
    if (params.q) {
      args.push(`%${normalizeName(params.q)}%`);
      where.push(`name LIKE $${args.length}`);
    }
    if (params.filter === 'online') {
      args.push(CONFIG.onlineWindowMs);
      where.push(`last_seen > now() - ($${args.length} || ' milliseconds')::interval`);
    }
    const order =
      params.sort === 'recent'
        ? 'registered_at DESC NULLS LAST'
        : params.sort === 'active'
          ? 'last_seen DESC NULLS LAST'
          : 'reputation DESC, registered_at DESC';
    args.push(limit);
    const sql = `SELECT name, owner, category, reputation, last_seen
                 FROM agents ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                 ORDER BY ${order} LIMIT $${args.length}`;
    const r = await this.db.query(sql, args);
    const items = r.rows.map((row) => ({
      name: row.name,
      owner: row.owner,
      category: row.category,
      reputation: row.reputation,
      lastSeen: row.last_seen,
    }));
    return { items, total: items.length };
  }

  async getAgent(raw: string) {
    const name = normalizeName(raw);
    const r = await this.db.query(`SELECT * FROM agents WHERE name=$1`, [name]);
    const row = r.rows[0];
    if (!row) return null;

    let capabilities = row.capabilities || [];
    let category = row.category || null;
    let description = row.description || null;
    let links = row.links || null;
    // Lazily hydrate capabilities/category/links from the off-chain manifest.
    if ((!capabilities || !capabilities.length) && row.metadata_uri) {
      const manifest = await this.fetchManifest(row.metadata_uri);
      if (manifest) {
        capabilities = manifest.capabilities || [];
        category = manifest.category || category;
        description = manifest.description || description;
        links = {
