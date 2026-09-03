import { NearByRestaurants } from "@/Features/Home/components/NearByRestaurants";

export const nearByRestaurants: NearByRestaurants[] = [
    {
        id: "1",
        name: "The Breakfast Club",
        imageUri:
            "https://i.pinimg.com/1200x/76/a4/da/76a4dab7a47278d617960cd77347b217.jpg",
        cuisines: "American • Pancakes • Coffee",
        rating: 4.5,
        distance: "2.5 km away",
        discount: "20% OFF",
        priceForTwo: 350,
        isActive: false
    },
    {
        id: "2",
        name: "Royal Spice Kitchen",
        imageUri:
            "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786697794/ChatGPT_Image_Aug_14_2026_02_25_41_PM_jqsknv.png",
        cuisines: "North Indian • Mughlai • Tandoor",
        rating: 4.7,
        distance: "1.8 km away",
        discount: "30% OFF",
        priceForTwo: 500,
        isActive: true
    },
    {
        id: "3",
        name: "Mizu Sushi House",
        imageUri:
            "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786697794/ChatGPT_Image_Aug_14_2026_02_25_41_PM_jqsknv.png",
        cuisines: "Japanese • Seafood • Fine Dining",
        rating: 4.5,
        distance: "3.2 km away",
        discount: "15% OFF",
        priceForTwo: 700,
        isActive: false
    },
    {
        id: "4",
        name: "The Green Leaf",
        imageUri:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        cuisines: "Healthy • Salads • Vegan",
        rating: 4.6,
        distance: "2.1 km away",
        discount: "25% OFF",
        priceForTwo: 400,
        isActive: true
    }
]