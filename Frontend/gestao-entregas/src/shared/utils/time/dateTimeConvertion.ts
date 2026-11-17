export function toDDMMYYYYYHHMM(rawDate?: string | Date | null) {
    if (!rawDate) return;
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };
    const date = toBrasiliaTimeZone(rawDate);
    return new Intl.DateTimeFormat("pt-BR", options)
        .format(date)
        .replace(":", "h")
        .replace(",", " -");
}

export function toDDMMYYYY(rawDate?: string | Date) {
    if (!rawDate) return;
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
    };
    const date = toBrasiliaTimeZone(rawDate);
    return (
        new Intl.DateTimeFormat("pt-BR", options)
            .format(date)
            // .replace(":", "h")
            .replace(",", " -")
    );
}

function toBrasiliaTimeZone(dateInput: string | Date) {
    if (!dateInput) return;

    const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };

    return new Date(date.toLocaleString("en-US", options));
}

export function parseApiDate(
    value: string,
    field: string,
    checkDateOnly?: boolean,
): Date {
    if (checkDateOnly) {
        const dateOnlyMatch = /^(\d{4})[\/-](\d{2})[\/-](\d{2})$/.exec(
            value.trim(),
        );

        if (dateOnlyMatch) {
            const year = Number(dateOnlyMatch[1]);
            const month = Number(dateOnlyMatch[2]);
            const day = Number(dateOnlyMatch[3]);

            const localDate = new Date(year, month - 1, day);

            if (
                Number.isNaN(localDate.getTime()) ||
                localDate.getFullYear() !== year ||
                localDate.getMonth() !== month - 1 ||
                localDate.getDate() !== day
            ) {
                throw new Error(`Data inválida recebida da API: ${field}`);
            }

            return localDate;
        }
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Data inválida recebida da API: ${field}`);
    }

    return date;
}

export function parseOptionalApiDate(
    value: string | null | undefined,
    field: string,
): Date | null {
    return !value ? null : parseApiDate(value, field);
}
