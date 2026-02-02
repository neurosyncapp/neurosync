import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { RegistryService } from '../registry/registry.service';
