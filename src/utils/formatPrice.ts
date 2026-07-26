export function formatPrice(
    value: number,
    locale: string,
    currency: string
) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value / 100);
}