import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { CONFIG } from '../config';

// JSON-RPC passthrough. The browser talks to /api/rpc so the upstream RPC URL
// (which carries the API key) never reaches the client.
