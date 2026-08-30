export type NotificationGroup =
    | "Today"
    | "Yesterday"
    | "Earlier"

export const getNotificationGroup = (dateString: string): NotificationGroup => {
    const notificationDate = new Date(dateString)
    const today = new Date()

    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    )

    const startOfYesterday = new Date(startOfToday)

    startOfYesterday.setDate(
        startOfYesterday.getDate() - 1
    )

    const notificationDay = new Date(
        notificationDate.getFullYear(),
        notificationDate.getMonth(),
        notificationDate.getDate()
    )

    if (
        notificationDay.getTime() ===
        startOfToday.getTime()
    ) {
        return "Today"
    }

    if (
        notificationDay.getTime() ===
        startOfYesterday.getTime()
    ) {
        return "Yesterday"
    }

    return "Earlier"
}

export const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    const diffMs = now.getTime() - date.getTime()

    const diffMinutes = Math.floor(diffMs / 60000)

    const diffHours = Math.floor(diffMinutes / 60)

    if (diffMinutes < 1) {
        return "Just now"
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`
    }

    if (diffHours < 24) {
        return `${diffHours}h ago`
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })
}