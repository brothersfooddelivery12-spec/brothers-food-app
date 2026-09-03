import { FoodItem } from "@/Features/Home/components/FoodCard";

export const foodItems: FoodItem[] = [
    {
        id: "1",
        name: "Molten Lava Cake",
        imageUri:
            "https://i.pinimg.com/1200x/a9/83/9b/a9839b03e1ed4776f586c3200903ce7b.jpg",
        category: "Bakery • Dessert",
        price: 249,
        isHot: true,
        isActive: true
    },
    {
        id: "2",
        name: "Paneer Tikka",
        imageUri:
            "https://i.pinimg.com/736x/50/9c/d4/509cd4ca90c727994e5da18bc9f81472.jpg",
        category: "North Indian • Starter",
        price: 229,
        isHot: false,
        isActive: false
    },
    {
        id: "3",
        name: "Masala Dosa",
        imageUri:
            "https://i.pinimg.com/1200x/61/23/74/612374b37b28b6790d6fbcb2ab5e8f82.jpg",
        category: "South Indian • Breakfast",
        price: 149,
        isHot: true,
        isActive: false
    },
    {
        id: "4",
        name: "Margherita Pizza",
        imageUri:
            "https://i.pinimg.com/736x/9d/2f/62/9d2f62b46c1a23bd26df0d455c3a388f.jpg",
        category: "Italian • Pizza",
        price: 299,
        isHot: false,
        isActive: true
    },
]