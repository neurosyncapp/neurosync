import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // The edge proxy mounts this API under /api and strips the prefix, so routes
  // are declared at the root here.
  app.use((req, _res, next) => {
    // Allow large JSON-RPC bodies passing through the proxy.
    next();
  });
  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
