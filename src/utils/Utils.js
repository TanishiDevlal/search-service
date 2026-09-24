class Utils {

    static generateSearchVariations(term) {
        if (!term) return [];
        const trimmed = term.trim();
        return Array.from(new Set([
            trimmed,
            trimmed.replace(/[-_ ]+/g, '_'), // DB format (e.g. Backhoe_Loader)
            trimmed.replace(/[-_ ]+/g, ' '), // User format
            trimmed.replace(/[-_ ]+/g, '-')  // URL format
        ]));
    }

    static formatDimensions(variantDimensions) {
        if (!variantDimensions || !Array.isArray(variantDimensions)) return [];

        return variantDimensions.map(dimension => {
            const configs = dimension.dimensionDetails?.dimensionConfiguration || [];

            return {
                uuid: dimension.uuid || null,
                name: dimension.dimensionName || dimension.name || null,
                label: dimension.dimensionLabel || dimension.label || null,
                application: dimension.application || 'Multipurpose use',
                imageUrl: dimension.imageUrl || null,
                dimensionDetails: dimension.dimensionDetails || {
                    dimensionHeader: {},
                    imageUrls: [],
                    dimensionData: [],
                    dimensionConfiguration: []
                },
                instantBookingAllowed: Boolean(configs.find(c => c.key === 'instantBookingPreprationTime')?.value),
                scheduleBookingAllowed: Boolean(configs.find(c => c.key === 'scheduleBookingPreprationTime')?.value)
            };
        });
    }

    static getVariantWithActiveDimensions(machines = []) {
        if (!Array.isArray(machines)) return [];
        return machines
            .flatMap(machine =>
                machine.variants?.map(variant => {
                    const activeDimensionIds =
                        variant.dimensions
                            ?.filter(d => d.serviceAvailability === true)
                            .map(d => d.dimensionId) || [];
                    if (variant.serviceAvailability === true && activeDimensionIds.length > 0) {
                        return {
                            variantId: variant.variantId,
                            dimensionIds: activeDimensionIds
                        };
                    }
                    return null;
                }) || []
            )
            .filter(Boolean);
    }

    //Filters and orders categories & dimensions based on config availability 
    static filterMachinesByAvailabilityV1(
        machineList = [],
        availableMachines = [],
        categoryMap = new Map(),
        machineCategories = []
    ) {
        const categoryByVariantId = new Map(
            machineCategories
                .map(category => (category?.get ? category.get({ plain: true }) : category?.dataValues || category))
                .filter(category => category?.uuid)
                .map(category => [category.uuid, category])
        );
        const dimensionsByVariantId = new Map();
        machineList.forEach(dimensionRow => {
            const dimension = dimensionRow?.get
                ? dimensionRow.get({ plain: true })
                : dimensionRow?.dataValues || dimensionRow;
            const variantId = dimension?.machineCategoryId;
            const dimensionId = dimension?.uuid;
            if (!variantId || !dimensionId) return;
            if (!dimensionsByVariantId.has(variantId)) {
                dimensionsByVariantId.set(variantId, new Map());
            }
            dimensionsByVariantId.get(variantId).set(dimensionId, dimension);
        });
        return availableMachines
            .map(item => {
                const variantId = item?.variantId;
                const allowedDimensions = new Set(item?.dimensionIds || []);
                const categoryData = categoryByVariantId.get(variantId);
                if (!variantId || !categoryData || allowedDimensions.size === 0) return null;
                const variantDimensions = dimensionsByVariantId.get(variantId) || new Map();
                const rawFilteredDimensions = (item?.dimensionIds || [])
                    .map(dimensionId => variantDimensions.get(dimensionId))
                    .filter(Boolean)
                    .filter(dimension => allowedDimensions.has(dimension?.uuid));
                const filteredDimensions = Utils.formatDimensions(rawFilteredDimensions);
                if (!filteredDimensions.length) return null;
                return {
                    machineType: categoryData.subcategory,
                    label: categoryMap.get(categoryData.subcategory) ?? categoryData.label ?? null,
                    uuid: categoryData.uuid,
                    category: categoryData.category,
                    additionalSpecs: categoryData.additionalSpecs,
                    imageUrl: categoryData.imageUrl,
                    additionalConfig: categoryData.additionalConfig,
                    primaryFunction: categoryData.primaryFunction,
                    machineCategory: categoryData.variant,
                    dimensions: filteredDimensions,
                };
            })
            .filter(Boolean);
    }

    //Filters machine config for search terms where systemcontrol === 'AVAILABLE"   
    static filterMachineTypeForSearch(searchTerms = [], machineTypeList = []) {
        if (!Array.isArray(machineTypeList) || machineTypeList.length === 0) {
            return [];
        }
        const normalize = (str) => str?.toLowerCase().replace(/[\s_-]+/g, '') ?? '';
        const normalizedSearchTerms = searchTerms.map(normalize).filter(Boolean);
        // If no search terms provided, return all AVAILABLE machines
        if (normalizedSearchTerms.length === 0) {
            return machineTypeList.filter(machine => machine.systemcontrol === 'AVAILABLE');
        }
        return machineTypeList.filter(machine =>
            machine.systemcontrol === 'AVAILABLE' &&
            normalizedSearchTerms.some(term =>
                normalize(machine.machineId).includes(term) || term.includes(normalize(machine.machineId))
            )
        );
    }

    static filterHomeScreenMachines(machines = []) {
        if (!Array.isArray(machines)) return [];
        return machines
            .filter(m => m.showInHomeScreen === true)
            .map(m => m.machineId);
    }

    static returnAllMachineType(machines = []) {
        if (!Array.isArray(machines)) return [];
        return machines.map(m => m.machineId).filter(Boolean);
    }
}

export default Utils;