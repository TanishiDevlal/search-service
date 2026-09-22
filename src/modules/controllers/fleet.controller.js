import BaseController from '../../core/base/BaseController.js';
import FleetService from '../service/fleet.service.js';
import { HTTP_STATUS } from '../../core/Constants.js';
import { RESPONSE_MESSAGES } from '../../core/ApiMessage.js';

class FleetController extends BaseController {
    constructor() {
        super();
        this.fleetService = new FleetService();
    }

    async getFleets(req, res) {
        try {
            const data = await this.fleetService.getFleets();
            return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.ALL_FETCHED, data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getDimensions(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const size = parseInt(req.query.size, 10) || 10;
            const data = await this.fleetService.getDimensions(page, size);
            return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.DIMENSIONS_FETCHED, data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getMachineDetail(req, res) {
        try {
            const { id } = req.params;
            const data = await this.fleetService.getMachineDetail(id);

            if (!data) {
                return this.sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.COMMON.NOT_FOUND, null);
            }

            return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.MACHINE_DETAIL_FETCHED, data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getMachineDetailv1(req, res) {
        try {
            const { id } = req.params;
            const data = await this.fleetService.getMachineDetailv1(id);

            if (!data) {
                return this.sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.COMMON.NOT_FOUND, null);
            }

            return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.MACHINE_DETAIL_FETCHED, data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getDimensionPrice(req, res) {
        try {
            const { id } = req.params;
            const data = await this.fleetService.getDimensionPrice(id);
            return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.DIMENSION_PRICE_FETCHED, data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async createSearchModel(req, res) {
        try {
            const filters = req.body || {};
            const data = await this.fleetService.searchFleets(filters);
            return this.sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.FLEET.SEARCH_RESULTS, data);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}

export default FleetController;
