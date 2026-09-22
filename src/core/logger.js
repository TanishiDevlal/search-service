import { SeverityNumber } from '@opentelemetry/api-logs';
import { logger as otelLogger, bypassOtelLog } from '../telemetry.js';
import { env } from '../config/env.js';

const originalConsole = { ...console };
const isProduction = env.nodeEnv === 'production';

const severityByLevel = {
    info: SeverityNumber.INFO,
    warn: SeverityNumber.WARN,
    error: SeverityNumber.ERROR,
    debug: SeverityNumber.DEBUG
};

function safeStringify(value) {
    const seen = new WeakSet();

    return JSON.stringify(value, (key, currentValue) => {
        if (typeof currentValue === 'bigint') {
            return currentValue.toString();
        }

        if (typeof currentValue === 'object' && currentValue !== null) {
            if (seen.has(currentValue)) {
                return '[Circular]';
            }

            seen.add(currentValue);
        }

        return currentValue;
    });
}

function compactMetadata(metadata) {
    if (!metadata || typeof metadata !== 'object') {
        return metadata;
    }

    const hasReqOrRes = Object.hasOwn(metadata, 'req') || Object.hasOwn(metadata, 'res');
    if (!hasReqOrRes) {
        return metadata;
    }

    const req = metadata.req;
    const res = metadata.res;

    return {
        reqId: req?.id,
        method: req?.method,
        url: req?.url || req?.originalUrl,
        statusCode: res?.statusCode,
        responseTime: metadata.responseTime,
        route: req?.route?.path,
        baseUrl: req?.baseUrl,
        remoteAddress: req?.remoteAddress,
        userAgent: req?.headers?.['user-agent']
    };
}

function serialize(value) {
    if (value instanceof Error) {
        return value.stack || value.message;
    }

    if (typeof value === 'object' && value !== null) {
        return safeStringify(value);
    }

    return String(value);
}

function emit(level, severityNumber, args) {
    const [firstArg, secondArg, ...restArgs] = args;
    const metadata = typeof firstArg === 'object' && firstArg !== null && !(firstArg instanceof Error)
        ? firstArg
        : undefined;
    const normalizedMetadata = compactMetadata(metadata);
    const messageParts = metadata ? [secondArg, ...restArgs] : [firstArg, secondArg, ...restArgs];
    const body = messageParts.filter((value) => value !== undefined).map(serialize).join(' ');

    if (!bypassOtelLog) {
        otelLogger.emit({
            severityNumber,
            severityText: level.toUpperCase(),
            body,
            attributes: {
                service: 'search-service',
                environment: env.nodeEnv,
                ...(normalizedMetadata ? { metadata: safeStringify(normalizedMetadata) } : {})
            }
        });
    }

    if (!isProduction && env.logging.consoleEnabled) {
        originalConsole[level](
            ...(normalizedMetadata ? [normalizedMetadata, body] : [body])
        );
    }
}

function emitOtelLog(level, args) {
    const severityNumber = severityByLevel[level] || SeverityNumber.INFO;
    emit(level === 'log' ? 'info' : level, severityNumber, args);
}

const logger = {
    info: (...args) => emit('info', SeverityNumber.INFO, args),
    warn: (...args) => emit('warn', SeverityNumber.WARN, args),
    error: (...args) => emit('error', SeverityNumber.ERROR, args),
    debug: (...args) => emit('debug', SeverityNumber.DEBUG, args)
};

const formatError = (error) => {
    if (error instanceof Error) {
        return error.stack || error.message;
    }
    return String(error);
};

global.console = {
    ...originalConsole,
    error: (...args) => {
        const messages = args.map(arg => {
            if (arg instanceof Error) {
                return arg.stack || `[${arg.name}] ${arg.message}`;
            }
            return String(arg);
        });

        // Join all messages with double newlines to match the example format
        const message = messages.join('\n\n');
        logger.error(message);
    },
    log: isProduction ? () => {} : (...args) => originalConsole.log(...args),
    info: (...args) => {
        const message = args.map(arg =>
            arg instanceof Error ? formatError(arg) : String(arg)
        ).join(' ');
        logger.info(message);
    },
    warn: (...args) => {
        const messages = args.map(arg => {
            if (arg instanceof Error) {
                return arg.stack || `[${arg.name}] ${arg.message}`;
            }
            return String(arg);
        });

        // Join all messages with double newlines to match the example format
        const message = messages.join('\n\n');
        logger.warn(message);
    },
    debug: (...args) => {
        const message = args.map(arg =>
            arg instanceof Error ? formatError(arg) : String(arg)
        ).join(' ');
        logger.debug(message);
    }
};

export { emitOtelLog };
export default logger;
