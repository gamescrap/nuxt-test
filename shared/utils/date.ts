export const formatTripDate = (dateStr: string): string => {
    const date = new Date(dateStr)

    const formatted = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    })

    const time = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    })

    const label = formatted.charAt(0).toUpperCase() + formatted.slice(1)
    const isPast = date < new Date()

    return `${isPast ? '[Passé] ' : ''}${label} - ${time}`
}