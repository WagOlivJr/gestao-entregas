import type { Customer } from "../../Customer";

interface Props {
    refreshToken: number;
    onEdit: (customer: Customer) => void;
}

export function CustomersList({ refreshToken, onEdit }: Props) {}
