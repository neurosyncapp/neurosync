import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CONFIG } from '../config';
import { RegistryService } from '../registry/registry.service';
import { normalizeName } from '../common/name.util';

@Controller('share')
export class ShareController {
  constructor(private registry: RegistryService) {}

  @Get('agent/:name')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async agent(@Param('name') raw: string, @Res() res: Response) {
    const name = normalizeName(raw);
    const agent = await this.registry.getAgent(name);
    const baseUrl = process.env.PUBLIC_URL || 'https://neuro-sync.app';
    const suffix = CONFIG.suffix;
    const handle = `${name}${suffix}`;
    const url = `${baseUrl}/agent/${encodeURIComponent(name)}`;
    const image = `${baseUrl}/banner.jpg`;

    if (!agent) {
      return res.send(renderShareHtml({
        title: `${handle} is available on NeuroSync`,
        description: `Claim ${handle}, an on-chain identity for AI agents on Solana.`,
        url,
        image,
      }));
    }

    const category = agent.category || 'agent';
    const online = isFresh(agent.lastSeen) ? 'online' : 'offline';
    const owner = shorten(agent.owner);
    const capabilities = Array.isArray(agent.capabilities) && agent.capabilities.length
      ? ` Capabilities: ${agent.capabilities.slice(0, 4).join(', ')}.`
      : '';
    const title = `${handle} | ${category} agent on NeuroSync`;
    const description = `${handle} is ${online}. Owner ${owner}. Reputation ${agent.reputation ?? 0}.${capabilities}`;

    return res.send(renderShareHtml({ title, description, url, image }));
  }
}

function renderShareHtml(opts: { title: string; description: string; url: string; image: string }) {
  const title = escapeHtml(opts.title);
  const description = escapeHtml(opts.description);
  const url = escapeHtml(opts.url);
  const image = escapeHtml(opts.image);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content="NeuroSync" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@neurosyncapp" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
  <a href="${url}">${title}</a>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char] || char));
}

function shorten(value: string) {
  if (!value || value.length <= 12) return value || 'unknown';
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function isFresh(value?: string | null) {
  if (!value) return false;
  return Date.now() - new Date(value).getTime() < CONFIG.onlineWindowMs;
}
