export type StarType = "full" | "half" | "empty"

export const getRatingStars = (rating: number): StarType[] => {
    const safeRating = Math.max(0, Math.min(5, rating))

    const fullStars = Math.floor(safeRating)
    const hasHalfStar = safeRating % 1 >= 0.5

    return Array.from({ length: 5 }, (_, index) => {
        if (index < fullStars) {
            return "full"
        }

        if (index === fullStars && hasHalfStar) {
            return "half"
        }

        return "empty"
    })
}