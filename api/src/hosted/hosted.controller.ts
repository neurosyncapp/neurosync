import { Body, BadRequestException, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import { RegistryService } from '../registry/registry.service';
import { normalizeName } from '../common/name.util';

type HostedProfileBody = {
  owner?: string;
  timestamp?: number;
  signature?: number[];
  profile?: {
    description?: string;
    category?: string;
    capabilities?: string[];
    links?: {
      website?: string;
      twitter?: string;
      github?: string;
      endpoint?: string;
    };
  };
};

@Controller('hosted')
export class HostedController {
  constructor(private registry: RegistryService) {}

  @Get(':name.json')
  async manifest(@Param('name') raw: string) {
    const name = normalizeName(raw);
    const manifest = await this.registry.hostedManifest(name);
    if (!manifest) throw new NotFoundException('Hosted profile not found');
    return manifest;
  }

  @Post(':name')
  async save(@Param('name') raw: string, @Body() body: HostedProfileBody) {
    const name = normalizeName(raw);
    const owner = body?.owner || '';
    const timestamp = Number(body?.timestamp);
    const signature = body?.signature;
    const profile = sanitizeProfile(body?.profile || {});

    if (!name || !owner || !timestamp || !Array.isArray(signature)) {
      throw new BadRequestException('Missing fields');
    }
    const skew = Math.abs(Date.now() - timestamp);
    if (!Number.isFinite(skew) || skew > 120000) {
      throw new BadRequestException('Stale timestamp');
    }

    const dbOwner = await this.registry.getOwner(name);
    if (!dbOwner) throw new BadRequestException('Unknown handle');
    if (dbOwner !== owner) throw new BadRequestException('Owner mismatch');

    const message = profileMessage(name, timestamp, profile);
    let ok = false;
    try {
      ok = nacl.sign.detached.verify(
        new TextEncoder().encode(message),
        Uint8Array.from(signature),
        new PublicKey(owner).toBytes(),
      );
    } catch {
      ok = false;
    }
    if (!ok) throw new BadRequestException('Invalid signature');

    const saved = await this.registry.saveHostedProfile(name, profile);
    await this.registry.recordEvent('UPDATE', name, owner);
    return { ok: true, name, hostedUri: hostedUri(name), profile: saved };
  }
}

function sanitizeProfile(profile: HostedProfileBody['profile']) {
  const links = profile?.links || {};
  return {
    description: cleanText(profile?.description, 280),
    category: cleanText(profile?.category, 32),
    capabilities: (Array.isArray(profile?.capabilities) ? profile!.capabilities! : [])
      .map((item) => cleanText(item, 32))
      .filter(Boolean)
      .slice(0, 12),
    links: {
      website: cleanUrl(links.website),
      twitter: cleanUrl(links.twitter),
      github: cleanUrl(links.github),
      endpoint: cleanUrl(links.endpoint),
    },
  };
}

function cleanText(value: unknown, max: number) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}

function cleanUrl(value: unknown) {
  const raw = String(value || '').trim().slice(0, 240);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function profileMessage(name: string, timestamp: number, profile: ReturnType<typeof sanitizeProfile>) {
  return `neurosync:hosted-profile:${name}:${timestamp}:${JSON.stringify(profile)}`;
}

function hostedUri(name: string) {
  const baseUrl = process.env.PUBLIC_URL || 'https://neuro-sync.app';
  return `${baseUrl}/api/hosted/${encodeURIComponent(name)}.json`;
}
