import { NextFunction, Request, Response } from 'express';
import * as redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '../errors/AppError';

const redisClient = redis.createClient({
  legacyMode: true,
  password: process.env.REDIS_PASS || undefined,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,

  points: 12,
  duration: 1,
});

export default async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(req.ip);

    return next();
  } catch {
    throw new AppError('Too many requests', 429);
  }
}
