import 'dotenv/config';
import logger from './src/core/logger.js';
import { startTelemetry, stopTelemetry, telemetryConfig } from './src/telemetry.js';

const PORT = process.env.PORT || 3000;
let server;

async function bootstrap() {
  await startTelemetry();
  logger.info({
    serviceName: telemetryConfig.serviceName,
    otelEndpoint: telemetryConfig.otelEndpoint
  }, 'OpenTelemetry connected to search-service bootstrap');

  const { default: app, initializeMetrics } = await import('./src/app.js');

  initializeMetrics();
  const db = (await import('./src/modules/models/DbSetup.js')).default;
  await db.sequelize.authenticate();
  logger.info({
    host: db.sequelize.config.host,
    database: db.sequelize.config.database
  }, 'PostgreSQL connected (read-only on commerce schema)');

  try {
    const redis = (await import('./src/utils/redis.js')).default;
    if (!redis.isOpen) await redis.connect();
    logger.info('Redis connected');
  } catch (err) {
    logger.warn({ err: err.message }, '⚠️ Redis connection failed on startup, running in degraded DB-fallback mode');
  }

  server = app.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' },
      `🚀 search-service running at http://localhost:${PORT}`);
  });
}

async function shutdown(signal) {
  logger.info({ signal }, 'Graceful shutdown initiated');

  if (server) {
    server.close(() => logger.info('HTTP server closed'));
  }

  try {
    const redis = (await import('./src/utils/redis.js')).default;
    if (redis.isOpen) await redis.quit();
    logger.info('Redis disconnected');
  } catch (err) {
    logger.warn({ err: err.message }, 'Redis disconnect error (non-fatal)');
  }

  try {
    const { sequelize } = await import('./src/config/database.js');
    await sequelize.close();
    logger.info('Sequelize connection pool closed');
  } catch (err) {
    logger.warn({ err: err.message }, 'Sequelize close error (non-fatal)');
  }

  await stopTelemetry();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

try {
  await bootstrap();
} catch (error) {
  logger.error({ error }, 'Failed to start search-service');
  await stopTelemetry();
  process.exit(1);
}