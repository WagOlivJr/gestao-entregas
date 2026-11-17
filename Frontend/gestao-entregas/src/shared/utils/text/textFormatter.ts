export function formatZipCode(zipCode: string) {
    return zipCode.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatPhone(phone: string) {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
}

export function normalizeText(text: string) {
    return text
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}
