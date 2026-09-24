import BaseController from '../../core/base/BaseController.js';
import FleetService from '../service/fleet.service.js';
import { HTTP_STATUS } from '../../core/Constants.js';
import { RESPONSE_MESSAGES } from '../../core/ApiMessage.js';

class FleetController extends BaseController {
    constructor() {
        super();
        this.fleetService = new FleetService();
    }

    async getSuggestedMachines(req, res) {
        try {
            const data = await this.fleetService.getSuggestedMachines();
            return this.sendResponse(res, HTTP_STATUS.OK, 'Suggested machines fetched successfully', data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getAllMachineVariants(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 0;
            const size = parseInt(req.query.size, 10) || 10;
            const data = await this.fleetService.getAllMachineVariants(page, size);
            return this.sendResponse(res, HTTP_STATUS.OK, 'Machine variants fetched successfully', data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async searchMachines(req, res) {
        try {
            const keyword = (req.query.keyword || '').trim();
            const page = parseInt(req.query.page, 10) || 0;
            const size = parseInt(req.query.size, 10) || 10;
            const data = await this.fleetService.searchMachines(keyword, page, size);
            return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.COMMON.FETCHED, data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getMachineVariant(req, res) {
        try {
            // Using req.body because machineType can contain slashes like "Crane/Hydra"
            const { machineType } = req.body;
            if (!machineType) {
                return this.sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'machineType is required', null);
            }
            const data = await this.fleetService.getMachineVariant(machineType);

            return this.sendResponse(res, HTTP_STATUS.OK, 'Machine variant detail fetched successfully', data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    // async getFleets(req, res) {
    //     try {
    //         const data = await this.fleetService.getFleets();
    //         return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.ALL_FETCHED, data);
    //     } catch (error) {
    //         return this.handleError(res, error);
    //     }
    // }

    // async getDimensions(req, res) {
    //     try {
    //         const page = parseInt(req.query.page, 10) || 0;
    //         const size = parseInt(req.query.size, 10) || 10;
    //         const data = await this.fleetService.getDimensions(page, size);
    //         return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.DIMENSIONS_FETCHED, data);
    //     } catch (error) {
    //         return this.handleError(res, error);
    //     }
    // }

    // async getMachineDetail(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const data = await this.fleetService.getMachineDetail(id);

    //         if (!data) {
    //             return this.sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.COMMON.NOT_FOUND, null);
    //         }

    //         return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.MACHINE_DETAIL_FETCHED, data);
    //     } catch (error) {
    //         return this.handleError(res, error);
    //     }
    // }

    // async getCategoryDetail(req, res) {
    //     try {
    //         const { machineType } = req.params;
    //         const data = await this.fleetService.getCategoryDetail(machineType);

    //         if (!data || (Array.isArray(data) && data.length === 0)) {
    //             return this.sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.COMMON.NOT_FOUND, null);
    //         }

    //         return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.CATEGORY_DETAIL_FETCHED, data);
    //     } catch (error) {
    //         return this.handleError(res, error);
    //     }
    // }

    // async searchMachines(req, res) {
    //     try {
    //         const keyword = (req.query.keyword || '').trim();
    //         const page = parseInt(req.query.page, 10) || 0;
    //         const size = parseInt(req.query.size, 10) || 10;

    //         const data = await this.fleetService.searchMachines(keyword, page, size);
    //         return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.COMMON.FETCHED, data);
    //     } catch (error) {
    //         return this.handleError(res, error);
    //     }
    // }
}

export default FleetController;
