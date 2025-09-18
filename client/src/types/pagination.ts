
export type Pagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type PaginationArgs = Pick<Pagination, 'limit' | 'page'>;