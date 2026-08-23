import { RestaurantReview } from "@/Features/Review/components/RestaurantReviewCard";

export const customerReviews: RestaurantReview[] = [
    {
        id: "1",
        name: "Aarav Sharma",
        image: "https://i.pravatar.cc/150?img=12",
        rating: 4.5,
        review: "The food was absolutely delicious and arrived fresh. Loved the presentation too!",
        photos: [
            "https://i.pinimg.com/736x/54/17/df/5417df0fd05167825db12240bd471666.jpg",
            "https://i.pinimg.com/736x/d2/ae/bd/d2aebd7b10616a06b6d519d3fbf69d1e.jpg",
        ],
        date: "2 days ago",
        badge: "Foodie",
    },
    {
        id: "2",
        name: "Priya Mehta",
        image: "https://i.pravatar.cc/150?img=47",
        rating: 5,
        review: "Really tasty food and the packaging was excellent. Everything arrived perfectly packed.",
        photos: [
            "https://i.pinimg.com/736x/fe/0c/63/fe0c635eb8a9a7b0b8ea530519746cba.jpg",
            "https://i.pinimg.com/736x/4a/3b/9d/4a3b9d46d9cd3eb4bc5f5a21e17736cc.jpg",
            "https://i.pinimg.com/736x/96/9f/1f/969f1f2234b93eca4a90e67ad8f7eb5b.jpg",
        ],
        date: "5 days ago",
        badge: "Regular",
    },
]