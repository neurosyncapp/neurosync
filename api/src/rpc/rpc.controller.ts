import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { CONFIG } from '../config';

// JSON-RPC passthrough. The browser talks to /api/rpc so the upstream RPC URL
// (which carries the API key) never reaches the client.
@Controller()
export class RpcController {
  @Post('rpc')
  async proxy(@Body() body: any) {
    try {
      const res = await fetch(CONFIG.solanaRpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (e) {
      throw new HttpException('RPC upstream error', 502);
    }
  }
}
