import { Module } from '@nestjs/common';
import { DbService } from './db/db.service';
import { RegistryService } from './registry/registry.service';
import { RegistryController } from './registry/registry.controller';
import { ConfigController } from './config/config.controller';
import { RpcController } from './rpc/rpc.controller';
import { HeartbeatController } from './heartbeat/heartbeat.controller';
import { IndexerService } from './indexer/indexer.service';

@Module({
  controllers: [ConfigController, RegistryController, RpcController, HeartbeatController],
  providers: [DbService, RegistryService, IndexerService],
})
export class AppModule {}
