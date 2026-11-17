import type { ReactNode, Ref } from "react";
import { useIsTruncated } from "../../../hooks/useIsTruncated";
import "./TableCell.css";

export type CellTooltipType = "truncated" | "all";

interface Props {
    children: ReactNode;
    tooltip?: string | ReactNode;
    tooltipType?: CellTooltipType;
    className?: string;
    headerMobile?: string;
    ref?: Ref<HTMLDivElement>;
    isTruncated?: boolean;
}

export function TableCell({
    children,
    tooltip,
    tooltipType,
    className,
    headerMobile,
}: Props) {
    const { ref, isTruncated } = useIsTruncated<HTMLDivElement>();

    if (!tooltipType) {
        return (
            <td
                className={"data-table__cell " + className}
                data-label={headerMobile}
            >
                {children}
            </td>
        );
    }

    const showTooltip =
        !!tooltip &&
        (tooltipType === "all" || (tooltipType === "truncated" && isTruncated));

    const classes = [className, showTooltip ? "has-tooltip" : null]
        .filter(Boolean)
        .join(" ");

    return (
        <td className={`data-table__cell ${classes}`} data-label={headerMobile}>
            <div
                className="pos-anchor"
                data-tooltip={showTooltip ? tooltip : undefined}
            >
                <div className="truncated-cell" ref={ref}>
                    {headerMobile && (
                        <span className="header-mobile">
                            {headerMobile}&nbsp;
                        </span>
                    )}
                    <span>{children}</span>
                </div>
            </div>
        </td>
    );
}
