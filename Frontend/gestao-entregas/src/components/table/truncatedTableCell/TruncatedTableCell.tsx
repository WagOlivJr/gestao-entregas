import type { ReactNode } from "react";
import { useIsTruncated } from "../../../hooks/useIsTruncated";
import "./TruncatedTableCell.css";

interface TruncatedTableCellProps {
    children: ReactNode;
    text?: string;
    className?: string;
    dataLabel?: string;
}

export function TruncatedTableCell({
    children,
    text,
    className,
    dataLabel,
}: TruncatedTableCellProps) {
    const { ref, isTruncated } = useIsTruncated<HTMLDivElement>(text);

    return (
        <td
            className={`${className ?? ""}${isTruncated ? " is-truncated" : ""}`}
            data-label={dataLabel}
        >
            <div ref={ref} className="pos-anchor" data-full-text={text}>
                {children}
            </div>
        </td>
    );
}
