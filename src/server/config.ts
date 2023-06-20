import { PrismaClient } from '@prisma/client';
import { Method } from 'method-node';
import throttledQueue from 'throttled-queue';

export const method = new Method({
  apiKey: `${process.env.METHOD_API_KEY}`,
  env: process.env.ENV as any,
});

export const prisma = new PrismaClient();

// Throttle requests to 590 per minute
export const throttle = throttledQueue(590, 60000);
