import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { RegistryService } from './registry.service';

@Controller()
export class RegistryController {
