import db from '../models/DbSetup.js';
import { Op } from 'sequelize';
import { machineKeyword } from '../../core/Constants.js';

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
    async getMachineTypeDetailv1(uuid) {
        return await db.Category.findOne({
            where: { uuid, isActive: true }
        });
    }

    async getAllDimensionOfMachineType(machineCategoryId) {
        return await db.Machine.findAll({
            where: { machineCategoryId, isActive: true },
            order: [['id', 'ASC']]
        });
    }

    async getDimensionDetail(uuid) {
        return await db.Machine.findOne({
            where: { uuid, isActive: true }
        });
    }

    async searchFleets(filters = {}) {
        const { searchText, machineType, category, page = 1, size = 20 } = filters;
        const whereClause = { isActive: true };
        if (searchText && searchText.trim()) {
            const normalised = searchText.trim().toLowerCase();
            const matchedTypes = [];
            for (const [fleetType, keywords] of Object.entries(machineKeyword)) {
                const isMatch = keywords.some(keyword =>
                    normalised.includes(keyword.toLowerCase()) ||
                    keyword.toLowerCase().includes(normalised)
                );
                if (isMatch) {
                    matchedTypes.push(fleetType);
                }
            }
            if (matchedTypes.length > 0) {
                whereClause.machineType = { [Op.in]: matchedTypes };
            } else {
                whereClause[Op.or] = [
                    { machineType: { [Op.iLike]: `%${normalised}%` } },
                    { category: { [Op.iLike]: `%${normalised}%` } },
                    { machineCategory: { [Op.iLike]: `%${normalised}%` } }
                ];
            }
        }
        if (machineType) {
            whereClause.machineType = machineType;
        }
        if (category) {
            whereClause.category = category;
        }
        const offset = (page - 1) * size;
        return await db.Fleet.findAndCountAll({
            where: whereClause,
            limit: size,
            offset,
            order: [['id', 'ASC']]
        });
    }
}
export default FleetSearchRepository;
