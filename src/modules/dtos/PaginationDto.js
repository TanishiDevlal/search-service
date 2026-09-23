export default class PaginationDto {
    constructor({
        content = [],
        pageNumber = 0,
        pageSize = 10,
        totalElements = 0,
        totalPages = 0,
        last = false
    } = {}) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.last = last;
    }
}