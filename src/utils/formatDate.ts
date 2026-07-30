export function formatDate(timestamp?: number) {
    if (!timestamp) return '-'

    return new Date(timestamp * 1000).toLocaleDateString('pt-BR')
}