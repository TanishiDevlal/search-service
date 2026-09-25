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
}

export default FleetController;
