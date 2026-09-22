import ResponseDto from '../ResponseDto.js';
import { HTTP_STATUS } from '../Constants.js';
import logger from '../logger.js';

export default class BaseController {
    sendResponse(res, statusCode, message, data) {
        const response = ResponseDto.success(data, message, statusCode);
        return res.status(statusCode).json(response);
    }
    handleError(res, error) {
        logger.error({
            err: error.message,
            stack: error.stack
        }, 'Controller error');
        const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Internal Server Error';
        const response = ResponseDto.error(message, statusCode);
        return res.status(statusCode).json(response);
    }
}