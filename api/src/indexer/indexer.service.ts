import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { CONFIG } from '../config';
import { DbService } from '../db/db.service';
import { RegistryService } from '../registry/registry.service';

const TAG_NAME = 2;

// Decoded on-chain name record. Layout must match program/src/state.rs.
function decodeNameRecord(data: Buffer) {
  if (data.length < 98 || data[0] !== TAG_NAME) return null;
  let o = 1;
  const owner = new PublicKey(data.subarray(o, o + 32)); o += 32;
  const resolver = new PublicKey(data.subarray(o, o + 32)); o += 32;
  const registeredAt = Number(data.readBigInt64LE(o)); o += 8;
  const expiresAt = Number(data.readBigInt64LE(o)); o += 8;
  const lastBeat = Number(data.readBigInt64LE(o)); o += 8;
  const heartbeatCount = Number(data.readBigUInt64LE(o)); o += 8;
  o += 1; // bump
  const labelLen = data.readUInt32LE(o); o += 4;
  const label = data.subarray(o, o + labelLen).toString('utf8'); o += labelLen;
  let metadataUri = '';
  if (o + 4 <= data.length) {
    const mLen = data.readUInt32LE(o); o += 4;
    metadataUri = data.subarray(o, o + mLen).toString('utf8');
  }
  return {
    owner: owner.toBase58(),
    resolver: resolver.toBase58(),
    registeredAt,
    expiresAt,
    lastBeat,
    heartbeatCount,
    label,
    metadataUri,
  };
}

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly log = new Logger('Indexer');
  private conn: Connection;
  private knownNames = new Set<string>();
  private beatCounts = new Map<string, number>();
  private running = false;

  constructor(private db: DbService, private registry: RegistryService) {}

  async onModuleInit() {
    if (!CONFIG.programId) {
      this.log.warn('PROGRAM_ID not set, running in pre-launch mode (no indexing).');
      return;
    }
    this.conn = new Connection(CONFIG.solanaRpc, 'confirmed');
    // Seed known-names so we do not emit REGISTER for pre-existing rows on boot.
    const existing = await this.db.query('SELECT name, heartbeat_count FROM agents');
    for (const r of existing.rows) {
      this.knownNames.add(r.name);
      this.beatCounts.set(r.name, Number(r.heartbeat_count || 0));
    }
    this.loop();
    this.log.log(`Indexing program ${CONFIG.programId} every ${CONFIG.indexIntervalMs}ms`);
  }

  private loop() {
    const tick = async () => {
      try {
        await this.indexOnce();
      } catch (e) {
        this.log.error(`index error: ${e.message}`);
      } finally {
        setTimeout(tick, CONFIG.indexIntervalMs);
      }
    };
    tick();
