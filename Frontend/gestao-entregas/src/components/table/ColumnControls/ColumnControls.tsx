import { useRef } from "react";
import {
    ColumnFilterControl,
    type ColumnFilterControlProps,
} from "../columnsFilter/ColumnFilterControl";
import {
    ColumnSortControl,
    type ColumnSortControlProps,
} from "../ColumnSortControl/ColumnSortControl";

export interface ColumnControlsProps {
    sortProps: Omit<ColumnSortControlProps, "containerRef">;
    filterProps: Omit<ColumnFilterControlProps, "containerRef">;
}

export function ColumnControls({
    sortProps,
    filterProps,
}: ColumnControlsProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    return (
        <div ref={containerRef} className="table-controls-container">
            <ColumnSortControl {...sortProps} containerRef={containerRef} />
            <ColumnFilterControl {...filterProps} containerRef={containerRef} />
        </div>
    );
}
