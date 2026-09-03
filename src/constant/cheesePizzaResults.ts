import { FoodSearchCardProps } from "@/Features/Search/Components/FoodSearchCard";

export const cheesePizzaResults: FoodSearchCardProps[] = [
    {
        id: "1",
        name: "Classic Cheese Pizza",
        restaurant: "Pizza House",
        rating: 4.8,
        deliveryTime: "25 mins",
        price: 299,
        discount: "30% OFF",
        image: "https://i.pinimg.com/1200x/5b/b8/3b/5bb83ba7b2e8a806999b43ce8c95bd02.jpg",
        isFavourite: true,
        isActive: true
    },
    {
        id: "2",
        name: "Cheesy Margherita Pizza",
        restaurant: "Oven Story",
        rating: 4.7,
        deliveryTime: "30 mins",
        price: 279,
        discount: "20% OFF",
        image: "https://i.pinimg.com/736x/26/54/df/2654df80a6505498f70ecd5739c2ec29.jpg",
        isFavourite: false,
        isActive: false
    },
    {
        id: "3",
        name: "Double Cheese Pizza",
        restaurant: "La Pino's Pizza",
        rating: 4.6,
        deliveryTime: "28 mins",
        price: 349,
        discount: "25% OFF",
        image: "https://i.pinimg.com/736x/0b/05/92/0b0592552e242329ac6f8c7554a6162a.jpg",
        isFavourite: false,
        isActive: true
    },
    // {
    //     name: "Four Cheese Pizza",
    //     restaurant: "The Pizza Kitchen",
    //     rating: 4.9,
    //     deliveryTime: "32 mins",
    //     price: 399,
    //     discount: "30% OFF",
    //     image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    //     isFavourite: false,
    // },
    // {
    //     name: "Cheese Burst Pizza",
    //     restaurant: "Pizza Point",
    //     rating: 4.5,
    //     deliveryTime: "24 mins",
    //     price: 329,
    //     discount: "15% OFF",
    //     image: "https://images.unsplash.com/photo-1578001004622-7c1b4d5a1b6e",
    //     isFavourite: false,
    // },
]