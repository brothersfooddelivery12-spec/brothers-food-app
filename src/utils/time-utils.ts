export const formatRestaurantTime = (time?: string | null): string | null => {
    if (!time) {
        return null
    }

    const [hourString, minute = "00"] = time.split(":")

    const hour = Number(hourString)

    if (Number.isNaN(hour)) {
        return null
    }

    const suffix = hour >= 12 ? "PM" : "AM"

    const hour12 = hour % 12 || 12

    return `${hour12}:${minute} ${suffix}`
}