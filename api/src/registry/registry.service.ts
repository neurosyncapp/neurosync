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
