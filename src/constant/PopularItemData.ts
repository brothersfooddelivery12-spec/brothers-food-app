import { PopularItem } from "@/Features/Details/components/PopularItemCard"

export const popularitems: PopularItem[] = [
    {
        id: "restaurant-1-paneer-butter-masala",
        restaurantId: "restaurant-1",

        name: "Paneer Butter Masala",
        description:
            "Slow-cooked cottage cheese in a rich, creamy tomato gravy",

        imageUri:
            "https://i.pinimg.com/1200x/75/25/c2/7525c28b815e93b8f4ad4a3bb889090e.jpg",

        rating: 4.5,
        price: 380,
        tag: "BestSeller",
        isActive: true
    },
    {
        id: "restaurant-1-paneer-tikka",
        restaurantId: "restaurant-1",

        name: "Paneer Tikka",
        description:
            "Char-grilled paneer with aromatic spices and fresh vegetables",

        imageUri:
            "https://i.pinimg.com/736x/09/3d/90/093d90af55c44de2226bae7b5a0df7fe.jpg",

        rating: 4.7,
        price: 320,
        tag: "Popular",
        isActive: false
    },
    {
        id: "restaurant-1-dal-makhani",
        restaurantId: "restaurant-1",

        name: "Dal Makhani",
        description:
            "Creamy black lentils slow-cooked with butter and aromatic spices",

        imageUri:
            "https://i.pinimg.com/1200x/ef/6e/1b/ef6e1b22f8de024fc8611bc407b6e761.jpg",

        rating: 4.6,
        price: 280,
        isActive: true
    }
]