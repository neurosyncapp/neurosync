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
