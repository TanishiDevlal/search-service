import 'dotenv/config';

const validEnvironments = new Set(['development', 'test', 'production']);

function required(name) {
    const value = process.env[name];

    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value.trim();
}

function optional(name, fallback = undefined) {
    const value = process.env[name];
    return value && value.trim() ? value.trim() : fallback;
}

function integer(name, fallback, { min = 1 } = {}) {
    const value = optional(name);

    if (value === undefined) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);

    if (!Number.isInteger(parsed) || parsed < min) {
        throw new Error(`${name} must be an integer greater than or equal to ${min}`);
    }

    return parsed;
}

function boolean(name, fallback = false) {
    const value = optional(name);

    if (value === undefined) {
        return fallback;
    }

    if (value === 'true') return true;
    if (value === 'false') return false;

    throw new Error(`${name} must be either true or false`);
}

const nodeEnv = optional('NODE_ENV', 'development');

if (!validEnvironments.has(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
}

const logLevel = (nodeEnv === 'development' ? 'debug' : 'info');
const logTransport = (nodeEnv === 'production' ? 'otel' : 'console');
const dbHost = required('DB_HOST');
const dbSsl = nodeEnv === 'production' || (nodeEnv === 'development' && !['localhost', '127.0.0.1'].includes(dbHost));

const env = Object.freeze({
    nodeEnv,

    logging: {
        level: logLevel,
        transport: logTransport,
        consoleEnabled: logTransport === 'console'
    },

    database: {
        host: dbHost,
        port: integer('DB_PORT', 5432),
        name: required('DB_NAME'),
        user: required('DB_USER'),
        password: required('DB_PASSWORD'),
        schema: optional('SCHEMA', 'commerce'),
        ssl: dbSsl
    },

    redis: {
        url: optional('REDIS_URL', undefined),
        host: optional('REDIS_HOST', '127.0.0.1'),
        port: integer('REDIS_PORT', 6379),
        tls: boolean('REDIS_TLS', false)
    },

    config: {
        suggestedMachinesUrl: optional('SUGGESTED_MACHINES', 'https://appconfig.liftkaro.com/app-config/customer-config/machine-list-config.json'),
        serviceAvailableZonesUrl: optional('SERVICE_AVAILABLE_ZONES', 'https://appconfig.liftkaro.com/app-config/partner-config/service-available-zone.json')
    }
});

export { env };
