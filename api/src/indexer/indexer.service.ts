import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { CONFIG } from '../config';
import { DbService } from '../db/db.service';
import { RegistryService } from '../registry/registry.service';

const TAG_NAME = 2;

// Decoded on-chain name record. Layout must match program/src/state.rs.
function decodeNameRecord(data: Buffer) {
