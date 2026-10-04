export interface ApiPageRequest {
    size: number;
    page: number;
    sortBy?: string;
    sortAsc?: boolean;
    filters?: ColumnFilter[];
}

export interface ColumnFilter {
    field: string;
    value: string;
    operator: "EQ" | "LIKE";
}
