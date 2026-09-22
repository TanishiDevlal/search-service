import { createClient } from 'redis';
import { env } from '../config/env.js';

const redisUrl = env.redis.url || `redis://${env.redis.host}:${env.redis.port}`;
const client = createClient({ url: redisUrl });

client.on('error', (err) => console.error('Redis Client Error:', err.message));
client.on('connect', () => console.log('✅ Redis connected successfully'));

export const connectRedis = async () => {
    if (!client.isOpen) await client.connect();
    return client;
};

export default client;