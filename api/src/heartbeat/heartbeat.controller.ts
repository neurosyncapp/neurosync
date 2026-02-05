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

  @Post('heartbeat')
  async heartbeat(@Body() body: { name?: string; owner?: string; timestamp?: number; signature?: string }) {
    const name = normalizeName(body?.name || '');
    const { owner, timestamp, signature } = body || {};
    if (!name || !owner || !timestamp || !signature) {
      throw new BadRequestException('Missing fields');
    }

    // Reject stale / future timestamps (replay protection, 2-minute window).
    const skew = Math.abs(Date.now() - Number(timestamp));
    if (!Number.isFinite(skew) || skew > 120000) {
      throw new BadRequestException('Stale timestamp');
    }

    const dbOwner = await this.registry.getOwner(name);
    if (!dbOwner) throw new BadRequestException('Unknown handle');
    if (dbOwner !== owner) throw new BadRequestException('Owner mismatch');

    const message = `neurosync:heartbeat:${name}:${timestamp}`;
    let ok = false;
    try {
      ok = nacl.sign.detached.verify(
        new TextEncoder().encode(message),
        bs58.decode(signature),
        new PublicKey(owner).toBytes(),
