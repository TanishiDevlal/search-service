// src/app.js
import express from 'express';
import cors from 'cors';
import { metrics, trace, SpanStatusCode } from '@opentelemetry/api';
import { SeverityNumber } from '@opentelemetry/api-logs';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { emitOtelLog } from './core/logger.js';
import { logger as otelLogger, bypassOtelLog } from './telemetry.js';
import { env } from './config/env.js';
import db from './modules/models/DbSetup.js';
import redis from './utils/redis.js';
import { SERVER_CONFIG } from './core/Constants.js';
import FleetRoute from './modules/routes/fleet.route.js';
import ResponseDto from './core/ResponseDto.js';

const app = express();
app.disable('x-powered-by');

function getPinoLevelName(level) {
    if (level >= 50) {
        return 'error';
    }

    if (level >= 40) {
        return 'warn';
    }

    if (level >= 30) {
        return 'info';
    }

    return 'debug';
}

const logger = pino({
    level: env.logging.level,
    hooks: {
        logMethod(args, method, level) {
            emitOtelLog(getPinoLevelName(level), args);
            return method.apply(this, args);
        }
    }
});

const tracer = trace.getTracer('search-service-tracer');

let requestCounter;
let requestDuration;
let metricsInitialized = false;

function initializeMetrics() {
    if (metricsInitialized) {
        return;
    }

    const meter = metrics.getMeter('search-service-meter');

    requestCounter = meter.createCounter('app_requests_total', {
        description: 'Total HTTP requests served by search-service'
    });

    requestDuration = meter.createHistogram('app_request_duration_ms', {
        description: 'Request duration in milliseconds'
    });

    metricsInitialized = true;
}

app.use(pinoHttp({
    logger,
    customLogLevel(req, res, err) {
        if (err || res.statusCode >= 500) {
            return 'error';
        }

        if (res.statusCode >= 400) {
            return 'warn';
        }

        return 'info';
    }
}));

app.use((req, res, next) => {
    const startedAt = Date.now();

    res.on('finish', () => {
        const responseTime = Date.now() - startedAt;
        const routePath = req.route?.path;
        const baseUrl = req.baseUrl || '';
        const route = routePath ? `${baseUrl}${routePath}` : 'unmatched';
        const metricLabels = {
            method: req.method,
            route,
            status_code: String(res.statusCode)
        };

        if (requestCounter && requestDuration) {
            requestCounter.add(1, metricLabels);
            requestDuration.record(responseTime, metricLabels);
        }

        let severityNumber = SeverityNumber.INFO;
        let severityText = 'INFO';

        if (res.statusCode >= 500) {
            severityNumber = SeverityNumber.ERROR;
            severityText = 'ERROR';
        } else if (res.statusCode >= 400) {
            severityNumber = SeverityNumber.WARN;
            severityText = 'WARN';
        }

        if (!bypassOtelLog) {
            otelLogger.emit({
                severityNumber,
                severityText,
                body: 'http request completed',
                attributes: {
                    method: req.method,
                    url: req.originalUrl,
                    route,
                    statusCode: res.statusCode,
                    responseTime
                }
            });
        }
    });

    next();
});

const corsConfig = {
    origin: SERVER_CONFIG.CORS_ORIGIN,
    credentials: false,
    optionsSuccessStatus: 200
};
app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', async (req, res) => {
    const result = {
        status: 'ok',
        database: 'disconnected',
        redis: 'disconnected',
        timestamp: new Date().toISOString()
    };

    try {
        await db.sequelize.authenticate();
        result.database = 'connected';
    } catch (error) {
        result.status = 'error';
        req.log?.error?.({ err: error.message }, 'Health check: database unreachable');
    }

    try {
        if (redis.isOpen) {
            await redis.ping();
            result.redis = 'connected';
        } else {
            result.status = 'error';
        }
    } catch (error) {
        result.status = 'error';
        req.log?.error?.({ err: error.message }, 'Health check: redis unreachable');
    }

    const httpStatus = result.status === 'ok' ? 200 : 503;
    res.status(httpStatus).json(result);
});

app.get('/health/live', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/health/ready', async (_req, res) => {
    try {
        await db.sequelize.authenticate();
        if (redis.isOpen) {
            await redis.ping();
            return res.status(200).json({ status: 'ready' });
        }
        return res.status(503).json({ status: 'not ready', reason: 'redis disconnected' });
    } catch (error) {
        return res.status(503).json({ status: 'not ready', reason: 'database unreachable' });
    }
});

app.use('/api/search/fleet', FleetRoute);

app.get('/', (req, res) => {
    tracer.startActiveSpan('GET /', (span) => {
        const payload = {
            message: 'search service is running with OpenTelemetry + Pino',
            timestamp: new Date().toISOString()
        };

        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/');

        req.log?.info?.(payload, 'served root endpoint');

        if (!bypassOtelLog) {
            otelLogger.emit({
                severityNumber: SeverityNumber.INFO,
                severityText: 'INFO',
                body: 'served root endpoint',
                attributes: { route: '/' }
            });
        }
        res.status(200).json(payload);
        span.end();
    });
});

app.get('/error', (req, res) => {
    tracer.startActiveSpan('GET /error', (span) => {
        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/error');
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Intentional test error' });

        req.log?.error?.('intentional error route called');
        if (!bypassOtelLog) {
            otelLogger.emit({
                severityNumber: SeverityNumber.ERROR,
                severityText: 'ERROR',
                body: 'intentional error route called',
                attributes: { route: '/error' }
            });
        }

        const error = new Error('Intentional test error');
        span.recordException(error);

        res.status(500).json({ message: 'Intentional test error' });
        span.end();
    });
});

app.get('/metrics', (_req, res) => {
    res.status(200).send('Metrics are exported via OTLP to OpenTelemetry Collector.');
});


app.use((_req, res) => {
    res.status(404).json(ResponseDto.error('Not Found', 404));
});

app.use((err, req, res, _next) => {
    if (req.log) {
        req.log.error({ err: err.message, stack: err.stack }, 'Unhandled error');
    } else {
        console.error(err.stack);
    }
    res.status(500).json(ResponseDto.error(
        'Internal Server Error',
        500,
        env.nodeEnv === 'development' ? { error: err.message } : null
    ));
});

export { initializeMetrics };
export default app;
