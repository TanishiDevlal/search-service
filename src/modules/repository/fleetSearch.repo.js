import db from '../models/DbSetup.js';
import { Op } from 'sequelize';

class FleetSearchRepository {

    async getFleets() {
        return await db.Fleet.findAll({
            attributes: ['uuid', 'machineType', 'category', 'machineCategory', 'imageUrl'],
            where: { isActive: true },
            order: [['id', 'ASC']]
        });
    }
    async getDimensions(page, size) {
        const offset = (page - 1) * size;
        return await db.Machine.findAndCountAll({
            where: { isActive: true },
            limit: size,
            offset,
            order: [['id', 'ASC']]
        });
    }
    async getMachineTypeDetail(uuid) {
        return await db.Machine.findOne({
            where: { uuid, isActive: true },
            include: [{
                model: db.Category,
                as: 'categoryDetail',
                required: false
            }]
        });
    }

    async getCategoriesBySubcategory(machineType) {
        if (!machineType) return [];
        const trimmed = machineType.trim();
        const variations = Array.from(new Set([
            trimmed,
            trimmed.replace(/[-_ ]+/g, '_'),
            trimmed.replace(/[-_ ]+/g, ' '),
            trimmed.replace(/[-_ ]+/g, '-')
        ]));

        return await db.Category.findAll({
            where: {
                [Op.or]: [
                    ...variations.map(v => ({ subcategory: { [Op.iLike]: v } })),
                    ...variations.map(v => ({ variant: { [Op.iLike]: v } })),
                    { uuid: trimmed }
                ],
                isActive: true
            },
            order: [['id', 'ASC']]
        });
    }

    async getFleetVariants(machineType) {
        if (!machineType) return [];
        const trimmed = machineType.trim();
        const variations = Array.from(new Set([
            trimmed,
            trimmed.replace(/[-_ ]+/g, '_'),
            trimmed.replace(/[-_ ]+/g, ' '),
            trimmed.replace(/[-_ ]+/g, '-')
        ]));

        return await db.Fleet.findAll({
            where: {
                [Op.or]: [
                    ...variations.map(v => ({ machineType: { [Op.iLike]: v } })),
                    ...variations.map(v => ({ machineCategory: { [Op.iLike]: v } }))
                ],
                isActive: true
            },
            order: [['id', 'ASC']]
        });
    }

    async getCategoryBySubcategory(machineType) {
        const categories = await this.getCategoriesBySubcategory(machineType);
        return categories.length > 0 ? categories[0] : null;
    }

    async getCategoryDetail(machineType) {
        return await this.getCategoriesBySubcategory(machineType);
    }

    async getMachineTypeDetailv1(uuid) {
        return await this.getCategoryBySubcategory(uuid);
    }

    async getAllDimensionOfMachineType(machineCategoryId) {
        return await db.Machine.findAll({
            where: { machineCategoryId, isActive: true },
            order: [['id', 'ASC']]
        });
    }

    async searchMachineCategories(searchTerms = [], page = 0, size = 10) {
        const limit = Number.parseInt(size, 10) || 10;
        const pageNumber = Number.parseInt(page, 10) || 0;
        const offset = pageNumber * limit;
        const whereClause = { isActive: true };

        if (searchTerms.length > 0) {
            const searchFilters = searchTerms.flatMap((term) => {
                const pattern = `%${term}%`;
                return [
                    { subcategory: { [Op.iLike]: pattern } },
                    { category: { [Op.iLike]: pattern } },
                    { variant: { [Op.iLike]: pattern } }
                ];
            });
            whereClause[Op.or] = searchFilters;
        }
        const result = await db.Category.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: ['uuid', 'subcategory', 'imageUrl', 'variant', 'category', 'label'],
            order: [['subcategory', 'ASC']]
        });

        const content = result.rows.map(row => ({
            uuid: row.uuid,
            imageUrl: row.imageUrl,
            category: row.category,
            machineType: row.subcategory,
            machineCategory: row.variant,
            label: row.label || row.subcategory
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