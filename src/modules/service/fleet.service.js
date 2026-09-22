import FleetSearchRepository from '../repository/fleetSearch.repo.js';
import PaginationDto from '../dtos/PaginationDto.js';

class FleetService {
    constructor() {
        this.fleetSearchRepository = new FleetSearchRepository();
    }

    async getFleets() {
        return await this.fleetSearchRepository.getFleets();
    }

    async getDimensions(page, size) {
        const result = await this.fleetSearchRepository.getDimensions(page, size);
        return PaginationDto.from(result, page, size);
    }

    async getMachineDetail(uuid) {
        return await this.fleetSearchRepository.getMachineTypeDetail(uuid);
    }

    async getMachineDetailv1(uuid) {
        const result = await this.fleetSearchRepository.getMachineTypeDetailv1(uuid);
        if (!result) return null;

        const dimensionDetails = await this.fleetSearchRepository.getAllDimensionOfMachineType(uuid);

        const plainResult = result.get ? result.get({ plain: true }) : { ...result };
        plainResult.dimensions = (dimensionDetails || []).map(dim =>
            dim.dataValues ? { ...dim.dataValues } : dim
        );

        return plainResult;
    }

    async getDimensionPrice(uuid) {
        const dimensionDetail = await this.fleetSearchRepository.getDimensionDetail(uuid);
        return {
            dimensionDetail,
            prices: []
        };
    }

    async searchFleets(filters) {
        const { page = 1, size = 20 } = filters;
        const result = await this.fleetSearchRepository.searchFleets(filters);
        return PaginationDto.from(result, page, size);
    }
}

export default FleetService;
