import { useEffect } from "react";
import type {
    ColumnFilterConfig,
    Option,
} from "../../../hooks/useColumnFilters";

export interface ColumnFilterControlProps {
    columnKey: string;
    config: ColumnFilterConfig;
    value: string;
    isOpen: boolean;
    isActive: boolean;
    onOpenChange: (open: boolean) => void;
    onChange: (value: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ColumnFilterControl({
    columnKey,
    config,
    value,
    isOpen,
    isActive,
    onOpenChange,
    onChange,
    containerRef,
}: ColumnFilterControlProps) {
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) {
                onOpenChange(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen, onOpenChange]);

    return (
        <>
            <span
                className={`fas table-filter-icon${isActive ? " fa-filter-circle-xmark filter-active" : " fa-filter"}`}
                data-fallback={isActive ? "✕" : "🔍"}
                title={
                    isActive
                        ? "Filtro ativo - clique para editar"
                        : "Filtrar..."
                }
                style={isActive ? { color: "#8A2BE2" } : undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenChange(!isOpen);
                }}
            />
            {isOpen && (
                <FilterInput
                    columnKey={columnKey}
                    config={config}
                    value={value}
                    onChange={onChange}
                    onEscapeKeydown={(e) =>
                        e.key === "Escape" && onOpenChange(false)
                    }
                />
            )}
        </>
    );
}

interface FilterInputProps {
    columnKey: string;
    config: ColumnFilterConfig;
    value: string;
    onChange: (value: string) => void;
    onEscapeKeydown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

function FilterInput({
    columnKey,
    config,
    value,
    onChange,
    onEscapeKeydown,
}: FilterInputProps) {
    if (config.type === "select") {
        const entries: Option[] = normalizeOptions(config.options);

        return (
            <select
                ref={(el) => el?.focus()}
                className="table-filter-input"
                data-column={columnKey}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onEscapeKeydown}
            >
                <option value="">Todos</option>
                {entries.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        );
    }

    const inputType =
        config.type === "number"
            ? "number"
            : config.type === "date"
              ? "date"
              : "text";

    return (
        <input
            ref={(el) => el?.focus()}
            className="table-filter-input"
            data-column={columnKey}
            type={inputType}
            placeholder={config.placeholder ?? "Filtrar..."}
            min={config.type === "number" ? 1 : undefined}
            step={config.type === "number" ? 1 : undefined}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onEscapeKeydown}
        />
    );
}

function normalizeOptions(options?: Option[]) {
    if (!options) return [] as { label: string; value: string }[];

    return options.map((opt) => {
        if (typeof opt === "string") {
            return { label: opt, value: opt };
        }
        return opt;
    });
}
