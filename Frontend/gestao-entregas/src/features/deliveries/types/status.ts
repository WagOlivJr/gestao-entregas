export const DELIVERY_STATUSES = [
    "pending",
    "assigned",
    "inProgress",
    "completed",
    "canceled",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const STATUS_LABELS = {
    pending: "Pendente",
    assigned: "Atribuída",
    inProgress: "Em andamento",
    completed: "Concluída",
    canceled: "Cancelada",
} as const satisfies Record<DeliveryStatus, string>;

export const CLOSED_STATUSES = [
    "completed",
    "canceled",
] as const satisfies readonly DeliveryStatus[];

export const STATUSES_SEQUENCE = [
    "pending",
    "assigned",
    "inProgress",
    "completed",
] as const satisfies readonly DeliveryStatus[];

export const STATUSES_TRANSITIONS = {
    pending: ["assigned", "canceled"],
    assigned: ["inProgress", "canceled"],
    inProgress: ["completed", "canceled"],
    completed: [],
    canceled: [],
} as const satisfies Record<DeliveryStatus, readonly DeliveryStatus[]>;
