import {
    DELIVERY_STATUSES,
    type DeliveryStatus,
} from "../../../features/deliveries/types/status";
import type { BasicEntityStatus } from "../../types/status";

export function readString(fd: FormData, key: string): string {
    const v = fd.get(key);
    return typeof v === "string" ? v : "";
}

export function readOptionalString(fd: FormData, key: string): string | null {
    const v = readString(fd, key).trim();
    return v === "" ? null : v;
}

export function parseNullableNumber(value: string): number | null {
    const t = value.trim();
    if (t === "") return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
}

export function parseEntityStatus(
    value: unknown,
): BasicEntityStatus | undefined {
    if (typeof value !== "string") return undefined;

    return value === "active" || value === "inactive" ? value : undefined;
}

export function parseDeliveryStatus(
    value: unknown,
): DeliveryStatus | undefined {
    if (typeof value !== "string") return undefined;

    return DELIVERY_STATUSES.includes(value as DeliveryStatus)
        ? (value as DeliveryStatus)
        : undefined;
}

export function parseNullableDate(value: unknown): Date | null {
    if (typeof value !== "string") return null;
    const t = value.trim();
    if (t === "") return null;

    const date = new Date(t);

    return Number.isNaN(date.getTime()) ? null : date;
}
