import db from '../models/DbSetup.js';
import { Op } from 'sequelize';
import Utils from '../../utils/Utils.js';

class FleetSearchRepository {

    async processSuggestedMachines(allowedMachineTypes = [], machineConfigList = null) {
        const whereClause = { isActive: true };

        if (Array.isArray(allowedMachineTypes) && allowedMachineTypes.length > 0) {
            whereClause.subcategory = { [Op.in]: allowedMachineTypes };
        }

        const machines = await db.MachineCategory.findAll({
            where: whereClause,
            attributes: ['uuid', 'category', 'subcategory', 'imageUrl', 'label'],
            raw: true
        });

        // Deduplicate by subcategory, keeping the first occurrence
        const uniqueMachines = [];
        const seenSubcategories = new Set();

        for (const machine of machines) {
            if (!seenSubcategories.has(machine.subcategory)) {
                seenSubcategories.add(machine.subcategory);
                uniqueMachines.push(machine);
            }
        }

        return uniqueMachines.map(machine => ({
            category: machine.category,
            machineType: machine.subcategory,
            label: machine.label,
            imageUrl: machine.imageUrl,
            homeScreenIndex:
                machineConfigList?.find(m => m.machineId === machine.subcategory)?.homeScreenIndex ??
                machineConfigList?.find(m => m.machineId === machine.subcategory)?.index ??
                null
        }));
    }

    async getSuggestedMachines(allowedMachineTypes = [], machineConfigList = []) {
        return this.processSuggestedMachines(allowedMachineTypes, machineConfigList);
    }

    async getAllMachineVariants(page = 0, size = 10, allowedMachineTypes = []) {
        const pageNumber = Number.parseInt(page, 10) || 0;
        const limit = Number.parseInt(size, 10) || 10;

        // Pass null for machineConfigList so homeScreenIndex is null
        const machineList = await this.processSuggestedMachines(allowedMachineTypes, null);

        const totalElements = machineList.length;
        const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / limit);
        const startIndex = pageNumber * limit;
        const endIndex = startIndex + limit;
        const paginatedContent = machineList.slice(startIndex, endIndex);

        return {
            content: paginatedContent,
            pageNumber,
            pageSize: limit,
            totalElements,
            totalPages,
            last: totalPages === 0 ? true : pageNumber >= totalPages - 1
        };
    }

    async getCategoriesBySubcategory(machineType) {
        if (!machineType) return [];
        const variations = Utils.generateSearchVariations(machineType);
        return await db.Category.findAll({
            where: {
                [Op.or]: variations.map(v => ({ subcategory: { [Op.iLike]: v } })),
                isActive: true
            },
            order: [['id', 'ASC']]
        });
    }

    async getAllDimensionOfMachineType(machineCategoryId) {
        return await db.Machine.findAll({
            where: { machineCategoryId, isActive: true },
            order: [['id', 'ASC']]
        });
    }

    async searchMachineCategories(searchTerms = [], page = 0, size = 10, availableVariantIds = null) {
        const limit = Number.parseInt(size, 10) || 10;
        const pageNumber = Number.parseInt(page, 10) || 0;
        const offset = pageNumber * limit;

        const whereClause = { isActive: true };

        if (Array.isArray(availableVariantIds)) {
            if (availableVariantIds.length === 0) {
                return {
                    content: [],
                    pageNumber,
                    pageSize: limit,
                    totalElements: 0,
                    totalPages: 0,
                    last: true
                };
            }
            whereClause.uuid = { [Op.in]: availableVariantIds };
        }

        if (searchTerms.length > 0) {
            const searchFilters = searchTerms.flatMap((term) => {
                const variations = Utils.generateSearchVariations(term);
                return variations.flatMap(v => {
                    const pattern = `%${v}%`;
                    return [{ subcategory: { [Op.iLike]: pattern } }];
                });
            });
            whereClause[Op.or] = searchFilters;
        }

        // Fetch both Category variants and MachineCategory labels in parallel
        const [result, machineCategories] = await Promise.all([
            db.Category.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                attributes: ['uuid', 'subcategory', 'imageUrl', 'variant', 'category', 'label'],
                order: [['subcategory', 'ASC']]
            }),
            db.MachineCategory.findAll({
                where: { isActive: true },
                attributes: ['subcategory', 'label'],
                raw: true
            })
        ]);

        const categoryLabelMap = new Map(
            machineCategories.map(c => [c.subcategory, c.label])
        );

        const content = result.rows.map(row => ({
            uuid: row.uuid,
            imageUrl: row.imageUrl,
            category: row.category,
            machineType: row.subcategory,
            machineCategory: row.variant,
            label: categoryLabelMap.get(row.subcategory) || row.label || row.subcategory
        }));

        const totalElements = result.count;
        const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / limit);

        return {
            content,
            pageNumber,
            pageSize: limit,
            totalElements,
            totalPages,
            last: totalPages === 0 ? true : pageNumber >= totalPages - 1
        };
    }
}

export default FleetSearchRepository;