export const CacheKeys = {
    ALL_FLEETS: 'search:fleet:all',
    DIMENSIONS: (page, size) => `search:dimensions:p${page}:s${size}`,
    MACHINE_DETAIL: (uuid) => `search:machine:detail:${uuid}`,
    MACHINE_DETAIL_V1: (uuid) => `search:machine:detail:v1:${uuid}`,
    CATEGORY_DETAIL: (machineType) => `search:category:detail:${(machineType || '').toLowerCase().trim()}`,
    SEARCH_QUERY: (identifier) => `search:query:${identifier}`,
};

export const CacheTTL = {
    ALL_FLEETS: 3600,         // 1 hour  — fleet master rarely changes
    DIMENSIONS: 1800,         // 30 min  — machine catalog is semi-static
    MACHINE_DETAIL: 900,      // 15 min  — individual machine specs
    MACHINE_DETAIL_V1: 900,   // 15 min  — category + dimensions
    CATEGORY_DETAIL: 900,     // 15 min  — category + dimensions by machineType
    SEARCH_QUERY: 300,        // 5 min   — search results
};