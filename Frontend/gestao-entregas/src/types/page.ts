export interface PagedResponse<T> {
    content: T[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalItemsInDB: number;
    totalPages: number;
}
