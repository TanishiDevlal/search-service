import { logs } from '@opentelemetry/api-logs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

const rawOtelEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
const otelEndpoint = rawOtelEndpoint.endsWith('/') ? rawOtelEndpoint.slice(0, -1) : rawOtelEndpoint;
const serviceName = process.env.OTEL_SERVICE_NAME || 'search-service';
const metricsEnabled = process.env.OTEL_METRICS_ENABLED !== 'false';
const bypassOtelLog = String(process.env.BY_PASS_LOG || '').toLowerCase() === 'true';

const resource = new Resource({
    'service.name': serviceName,
    'service.version': '1.0.0'
});

const traceExporter = new OTLPTraceExporter({
    url: `${otelEndpoint}/v1/traces`,
    timeoutMillis: 5000
});

const metricExporter = new OTLPMetricExporter({
    url: `${otelEndpoint}/v1/metrics`,
    timeoutMillis: 5000
});

let disableMetricExportAfterRefusedConnection = false;
let warnedMetricConnectionRefused = false;

function isConnectionUnavailable(result) {
    const error = result?.error;
    const errorCode = error?.code || error?.cause?.code;
    const errorMessage = String(error?.message || result?.message || '');

    return (
        errorCode === 'ECONNREFUSED' || errorMessage.includes('ECONNREFUSED') ||
        errorCode === 'ETIMEDOUT' || errorMessage.includes('ETIMEDOUT')
    );
}

const loggingMetricExporter = {
    export(resourceMetrics, resultCallback) {
        if (disableMetricExportAfterRefusedConnection) {
            resultCallback({ code: 0 });
            return;
        }

        metricExporter.export(resourceMetrics, (result) => {
            if (result?.code !== 0 && isConnectionUnavailable(result)) {
                disableMetricExportAfterRefusedConnection = true;

                if (!warnedMetricConnectionRefused) {
                    warnedMetricConnectionRefused = true;
                    console.warn(
                        `[otel-metrics] collector unavailable at ${otelEndpoint}/v1/metrics, metrics export disabled for this process`
                    );
                }

                resultCallback({ code: 0 });
                return;
            }

            if (result?.code !== 0) {
                console.error('[otel-metrics] export failed', result?.error || result);
            }

            resultCallback(result);
        });
    },
    forceFlush() {
        return metricExporter.forceFlush();
    },
    shutdown() {
        return metricExporter.shutdown();
    },
    selectAggregationTemporality(instrumentType) {
        return metricExporter.selectAggregationTemporality(instrumentType);
    },
    selectAggregation(instrumentType) {
        if (typeof metricExporter.selectAggregation === 'function') {
            return metricExporter.selectAggregation(instrumentType);
        }

        return undefined;
    }
};

const logExporter = new OTLPLogExporter({
    url: `${otelEndpoint}/v1/logs`
});

const loggerProvider = new LoggerProvider({
    resource,
    processors: [
        new BatchLogRecordProcessor({
            exporter: logExporter
        })
    ]
});
logs.setGlobalLoggerProvider(loggerProvider);

const sdk = new NodeSDK({
    resource,
    traceExporter,
    metricReader: metricsEnabled
        ? new PeriodicExportingMetricReader({
            exporter: loggingMetricExporter,
            exportIntervalMillis: 30000,
            exportTimeoutMillis: 5000
        })
        : undefined,
    instrumentations: [getNodeAutoInstrumentations()]
});

const logger = logs.getLogger('search-service-logger');
const telemetryConfig = {
    otelEndpoint,
    serviceName,
    metricsEnabled,
    bypassOtelLog
};

async function startTelemetry() {
    await Promise.resolve(sdk.start());
}

async function stopTelemetry() {
    await loggerProvider.forceFlush();
    await loggerProvider.shutdown();
    await sdk.shutdown();
}

export {
    bypassOtelLog,
    logger,
    telemetryConfig,
    startTelemetry,
    stopTelemetry
};
