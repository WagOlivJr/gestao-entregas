import { useEffect, useRef, useState, type Ref } from "react";
import {
    resolveColumnFilterConfig,
    type ColumnFilterConfig,
    type FilterValue,
    type Option,
} from "../../../hooks/useColumnFilters";

export interface ColumnFilterControlProps {
    columnKey: string;
    config: ColumnFilterConfig;
    value: FilterValue;
    isOpen: boolean;
    isActive: boolean;
    mode?: string;
    onOpenChange: (open: boolean) => void;
    onChange: (value: FilterValue) => void;
    onModeChange?: (mode?: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ColumnFilterControl({
    columnKey,
    config,
    value,
    isOpen,
    isActive,
    mode,
    onOpenChange,
    onChange,
    onModeChange,
    containerRef,
}: ColumnFilterControlProps) {
    const filterFieldRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) {
                onOpenChange(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen, onOpenChange, containerRef]);

    const activeConfig = resolveColumnFilterConfig(config, mode);
    const toggle = config.modeToggle;
    const canToggleMode =
        !!toggle && !!config.modes?.[toggle.mode] && !!onModeChange;

    // const placeholder = searchById ? "Buscar por id..." : config.placeholder;
    // const title = searchById ? "Buscar cliente por id" : config.title;
    // config = {
    //     ...config,
    //     type: searchById ? "number" : "text",
    //     placeholder,
    //     title,
    // };

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
                <div className="table-filter-container">
                    <FilterInput
                        ref={filterFieldRef}
                        columnKey={columnKey}
                        config={activeConfig}
                        value={value}
                        onChange={onChange}
                        onEscapeKeydown={(e) =>
                            e.key === "Escape" && onOpenChange(false)
                        }
                    />
                    {canToggleMode && toggle && (
                        <label className="table-filter-mode-toggle">
                            <input
                                type="checkbox"
                                checked={mode === toggle.mode}
                                onChange={(e) => {
                                    filterFieldRef.current?.focus();
                                    onModeChange?.(
                                        e.target.checked
                                            ? toggle.mode
                                            : undefined,
                                    );
                                }}
                            />
                            <span>{toggle.label}</span>
                        </label>
                    )}
                </div>
            )}
        </>
    );
}

interface FilterInputProps {
    columnKey: string;
    config: ColumnFilterConfig;
    value: FilterValue;
    onChange: (value: FilterValue) => void;
    onEscapeKeydown: (e: React.KeyboardEvent<HTMLElement>) => void;
    ref?: Ref<HTMLInputElement>;
}

function FilterInput({
    columnKey,
    config,
    value,
    onChange,
    onEscapeKeydown,
    ref,
}: FilterInputProps) {
    if (config.type === "select") {
        const entries: Option[] = config.options ?? [];

        const selectedKey =
            entries.find((option) => isSameFilterValue(option.value, value))
                ?.key ?? "";

        return (
            <select
                autoFocus
                className="table-filter-input"
                data-column={columnKey}
                value={selectedKey}
                title={config.title}
                // onChange={(e) => onChange(e.target.value)}
                onChange={(e) => {
                    const selected = entries.find(
                        (o) => o.key === e.target.value,
                    );
                    onChange(selected?.value ?? "");
                }}
                onKeyDown={onEscapeKeydown}
            >
                <option value="">Todos</option>
                {entries.map(({ label, key }) => (
                    // <option key={String(value)} value={value}>
                    <option key={key ?? label} value={key}>
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
            ref={ref}
            autoFocus
            className="table-filter-input"
            data-column={columnKey}
            type={inputType}
            title={config.title}
            placeholder={config.placeholder ?? "Filtrar..."}
            min={inputType === "number" ? config.min : undefined}
            max={inputType === "number" ? config.max : undefined}
            step={inputType === "number" ? config.step : undefined}
            value={typeof value === "string" ? value : ""}
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

function isSameFilterValue(a?: FilterValue, b?: FilterValue): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
        return (
            a.length === b.length && a.every((item, index) => item === b[index])
        );
    }

    return a === b;
}
