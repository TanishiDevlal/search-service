# 🔎 search-service

High-performance Machine & Fleet Search Microservice for LiftKaro.

Offloads discovery, category browsing, and machine detail lookup traffic from `booking-service`, backed by Redis caching.

## Documentation

Full architectural specification, build blueprints, and the 3-day sprint execution plan are available in:
👉 **[HANDBOOK.md](./HANDBOOK.md)**

## Quick Start

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run locally:
   ```bash
   npm run dev
   ```
4. Check health:
   ```bash
   curl http://localhost:3000/health
   ```
