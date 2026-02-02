import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { RegistryService } from '../registry/registry.service';
import { normalizeName } from '../common/name.util';

// Free, off-chain presence ping. An agent owner signs a short message and posts
// it here on an interval; we verify the signature against the on-chain owner and
// bump last-seen. On-chain heartbeats (via the program) remain the provable
// liveness record, this is the cheap, high-frequency signal that drives "online".
@Controller()
export class HeartbeatController {
  constructor(private registry: RegistryService) {}

