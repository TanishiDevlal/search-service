export default class PaginationDto {
    constructor(rows, count, page, size) {
        this.items = rows;
        this.page = page;
        this.size = size;
        this.totalItems = count;
        this.totalPages = Math.ceil(count / size);
    }
    static from(result, page, size) {
        return new PaginationDto(result.rows, result.count, page, size);
    }
}
