import { Table, type TableProps } from "./table/Table";

interface TableWrapperProps<T> extends TableProps<T> {
    title?: string;
}

export function TableWrapper<T>({
    title,
    ...tableProps
}: TableWrapperProps<T>) {
    return (
        <div id="main-table-wrapper">
            {title && <h2 className="data-table__title">{title}</h2>}
            <Table {...tableProps} />
        </div>
    );
}
