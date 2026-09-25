import FleetSearchRepository from '../repository/fleetSearch.repo.js';
import machineSearchEngine from './machineSearch.service.js';
import Utils from '../../utils/Utils.js';
import { getOrSetCache } from '../../utils/cacheUtil.js';
import { CacheKeys, CacheTTL } from '../../utils/cacheKeys.js';
import { env } from '../../config/env.js';
import PaginationDto from '../dtos/PaginationDto.js';

class FleetService {
    constructor() {
        this.fleetSearchRepository = new FleetSearchRepository();
    }

    async getMachineConfig() {
        return getOrSetCache(
            CacheKeys.MACHINE_LIST_CONFIG,
            CacheTTL.MACHINE_LIST_CONFIG,
            async () => {
                const response = await fetch(env.config.suggestedMachinesUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch machine config: ${response.status} ${response.statusText}`);
                }
                const json = await response.json();
                return json?.data || [];
            }
        );
    }

    async getSuggestedMachines() {
        return getOrSetCache(
            CacheKeys.SUGGESTED_MACHINES,
            CacheTTL.SUGGESTED_MACHINES,
            async () => {
                const machineConfig = await this.getMachineConfig();
                const homeScreenMachineIds = Utils.filterHomeScreenMachines(machineConfig);

                return this.fleetSearchRepository.getSuggestedMachines(homeScreenMachineIds, machineConfig);
            }
        );
    }

    async getAllMachineVariants(page = 0, size = 10) {
        return getOrSetCache(
            CacheKeys.ALL_MACHINE_VARIANTS(page, size),
            CacheTTL.ALL_MACHINE_VARIANTS,
            async () => {
                const machineConfig = await this.getMachineConfig();
                const allConfigMachineIds = Utils.returnAllMachineType(machineConfig);

                return this.fleetSearchRepository.getAllMachineVariants(page, size, allConfigMachineIds);
            }
        );
    }

    async getMachineVariant(machineType) {

        if (!machineType) return [];
        const normalizedKey = (machineType || '').trim().toLowerCase();

        return getOrSetCache(
            CacheKeys.MACHINE_VARIANT_DETAIL(normalizedKey),
            CacheTTL.MACHINE_VARIANT_DETAIL,
            async () => {
                const [categories, machineConfig] = await Promise.all([
                    this.fleetSearchRepository.getCategoriesBySubcategory(machineType),
                    this.getMachineConfig()
                ]);

                if (!categories || categories.length === 0) return [];

                const categoryUuids = categories.map(c => c.uuid);
                const dimensions = await this.fleetSearchRepository.getAllDimensionOfMachineType(categoryUuids);

                const categoryMap = new Map(
                    categories.map(category => [category.subcategory, category.label])
                );
                const availableMachines = Utils.getVariantWithActiveDimensions(machineConfig);

                return Utils.filterMachinesByAvailabilityV1(
                    dimensions,
                    availableMachines,
                    categoryMap,
                    categories
                );
            }
        );
    }

    async searchMachines(keyword = '', page = 0, size = 10) {
        const normalizedQuery = (keyword || '').trim().toLowerCase();
        const cacheKey = CacheKeys.SEARCH_QUERY(`${normalizedQuery || 'all'}:p${page}:s${size}`);

        return getOrSetCache(cacheKey, CacheTTL.SEARCH_QUERY, async () => {
            let searchTerms = normalizedQuery ? [normalizedQuery] : [];
            if (normalizedQuery) {
                // Uses Fuse.js engine
                const detectedCategories = machineSearchEngine.detectCategories(normalizedQuery);
                if (detectedCategories.length > 0) {
                    searchTerms = Array.from(new Set([normalizedQuery, ...detectedCategories]));
                }
            }

            const machineConfig = await this.getMachineConfig();
            // Filter machines in config where systemcontrol === 'AVAILABLE' and matches searchTerms
            const matchingAvailableMachines = Utils.filterMachineTypeForSearch(searchTerms, machineConfig);

            if (matchingAvailableMachines.length === 0) {
                const limit = Number.parseInt(size, 10) || 10;
                const pageNumber = Number.parseInt(page, 10) || 0;
                return new PaginationDto({
                    content: [],
                    pageNumber,
                    pageSize: limit,
                    totalElements: 0,
                    totalPages: 0,
                    last: true
                });
            }
            // Extract only variantIds that have serviceAvailability === true & active dimensions
            const activeVariants = Utils.getVariantWithActiveDimensions(matchingAvailableMachines);
            const availableVariantIds = activeVariants.map(v => v.variantId);

            // Narrow search terms to the matched machineIds from config
            const matchedSubcategories = matchingAvailableMachines.map(m => m.machineId);

            return this.fleetSearchRepository.searchMachineCategories(
                matchedSubcategories,
                page,
                size,
                availableVariantIds
            );
        });
    }
}

export default FleetService;
