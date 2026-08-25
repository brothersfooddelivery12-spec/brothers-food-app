export type DeliveryReview = {
    id: string
    rating: number
    timeAgo: string
    review: string
}

export const deliveryReviews: DeliveryReview[] = [
    {
        id: "1",
        rating: 5,
        timeAgo: "2 hours ago",
        review:
            "Very polite and handled the luxury packaging with extreme care. Truly an elite service experience.",
    },
    {
        id: "2",
        rating: 5,
        timeAgo: "1 day ago",
        review:
            "Excellent delivery experience. The order arrived on time and everything was handled carefully.",
    },
    {
        id: "3",
        rating: 4,
        timeAgo: "3 days ago",
        review:
            "Friendly and professional delivery partner. The food arrived safely and was still hot.",
    },
    {
        id: "4",
        rating: 5,
        timeAgo: "1 week ago",
        review:
            "Quick, courteous and careful with the package. Really appreciated the smooth delivery.",
    },
]