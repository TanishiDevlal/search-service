import FleetSearchRepository from '../repository/fleetSearch.repo.js';
import machineSearchEngine from './machineSearch.service.js';
import Utils from '../../utils/Utils.js';
import { getOrSetCache } from '../../utils/cacheUtil.js';
import { CacheKeys, CacheTTL } from '../../utils/cacheKeys.js';
import { env } from '../../config/env.js';

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
                return {
                    content: [],
                    pageNumber,
                    pageSize: limit,
                    totalElements: 0,
                    totalPages: 0,
                    last: true
                };
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

    // async getFleets() {
    //     return getOrSetCache(
    //         CacheKeys.ALL_FLEETS,
    //         CacheTTL.ALL_FLEETS,
    //         () => this.fleetSearchRepository.getFleets()
    //     );
    // }

    // async getDimensions(page = 0, size = 10) {
    //     return getOrSetCache(
    //         CacheKeys.DIMENSIONS(page, size),
    //         CacheTTL.DIMENSIONS,
    //         () => this.fleetSearchRepository.getDimensions(page, size)
    //     );
    // }

    // async getMachineDetail(uuid) {
    //     return getOrSetCache(
    //         CacheKeys.MACHINE_DETAIL(uuid),
    //         CacheTTL.MACHINE_DETAIL,
    //         () => this.fleetSearchRepository.getMachineTypeDetail(uuid)
    //     );
    // }

    // async getCategoryDetail(machineType) {
    //     if (!machineType) return [];
    //     const normalizedKey = (machineType || '').trim().toLowerCase();

    //     return getOrSetCache(
    //         CacheKeys.CATEGORY_DETAIL(normalizedKey),
    //         CacheTTL.CATEGORY_DETAIL,
    //         async () => {
    //             const categories = await this.fleetSearchRepository.getCategoriesBySubcategory(machineType);
    //             if (!categories || categories.length === 0) return [];

    //             const categoryUuids = categories.map(c => c.uuid);
    //             const dimensions = await this.fleetSearchRepository.getAllDimensionOfMachineType(categoryUuids);

    //             const dimensionsByVariantId = new Map();
    //             for (const dim of dimensions) {
    //                 const row = dim.get ? dim.get({ plain: true }) : { ...dim };
    //                 const variantId = row.machineCategoryId;
    //                 if (!dimensionsByVariantId.has(variantId)) {
    //                     dimensionsByVariantId.set(variantId, []);
    //                 }
    //                 dimensionsByVariantId.get(variantId).push(row);
    //             }

    //             // Check fleet table for any variant that doesn't have dimensions in machine table
    //             let fleetVariants = null;
    //             const hasMissingDimensions = categories.some(cat => !dimensionsByVariantId.has(cat.uuid));
    //             if (hasMissingDimensions) {
    //                 fleetVariants = await this.fleetSearchRepository.getFleetVariants(machineType);
    //             }
    //             const fleetMap = new Map();
    //             if (fleetVariants) {
    //                 for (const f of fleetVariants) {
    //                     if (f.machineCategory && f.dimensions) {
    //                         fleetMap.set(f.machineCategory.toLowerCase(), f.dimensions);
    //                     }
    //                 }
    //             }

    //             const suggestedMachines = categories.map(category => {
    //                 const categoryData = category.get ? category.get({ plain: true }) : { ...category };
    //                 let variantDimensions = dimensionsByVariantId.get(categoryData.uuid) || [];

    //                 // Fallback to fleet table dimensions if machine table had no dimensions for this variant
    //                 if (variantDimensions.length === 0 && categoryData.variant) {
    //                     const fleetDims = fleetMap.get(categoryData.variant.toLowerCase());
    //                     if (fleetDims && fleetDims.length > 0) {
    //                         variantDimensions = fleetDims;
    //                     }
    //                 }

    //                 const formattedDimensions = variantDimensions.map(dimension => {
    //                     const configs = dimension.dimensionDetails?.dimensionConfiguration || [];
    //                     const instantBookingConfig = Boolean(configs.find(c => c.key === 'instantBookingPreprationTime')?.value);
    //                     const scheduleBookingConfig = Boolean(configs.find(c => c.key === 'scheduleBookingPreprationTime')?.value);

    //                     const normalizedDimensionName = dimension.dimensionName || dimension.name || null;
    //                     const normalizedDimensionLabel = dimension.dimensionLabel || dimension.label || null;

    //                     return {
    //                         uuid: dimension.uuid || null,
    //                         name: normalizedDimensionName,
    //                         label: normalizedDimensionLabel,
    //                         application: dimension.application || 'Multipurpose use',
    //                         imageUrl: dimension.imageUrl || null,
    //                         dimensionDetails: dimension.dimensionDetails || {
    //                             dimensionHeader: {},
    //                             imageUrls: [],
    //                             dimensionData: [],
    //                             dimensionConfiguration: []
    //                         },
    //                         instantBookingAllowed: instantBookingConfig,
    //                         scheduleBookingAllowed: scheduleBookingConfig
    //                     };
    //                 });

    //                 return {
    //                     machineType: categoryData.subcategory,
    //                     label: categoryData.label ?? categoryData.subcategory ?? null,
    //                     uuid: categoryData.uuid,
    //                     category: categoryData.category,
    //                     additionalSpecs: categoryData.additionalSpecs,
    //                     imageUrl: categoryData.imageUrl,
    //                     additionalConfig: categoryData.additionalConfig,
    //                     primaryFunction: categoryData.primaryFunction,
    //                     machineCategory: categoryData.variant,
    //                     dimensions: formattedDimensions
    //                 };
    //             });

    //             return suggestedMachines;
    //         }
    //     );
    // }

    // async getMachineDetailv1(uuid) {
    //     return this.getCategoryDetail(uuid);
    // }
    // async searchMachines(keyword = '', page = 0, size = 10) {
    //     const normalizedQuery = (keyword || '').trim().toLowerCase();
    //     const cacheKey = CacheKeys.SEARCH_QUERY(`${normalizedQuery || 'all'}:p${page}:s${size}`);

    //     return getOrSetCache(cacheKey, CacheTTL.SEARCH_QUERY, async () => {
    //         let searchTerms = normalizedQuery ? [normalizedQuery] : [];

    //         if (normalizedQuery) {
    //             const detectedCategories = machineSearchEngine.detectCategories(normalizedQuery);
    //             if (detectedCategories.length > 0) {
    //                 searchTerms = Array.from(new Set([normalizedQuery, ...detectedCategories]));
    //             }
    //         }

    //         return this.fleetSearchRepository.searchMachineCategories(searchTerms, page, size);
    //     });
    // }
}

export default FleetService;
