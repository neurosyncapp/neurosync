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
