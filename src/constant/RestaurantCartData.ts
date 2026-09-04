import { RestaurantCart } from "@/Features/Cart/Components/RestaurantCartCard";

export const CART_DATA: RestaurantCart[] = [
    {
        id: "restaurant-1",
        restaurantName: "The Heritage Kitchen",
        restaurantImage:
            "https://i.pinimg.com/736x/04/5c/e2/045ce255f197758acff31daef213e62d.jpg",
        deliveryTime: "20-25 mins",
        deliveryFee: 40,

        isActiveCart: true,
        isActive: true,

        items: [
            {
                id: "item-1",
                name: "Paneer Butter Masala",
                image:
                    "https://i.pinimg.com/736x/cd/18/67/cd18679d709328ea1347af0f30f748d5.jpg",
                quantity: 1,
                price: 250,
                description:
                    "Large • Extra Cheese • Less Spicy",
                isActive: true
            },
            {
                id: "item-2",
                name: "Paneer Tikka",
                image:
                    "https://i.pinimg.com/736x/50/9c/d4/509cd4ca90c727994e5da18bc9f81472.jpg",
                quantity: 2,
                price: 220,
                description:
                    "Medium • Mint Chutney • Less Spicy",

                // example unavailable item
                isActive: false
            },
            {
                id: "item-3",
                name: "Butter Naan",
                image:
                    "https://i.pinimg.com/1200x/20/a7/46/20a74647c2402763ed0b8745dc020f89.jpg",
                quantity: 3,
                price: 60,
                description:
                    "Butter • Soft & Fresh",
                isActive: true
            }
        ]
    },

    {
        id: "restaurant-2",
        restaurantName: "Spice Route",
        restaurantImage:
            "https://i.pinimg.com/736x/78/bd/2b/78bd2b1e18685a367e232897a350ec1b.jpg",
        deliveryTime: "25-30 mins",
        deliveryFee: 0,

        isActiveCart: false,

        // restaurant unavailable
        isActive: false,

        items: [
            {
                id: "item-4",
                name: "Dal Makhani",
                image:
                    "https://i.pinimg.com/1200x/1b/cd/44/1bcd442d356a29a1160d4741df821d94.jpg",
                quantity: 1,
                price: 190,
                description:
                    "Regular • Butter • Medium Spicy",
                isActive: true
            },
            {
                id: "item-5",
                name: "Garlic Naan",
                image:
                    "https://i.pinimg.com/1200x/f6/7a/5f/f67a5ffe6da2b4933e8cc488268ecb1b.jpg",
                quantity: 2,
                price: 70,
                description:
                    "Extra Garlic • Butter",
                isActive: true
            }
        ]
    },

    {
        id: "restaurant-3",
        restaurantName: "Royal Thali House",
        restaurantImage:
            "https://i.pinimg.com/736x/f3/98/b5/f398b5ab4c39d52808509349d2fb44bc.jpg",
        deliveryTime: "30-35 mins",
        deliveryFee: 30,

        isActiveCart: false,
        isActive: true,

        items: [
            {
                id: "item-6",
                name: "Special Rajasthani Thali",
                image:
                    "https://i.pinimg.com/736x/bb/04/d3/bb04d33e1e709e160f9c783b2c4ef934.jpg",
                quantity: 1,
                price: 399,
                description:
                    "Dal • Baati • Churma • Gatte",
                isActive: true
            },
            {
                id: "item-7",
                name: "Masala Chaas",
                image:
                    "https://i.pinimg.com/236x/d1/20/d7/d120d7dff135bc749d59a1ace18e9ad4.jpg",
                quantity: 2,
                price: 60,
                description:
                    "Chilled • Masala • Fresh",
                isActive: true
            }
        ]
    }
]