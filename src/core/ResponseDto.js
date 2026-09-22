export default class ResponseDto {
    constructor(data, message, status) {
        this.data = data;
        this.message = message;
        this.status = status;
        this.timestamp = new Date();
    }
    static success(data, message, status) {
        return new ResponseDto(data, message, status);
    }
    static error(message, status, data = null) {
        return new ResponseDto(data, message, status);
    }
}
