import redis from './redis.js';
import logger from '../core/logger.js';

export async function getOrSetCache(key, ttlSeconds, fetchFunction) {
    try {
        const cached = await redis.get(key);

        if (cached !== null) {
            logger.debug({ key }, 'Cache HIT');
            return JSON.parse(cached);
        }

        logger.debug({ key }, 'Cache MISS');
    } catch (err) {
        logger.warn({ err: err.message, key }, 'Redis read failed — falling back to DB');
    }

    // fetch from db, when Redis MISS or Redis Error
    const data = await fetchFunction();

    if (data !== undefined && data !== null) {
        try {
            const jitter = Math.floor(Math.random() * (ttlSeconds * 0.1));
            const finalTtl = ttlSeconds + jitter;

            await redis.set(key, JSON.stringify(data), { EX: finalTtl });
            logger.debug({ key, ttl: finalTtl }, 'Cache SET');
        } catch (err) {
            logger.warn({ err: err.message, key }, 'Redis write failed — data served from DB');
        }
    }

    return data;
}