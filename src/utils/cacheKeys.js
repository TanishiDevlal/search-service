export const CacheKeys = {
    SUGGESTED_MACHINES: 'search:suggested_machines',
    ALL_MACHINE_VARIANTS: (page, size) => `search:variants:p${page}:s${size}`,
    MACHINE_VARIANT_DETAIL: (machineType) => `search:variant:detail:${(machineType || '').toLowerCase().trim()}`,
    SEARCH_QUERY: (identifier) => `search:query:${identifier}`,
    MACHINE_LIST_CONFIG: 'search:config:machine_list',
    SERVICE_AVAILABLE_ZONES: 'search:config:service_zones',
};

export const CacheTTL = {
    SUGGESTED_MACHINES: 1800,      // 30 min — Home screen chips rarely change
    ALL_MACHINE_VARIANTS: 1800,    // 30 min — Full machine catalog
    MACHINE_VARIANT_DETAIL: 900,   // 15 min — Specific machine profile/dimensions
    SEARCH_QUERY: 300,             // 5 min  — Search autocomplete results
    MACHINE_LIST_CONFIG: 300,      // 5 min  — Remote machine availability config
    SERVICE_AVAILABLE_ZONES: 600,  // 10 min — Remote service zones config
};