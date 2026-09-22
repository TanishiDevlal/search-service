# 🔎 Engineering Handbook & Build Log: `search-service`

**Machine & Fleet Discovery Microservice — Architecture, 3-Day Build Sprint, Redis Caching, and Handoff Guide**

> **Status:** Approved Sprint Specification — Fast-track 3-Day Rollout.  
> **Author:** Tanishi Devlal (Implementer)  
> **Reviewer:** Shashank Chaurasia (Principal Architect)  
> **Source Service:** `booking-service` (Offloading Search & Discovery Load)  
> **Target Schema:** `commerce` (Shared single source of truth — read-only)

---

## 📖 How to Use This Document

This handbook is the **definitive operational guide and 3-day tactical implementation plan** for building and stabilizing `search-service`. 

1. **Read §0 (Preface) & §1 (Architecture):** Understand the read-only mandate, the direct connection to the `commerce` schema, the deliberate omission of geofences, and the 1:1 response parity with `booking-service`.
2. **Follow §2 (The 3-Day Sprint Plan):** Complete the deliverables day-by-day. Each day has a morning target, afternoon build, evening smoke test, and an update template.
3. **Reference §1.7 & §1.4:** Use the exact Redis cache-aside patterns and folder layout to transform the current rough codebase into a production-grade service.

---

# 📌 0. Preface: Core Constraints & Objectives

## 0.1 What You Are Building

Currently, customer and internal traffic looking for machinery and fleet categories (e.g. Backhoe Loaders, Cranes, Tractors, dimensions, and specifications) lands on `booking-service`. `booking-service` already handles critical business writes: transactions, trips, orders, driver assignment, payments, and cancellations.

`search-service` is carved out to:
> **Take the search, machine catalog, and category browsing query load entirely off `booking-service`, backed by Redis caching for high-speed repeated retrieval.**

## 0.2 Architectural Decisions & Updates

| Decision | Selection | Rationale |
|---|---|---|
| **Database Schema** | **`commerce` (Direct read)** | Queries the existing `commerce` schema directly. No duplicate database, no secondary schema migrations, and zero sync drift. |
| **Geofencing** | **Excluded (Not in Scope)** | The service's sole purpose is machine/fleet discovery and catalog lookup. Geofencing pricing/polygon logic remains in booking/pricing workflows. |
| **API Contract & Response** | **100% Parity with `booking-service`** | Must use the same `ResponseDto` structure (`{ data, message, status, timestamp }`) and identical payload shapes so mobile and web clients switch seamlessly. |
| **Redis Caching** | **First-class Cache-Aside** | Cache searched fleets, machine categories, and machine details. Subsequent requests serve directly from memory in < 5ms. |
| **Delivery Timeline** | **3-Day Sprint** | Cut out all non-essential features (e.g., event buses, projections, geofence polygons, booking flows) to ship a robust, production-ready search microservice in 72 hours. |

## 0.3 The Core Invariant

> ### 🚫 `search-service` Never Writes Business Data.
>
> It does not create bookings, modify machine statuses, alter fleet masters, or update database schemas.
> **It only reads from `commerce` and writes to its own Redis cache.**
> Under no circumstances should `sequelize.sync({ alter: true })` or table-altering scripts run here.

---

# 1. 🏗 System Architecture & Design

## 1.1 High-Level Flow

```
                     ┌─────────────────────────────────────────┐
                     │           Client Applications           │
                     │         (Customer App, Nucleus)         │
                     └────────────────────┬────────────────────┘
                                          │ HTTPS / REST
                     ┌────────────────────▼────────────────────┐
                     │               API Gateway               │
                     │  /api/fleet/* (Search/Browse) -> Search │
                     │  /api/book/*  (Orders/Writes) -> Booking│
                     └──────────┬───────────────────┬──────────┘
                                │                   │
                 GET /api/fleet/*                   POST /api/book/*
                 GET /api/fleet/getFleets           POST /api/trip/*
                 GET /api/fleet/get-machine-detail  ...
                                │                   │
                 ┌──────────────▼───────────┐ ┌─────▼───────────────┐
                 │      search-service      │ │   booking-service   │
                 │   (Read-Only Search API) │ │ (Writes & Bookings) │
                 └───────┬──────────────┬───┘ └──────────┬──────────┘
                         │              │                │
            Cache-Aside  │              │ Read Only      │ Read / Write
            (Get/Set)    │              │ Queries        │ Transactions
                         ▼              ▼                ▼
                 ┌──────────────┐ ┌─────────────────────────────────┐
                 │    Redis     │ │       PostgreSQL Database       │
                 │ (In-Memory)  │ │        `commerce` schema        │
                 │  Search &    │ │ • fleet       • category        │
                 │  Detail Cache│ │ • machine     • price           │
                 └──────────────┘ └─────────────────────────────────┘
```

## 1.2 Technology Stack

Inherits the battle-tested libraries from `booking-service` for zero operational overhead:

| Layer | Choice | Details |
|---|---|---|
| **Runtime** | Node.js (ESM `"type": "module"`) | Matches `booking-service` module resolution and modern syntax. |
| **HTTP Framework** | Express `^5.x` | Native async error handling without unhandled promise crashes. |
| **Database ORM** | Sequelize `^6.x` + `pg` | Points to schema `'commerce'`. `sync` disabled. Read-only usage. |
| **In-Memory Cache** | Redis `^4.x` / `^6.x` (`redis` package) | Dedicated key-value caching with TTLs and graceful fallback. |
| **Logging** | Pino + `pino-http` + OpenTelemetry | Structured JSON logs carrying request IDs and OTel trace context. |
| **Envelope & Utility** | `ResponseDto` & `BaseController` | Direct copy from `booking-service` for exact response parity. |

## 1.3 Database Integration: Direct `commerce` Read

Instead of maintaining a separate search database with complex event projections:
1. `search-service` connects directly to the existing PostgreSQL database.
2. Uses the `commerce` schema (`process.env.SCHEMA || 'commerce'`).
3. Only initializes models essential for search:
   - `FleetModel` (`commerce.fleet`)
   - `MachineModel` (`commerce.machine`)
   - `CategoryModel` (`commerce.category`)
   - `PriceModel` (`commerce.price`)
4. **No Schema Mutations:** `search-service` never runs migrations, DDL statements, or `sequelize.sync({ alter: true })`.

---

## 1.4 Clean Service Structure

The initial codebase contained leftover booking artifacts (`TripRoute`, `BookingRoute`, `EventBridgeUtils`, etc.). Clean those out to reflect this lean, focused layout:

```
search-service/
├── src/
│   ├── app.js                         # Express setup, middleware pipeline, search routes
│   ├── server.js                      # HTTP server startup & graceful shutdown
│   ├── telemetry.js                   # OpenTelemetry initialization
│   │
│   ├── config/
│   │   ├── env.js                     # Validated environment config (DB, Redis, Port)
│   │   ├── database.js                # Sequelize connection (schema: 'commerce', no sync)
│   │   └── server-config.js           # Shared app settings
│   │
│   ├── core/
│   │   ├── ApiMessage.js              # Response message constants matching booking-service
│   │   ├── Constants.js               # HTTP status codes & system constants
│   │   ├── ResponseDto.js             # Standard envelope: { data, message, status, timestamp }
│   │   ├── logger.js                  # Pino structured logging + OTel exporter
│   │   └── base/
│   │       └── BaseController.js      # Controller base providing sendResponse & handleError
│   │
│   ├── modules/
│   │   ├── controllers/
│   │   │   └── fleet.controller.js    # Search HTTP endpoints (fleets, dimensions, details)
│   │   ├── dtos/
│   │   │   ├── SearchModelFleet.js    # Search payload structures
│   │   │   ├── DimensionPriceDto.js   # Machine dimension & price mapping
│   │   │   └── PaginationDto.js       # Pagination format
│   │   ├── models/
│   │   │   ├── DbSetup.js             # Sequelize initialization for search models ONLY
│   │   │   ├── AbstractModel.js       # Base model with timestamps/hooks
│   │   │   ├── FleetModel.js          # commerce.fleet mapping
│   │   │   ├── MachineModel.js        # commerce.machine mapping
│   │   │   ├── CategoryModel.js       # commerce.category mapping
│   │   │   └── PriceModel.js          # commerce.price mapping
│   │   ├── repository/
│   │   │   └── fleetSearch.repo.js    # Direct queries against commerce tables
│   │   ├── routes/
│   │   │   └── fleet.route.js         # /api/fleet route definitions
│   │   └── service/
│   │       └── fleet.service.js       # Search business logic & Redis cache orchestration
│   │
│   └── utils/
│       ├── redis.js                   # Redis client connection & lifecycle
│       ├── cacheUtil.js               # Cache-aside helper (getOrSet with TTL)
│       ├── snowflake.js               # ID generation (if needed)
│       └── Utils.js                   # Shared utility helpers
│
├── .env.example                       # Documented environment variables
├── package.json
└── README.md
```

---

## 1.5 Middleware & Request Lifecycle

Middleware runs in strict order to guarantee tracing, logging, and error capture:

```js
// Execution Order in src/app.js:
1. app.disable('x-powered-by');
2. Pino HTTP Logger (attaches req.log, injects trace IDs)
3. Request Timer & OTel Request Metrics
4. CORS Configuration
5. express.json() & express.urlencoded()
6. Health Endpoints: GET /health, GET /health/live, GET /health/ready
7. Search API Routes: app.use('/api/fleet', FleetRoute)
8. 404 Fallback Handler
9. Global Error Handling Middleware: (err, req, res, next) -> ResponseDto.error()
```

---

## 1.6 Target API Surface & Response Parity

All endpoints must be mounted under `/api/fleet` to maintain 100% parity with `booking-service`:

| Method | Route | Description | Redis Cached |
|---|---|---|---|
| `GET` | `/api/fleet/getFleets` | Fetch all active machine fleet types & categories | ✅ Yes (TTL: 1 hour) |
| `GET` | `/api/fleet/get/all/dimensions` | Paginated list of machine dimensions/categories | ✅ Yes (TTL: 30 mins) |
| `GET` | `/api/fleet/get-machine-detail/:id` | Full machine specifications and category info | ✅ Yes (TTL: 15 mins) |
| `GET` | `/api/fleet/v1/get-machine-detail/:id` | Detailed machine specifications + dimension arrays | ✅ Yes (TTL: 15 mins) |
| `GET` | `/api/fleet/get/dimension/price/:id` | Machine dimension details with base prices | ✅ Yes (TTL: 10 mins) |
| `POST` | `/api/fleet/createSeachModel` | Search query endpoint with filters | ✅ Yes (TTL: 5 mins) |
| `GET` | `/health` | Liveness & database/redis connectivity check | ❌ No |

### Standard Response Envelope

The response format must match `ResponseDto` from `booking-service`:

```json
{
  "status": 200,
  "message": "Fleet details fetched successfully",
  "data": [
    {
      "uuid": "FLT-982341",
      "machineType": "Crane",
      "category": "Hydraulic Crane",
      "machineCategory": "Heavy Lifting",
      "imageUrl": "https://assets.liftkaro.com/machines/crane-14t.png"
    }
  ],
  "timestamp": "2026-09-21T11:00:00.000Z"
}
```

---

## 1.7 Redis Caching Architecture

### Why Redis in `search-service`
Search queries are read-intensive and repetitive. Multiple users browsing the same category or clicking the same machine details should not trigger repeated database roundtrips.

### Cache Keys & Invalidation Rules

```js
// src/utils/cacheKeys.js
export const CacheKeys = {
  ALL_FLEETS: 'search:fleet:all',
  DIMENSIONS: (page, size) => `search:dimensions:p${page}:s${size}`,
  MACHINE_DETAIL: (uuid) => `search:machine:detail:${uuid}`,
  MACHINE_DETAIL_V1: (uuid) => `search:machine:detail:v1:${uuid}`,
  DIMENSION_PRICE: (uuid) => `search:dimension:price:${uuid}`,
  SEARCH_QUERY: (hash) => `search:query:${hash}`,
};
```

### Resilient Cache-Aside Implementation

Redis is an **acceleration layer, not a hard point of failure**. If Redis disconnects or fails, queries must fall back to the PostgreSQL database smoothly.

```javascript
// src/utils/cacheUtil.js
import redis from './redis.js';
import pino from 'pino';

const logger = pino();

export async function getOrSetCache(key, ttlSeconds, fetchFunction) {
    try {
        const cached = await redis.get(key);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (err) {
        logger.warn({ err: err.message, key }, 'Redis read error - falling back to DB');
    }

    // Cache miss or Redis error -> fetch from DB
    const data = await fetchFunction();

    if (data !== undefined && data !== null) {
        try {
            await redis.set(key, JSON.stringify(data), { EX: ttlSeconds });
        } catch (err) {
            logger.warn({ err: err.message, key }, 'Redis write error');
        }
    }

    return data;
}
```

---

# 2. ⏳ Accelerated 3-Day Implementation Plan

A day-by-day roadmap to transform the rough starting codebase into a battle-tested service.

```
┌────────────────────────────────────────────────────────────────────────┐
│ DAY 1: Foundation & Cleanup                                            │
│  - Strip out booking routes/schedulers/dependencies from app.js        │
│  - Configure env.js with DB & Redis params                             │
│  - Wire Sequelize DbSetup.js with only 4 models on schema 'commerce'   │
│  - Verify /health connects to Postgres & Redis cleanly                 │
├────────────────────────────────────────────────────────────────────────┤
│ DAY 2: Core Search Endpoints & Response Parity                         │
│  - Build fleetSearch.repo.js (read-only queries on commerce)           │
│  - Implement fleet.service.js & fleet.controller.js                    │
│  - Mount /api/fleet/* routes matching booking-service 1:1              │
│  - Test all endpoints with Postman/curl against booking-service output │
├────────────────────────────────────────────────────────────────────────┤
│ DAY 3: Redis Integration, Polish & Load Cutover                        │
│  - Integrate getOrSetCache into all fleet service methods              │
│  - Verify cache hits (< 5ms response) and graceful fallback            │
│  - Multi-stage Dockerfile and dev deployment                           │
│  - Final smoke test, diff check, and readiness sign-off                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 DAY 1: Service Cleanup, Commerce DB & Foundation

**Target:** Eliminate all booking deadwood, establish a clean Express 5 + Pino pipeline, and verify live database and Redis connectivity.

### Morning (09:00 - 13:00) — Codebase Sanitization
1. **Purge Unneeded Booking Files:**
   - Remove unused routes: `booking.route.js`, `Trip.route.js`, `offer.route.js`, `settings.route.js`, `webhook.route.js`.
   - Remove background schedulers: `LocalScheduler.js`, `EventBridgeUtils.js`, `NotificationSettings.js`.
   - Remove write-heavy models: `OrderModel`, `TripModel`, `CommissionModel`, `CancellationModel`, etc.
2. **Standardize `package.json`:**
   - Install required dependencies: `express@^5.0.0`, `sequelize@^6.37.0`, `pg@^8.11.0`, `pg-hstore`, `redis@^4.6.0`, `dotenv`, `pino`, `pino-http`, `cors`.
   - Add `"type": "module"` and scripts (`"start": "node server.js"`, `"dev": "node --watch server.js"`).

### Afternoon (14:00 - 18:00) — Config & Database Setup
1. **Configure `src/config/env.js`:**
   - Validate `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `SCHEMA` (default: `commerce`).
   - Add Redis settings: `REDIS_HOST`, `REDIS_PORT`, `REDIS_URL`.
2. **Implement `src/modules/models/DbSetup.js`:**
   - Initialize Sequelize pointing directly to `commerce`.
   - Register only: `FleetModel`, `MachineModel`, `CategoryModel`, `PriceModel`.
   - **Ensure `sync` is disabled** (`sequelize.sync` should NEVER run).
3. **Connect Redis (`src/utils/redis.js`):**
   - Connect using `createClient` with error listeners that log rather than crash.

### Evening (18:00 - 20:00) — Health Checks & Server Bootstrap
1. **Clean `src/app.js` & `server.js`:**
   - Mount Pino HTTP logger and request context.
   - Implement `GET /health` checking both PostgreSQL (`sequelize.authenticate()`) and Redis (`redis.ping()`).
   - Add graceful shutdown on `SIGINT` and `SIGTERM`.
2. **Day 1 Verification:**
   - Run `npm run dev`.
   - `curl http://localhost:3000/health` returns `{"status":"ok","database":"connected","redis":"connected"}`.

### 📨 Standup Update: End of Day 1
```
Day 1 Done — search-service sanitized & connected 🎯
• Stripped out 15+ booking-service files, routes, and schedulers.
• Configured validated env (DB + Redis) with fail-fast boot.
• Sequelize connected directly to schema 'commerce' (sync permanently disabled).
• Initialized only the 4 search models (Fleet, Machine, Category, Price).
• Redis client connected with non-crashing error fallback.
• GET /health verified returning 200 with DB + Redis connected.
Tomorrow (Day 2): Implement all /api/fleet search & detail endpoints with 100% response parity.
```

---

## 📅 DAY 2: Core Search APIs & 100% Response Parity

**Target:** Implement the complete fleet, category, and machine detail reading flow. Match the exact response structure of `booking-service`.

### Morning (09:00 - 13:00) — Repository Layer (`commerce` queries)
1. **Implement `src/modules/repository/fleetSearch.repo.js`:**
   - `getFleets()`: Queries `FleetModel.findAll({ attributes: ['uuid', 'machineType', 'category', 'machineCategory', 'imageUrl'] })`.
   - `getDimensions(page, size)`: Queries `MachineModel.findAndCountAll` with offset/limit, mapped into `PaginationDto`.
   - `getMachineTypeDetail(uuid)`: Fetches machine and joins with `CategoryModel` on `machineCategoryId`.
   - `getMachineTypeDetailv1(uuid)`: Fetches category and attaches associated dimension list.
   - `getDimensionPrice(uuid)`: Queries `PriceModel.findAll` for active prices for the machine.

### Afternoon (14:00 - 18:00) — Service & Controller Layer
1. **Implement `src/modules/service/fleet.service.js`:**
   - Wraps repo calls and prepares DTO responses.
   - Handles `getMachineDetail`, `getMachineDetailv1`, `getFleets`, `getDimensions`, and `getDimensionPrice`.
2. **Implement `src/modules/controllers/fleet.controller.js`:**
   - Extends `BaseController`.
   - Uses `this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.FETCHED, data)`.
   - Handles errors using `this.handleError(res, error)`.
3. **Mount Routes in `src/modules/routes/fleet.route.js`:**
   - Match all routes called by clients:
     - `GET /api/fleet/getFleets`
     - `GET /api/fleet/get/all/dimensions`
     - `GET /api/fleet/get-machine-detail/:id`
     - `GET /api/fleet/v1/get-machine-detail/:id`
     - `GET /api/fleet/get/dimension/price/:id`

### Evening (18:00 - 20:00) — Parity Testing against `booking-service`
1. **Dual-Testing:**
   - Execute the same request on `booking-service` (port 3000) and `search-service` (port 3001).
   - Compare output payloads for `/api/fleet/getFleets` and `/api/fleet/get-machine-detail/<id>`.
2. **Verify Envelope:** Confirm keys `status`, `message`, `data`, and `timestamp` match exactly.

### 📨 Standup Update: End of Day 2
```
Day 2 Done — Core Search Endpoints Live with 100% Parity 🔍
• Built fleetSearch.repo.js with direct SELECT queries on commerce tables.
• Completed fleet.service.js and fleet.controller.js using BaseController.
• Implemented 5 key routes under /api/fleet/:
  - GET /api/fleet/getFleets
  - GET /api/fleet/get/all/dimensions
  - GET /api/fleet/get-machine-detail/:id
  - GET /api/fleet/v1/get-machine-detail/:id
  - GET /api/fleet/get/dimension/price/:id
• Verified 100% response parity against booking-service using identical ResponseDto envelope.
Tomorrow (Day 3): Wire in Redis caching layer, verify fallback, containerize, and cutover.
```

---

## 📅 DAY 3: Redis Integration, Resilience, Docker & Cutover

**Target:** Accelerate searches with Redis cache-aside, verify fault tolerance, containerize, and prepare gateway routing.

### Morning (09:00 - 13:00) — Redis Cache-Aside Integration
1. **Implement `src/utils/cacheUtil.js`:**
   - Build `getOrSetCache(key, ttlSeconds, fetcherFn)`.
2. **Inject Caching into `FleetService`:**
   - `getFleets()`: Cached under `search:fleet:all` (TTL: 3600s / 1 hour).
   - `getDimensions(page, size)`: Cached under `search:dimensions:p{page}:s{size}` (TTL: 1800s / 30 mins).
   - `getMachineDetail(id)`: Cached under `search:machine:detail:{id}` (TTL: 900s / 15 mins).
   - `getMachineDetailv1(id)`: Cached under `search:machine:detail:v1:{id}` (TTL: 900s / 15 mins).
   - `getDimensionPrice(id)`: Cached under `search:dimension:price:{id}` (TTL: 600s / 10 mins).

### Afternoon (14:00 - 17:00) — Resilience & Failure Testing
1. **Performance Verification:**
   - Request 1 (Cache Miss): Fetched from Postgres in ~40-80ms.
   - Request 2 (Cache Hit): Fetched from Redis in ~2-4ms.
2. **Chaos / Fallback Test:**
   - Temporarily stop Redis (`docker stop redis` or disconnect).
   - Send requests: service logs a warning and fetches cleanly from DB without returning a 500 error.
   - Restart Redis: service automatically reconnects.

### Evening (17:00 - 20:00) — Dockerization & Handoff
1. **Multi-Stage `Dockerfile`:**
   - Node 20 Alpine base, non-root user, clean production install (`npm ci --only=production`).
2. **Gateway Cutover Preparation:**
   - Configure reverse proxy / ALB path routing:
     - `/api/fleet/*` routes to `search-service:8080`.
     - All other paths continue to `booking-service`.
3. **Run Final Smoke Test Suite.**

### 📨 Standup Update: End of Day 3
```
Day 3 Done — search-service Completed, Cached & Ready for Production 🚀
• Redis cache-aside fully integrated:
  - Cache hits returning in < 5ms.
  - Zero-failure fallback tested: Redis outage safely falls back to Postgres.
• Multi-stage Dockerfile built and tested.
• Health, readiness, and metrics endpoints functional.
• Load relief achieved: /api/fleet/* query load ready to be cut over from booking-service.
Service ready for staging deployment and gateway routing.
```

---

# 3. 🧰 Key Code Blueprints & Patterns

## 3.1 Database Connection (`src/config/database.js`)

```javascript
import { Sequelize } from 'sequelize';
import { env } from './env.js';

const sequelize = new Sequelize(
    env.database.name,
    env.database.user,
    env.database.password,
    {
        host: env.database.host,
        port: env.database.port,
        dialect: 'postgres',
        schema: env.database.schema || 'commerce',
        searchPath: env.database.schema || 'commerce',
        logging: env.nodeEnv === 'development' ? console.log : false,
        dialectOptions: {
            statement_timeout: 10000,
            idle_in_transaction_session_timeout: 10000,
            ...(env.database.ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {})
        },
        pool: {
            max: 15,
            min: 2,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            schema: env.database.schema || 'commerce'
        }
    }
);

export { sequelize };
export default sequelize;
```

## 3.2 Redis Cache Wrapper (`src/utils/cacheUtil.js`)

```javascript
import redis from './redis.js';

export async function getOrSetCache(key, ttlSeconds, fetchFunction) {
    try {
        const client = await redis.connect();
        const cached = await client.get(key);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (err) {
        console.warn(`[Redis Cache Read Error] Key: ${key}. Falling back to DB. Error: ${err.message}`);
    }

    const result = await fetchFunction();

    if (result !== undefined && result !== null) {
        try {
            const client = await redis.connect();
            // Add slight jitter to TTL to prevent cache stampedes
            const jitter = Math.floor(Math.random() * (ttlSeconds * 0.1));
            await client.set(key, JSON.stringify(result), { EX: ttlSeconds + jitter });
        } catch (err) {
            console.warn(`[Redis Cache Write Error] Key: ${key}. Error: ${err.message}`);
        }
    }

    return result;
}
```

## 3.3 Cached Fleet Service (`src/modules/service/fleet.service.js`)

```javascript
import FleetSearchRepository from '../repository/fleetSearch.repo.js';
import { getOrSetCache } from '../../utils/cacheUtil.js';

class FleetService {
    constructor() {
        this.fleetSearchRepository = new FleetSearchRepository();
    }

    async getFleets() {
        const cacheKey = 'search:fleet:all';
        return await getOrSetCache(cacheKey, 3600, async () => {
            return await this.fleetSearchRepository.getFleets();
        });
    }

    async getDimensions(page, size) {
        const cacheKey = `search:dimensions:p${page}:s${size}`;
        return await getOrSetCache(cacheKey, 1800, async () => {
            return await this.fleetSearchRepository.getDimensions(page, size);
        });
    }

    async getMachineDetail(uuid) {
        const cacheKey = `search:machine:detail:${uuid}`;
        return await getOrSetCache(cacheKey, 900, async () => {
            return await this.fleetSearchRepository.getMachineTypeDetail(uuid);
        });
    }

    async getMachineDetailv1(uuid) {
        const cacheKey = `search:machine:detail:v1:${uuid}`;
        return await getOrSetCache(cacheKey, 900, async () => {
            let result = await this.fleetSearchRepository.getMachineTypeDetailv1(uuid);
            let dimensionDetails = await this.fleetSearchRepository.getAllDimensionOfMachineType(uuid);
            
            const plainResult = result.get ? result.get({ plain: true }) : { ...result };
            plainResult.dimensions = (dimensionDetails || []).map(dim => 
                dim.dataValues ? { ...dim.dataValues } : dim
            );
            return plainResult;
        });
    }

    async getDimensionPrice(uuid) {
        const cacheKey = `search:dimension:price:${uuid}`;
        return await getOrSetCache(cacheKey, 600, async () => {
            const prices = await this.fleetSearchRepository.getDimensionPrice(uuid);
            const getDimensionDetail = await this.fleetSearchRepository.getDimensionDetail(uuid);
            return {
                dimensionDetail: getDimensionDetail,
                prices: Array.isArray(prices) ? prices : []
            };
        });
    }
}

export default FleetService;
```

---

# 4. 🧭 Rules of the Road

1. **Read-Only Invariant:** Under no circumstances write to `commerce` tables from `search-service`.
2. **Zero Schema Mutations:** Never run `sequelize.sync()`. The database schema belongs to Nucleus/Commerce migrations.
3. **Graceful Cache Degradation:** A Redis outage must only increase latency, never cause 500 errors for users.
4. **Exact Response Parity:** Every response must use `ResponseDto.success()` or `ResponseDto.error()` so clients cannot tell whether `booking-service` or `search-service` fulfilled the request.
5. **Fail Fast on Boot:** Missing database or environment configurations must crash the container immediately during startup, not fail silently during user requests.

---

# 5. 📚 Tech Debt Register & Tracking

| # | Item | Severity | Why Taken | Repayment Trigger |
|---|---|---|---|---|
| **TD-1** | Shared database read on `commerce` schema | Medium | Deliberate: eliminates redundant syncs and enables 3-day delivery. | Revisit if search query volume creates connection pool contention on primary DB (mitigate first with Read Replica). |
| **TD-2** | TTL-based cache invalidation (no pub/sub purge) | Low | Fleet master data changes infrequently; short/medium TTLs are sufficient. | Implement Redis key invalidation when Nucleus admin publishes machine update events. |
| **TD-3** | Geofence pricing omitted | Low | Search focus is machine discovery; final dynamic pricing is calculated during booking creation. | Add indicative location pricing if product conversion demands it. |

---

# 6. ✅ Verification & Sign-Off Checklist

Before cutting over `/api/fleet/*` traffic at the API Gateway:

- [ ] `npm run dev` starts up cleanly with zero missing module errors.
- [ ] `GET /health` returns `200 OK` with database and redis connected.
- [ ] `GET /api/fleet/getFleets` returns identical payload structure to `booking-service`.
- [ ] `GET /api/fleet/get-machine-detail/:id` returns identical payload structure to `booking-service`.
- [ ] Verified Redis cache hit: 2nd identical request completes in < 10ms.
- [ ] Simulated Redis outage: verified endpoints still return 200 using DB fallback.
- [ ] Docker container builds and runs with non-root user.
- [ ] Logs are formatted as structured JSON with request IDs.

---

*Handbook v2 — Prepared for LiftKaro Engineering Sprint. Approved for 3-Day Implementation.*
