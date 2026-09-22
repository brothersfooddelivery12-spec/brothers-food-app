export const formatOrderId = (orderId?: string | null) => {
    if (!orderId) {
        return "#BFD"
    }

    // Already formatted by backend
    if (orderId.toUpperCase().startsWith("BFD")) {
        return `#${orderId}`
    }

    const year = new Date().getFullYear()

    const cleanId = orderId.replace(/[^a-zA-Z0-9]/g, "")

    const shortId = cleanId.slice(-5).toUpperCase()

    return `#BFD${year}${shortId}`
}