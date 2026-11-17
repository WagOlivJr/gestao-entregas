export interface ApiPageRequest {
    size: number;
    page: number;
    sortBy?: string;
    sortAsc?: boolean;
    filters?: ColumnFilter[];
}

export interface SingleValueColumnFilter {
    field: string;
    operator: "EQ" | "LIKE";
    value: string;
}

export interface MultiValueColumnFilter {
    field: string;
    operator: "IN";
    values: string[];
}

export type ColumnFilter = SingleValueColumnFilter | MultiValueColumnFilter;
