import { RestaurantOffer } from "@/Features/Details/components/RestaurantOfferCard"

export const restaurantsOffers: RestaurantOffer[] = [
    {
        id: "1",
        discount: "Flat 50% OFF",
        description: "Up to ₹100 on your first order",
        codeText: "welcome50",

        colors: {
            backgroundColor: "#3F2516",
            iconBackgroundColor: "#E8B93F",
            iconColor: "#3F2516",
            dicountColor: "#FFFFFF",
            descriptionColor: "rgba(255, 255, 255, 0.55)",
            codeTextColor: "#FFFFFF",
            copyCodeBackgroundColor: "#E8B93F",
            copyCodeTextColor: "#3F2516"
        }
    },
    {
        id: "2",
        discount: "Free Delivery",
        description: "On orders above ₹199",
        codeText: "freeship",

        colors: {
            backgroundColor: "#FED255",
            iconBackgroundColor: "#3F220B",
            iconColor: "#FFFFFF",
            dicountColor: "#3F220B",
            descriptionColor: "#5A3818",
            codeTextColor: "#3F220B",
            copyCodeBackgroundColor: "#3F220B",
            copyCodeTextColor: "#FFFFFF"
        }
    }
]