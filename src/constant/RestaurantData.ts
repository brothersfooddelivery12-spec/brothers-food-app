import { Restaurants } from "@/components/RestaurantCard"

export const restaurants: Restaurants[] = [
    {
        id: "1",
        name: "Mizu Sushi House",

        imageUrl:
            "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786697794/ChatGPT_Image_Aug_14_2026_02_25_41_PM_jqsknv.png",

        cuisines:
            "Japanese • Seafood • Fine Dining",

        rating: 4.5,

        deliveryFee: 40,
        deliveryTime: 30,

        distance: "1.8",

        discount: "20% OFF",

        priceForTwo: 700,

        isOpen: true
    },

    {
        id: "2",
        name: "Royal Spice Kitchen",

        imageUrl:
            "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786701932/ChatGPT_Image_Aug_14_2026_03_34_39_PM_z7lyws.png",

        cuisines:
            "North Indian • Mughlai • Tandoor",

        rating: 4.7,

        deliveryFee: 0,
        deliveryTime: 20,

        distance: "2.4",

        discount: null,

        priceForTwo: 500,

        isOpen: false
    },

    {
        id: "3",
        name: "The Curry Table",

        imageUrl:
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe",

        cuisines:
            "Indian • Punjabi • North Indian",

        rating: 4.6,

        deliveryFee: 30,
        deliveryTime: 25,

        distance: "1.2",

        discount: "15% OFF",

        priceForTwo: 600,

        isOpen: true
    },

    {
        id: "4",
        name: "Green Leaf Bistro",

        imageUrl:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999",

        cuisines:
            "Vegetarian • Healthy • Indian",

        rating: 4.4,

        deliveryFee: 0,
        deliveryTime: 20,

        distance: "3.1",

        discount: null,

        priceForTwo: 450,

        isOpen: true
    },

    {
        id: "5",
        name: "Royal Tandoor",

        imageUrl:
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641",

        cuisines:
            "North Indian • Tandoor • Mughlai",

        rating: 4.8,

        deliveryFee: 25,
        deliveryTime: 30,

        distance: "2.7",

        discount: "10% OFF",

        priceForTwo: 750,

        isOpen: true
    },

    {
        id: "6",
        name: "Spice Garden",

        imageUrl:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950",

        cuisines:
            "Indian • Street Food • Snacks",

        rating: 4.5,

        deliveryFee: 20,
        deliveryTime: 15,

        distance: "1.5",

        discount: null,

        priceForTwo: 350,

        isOpen: true
    }
]