import { RestaurantMenuItem } from "@/Features/Details/components/RestaurantMenuItemCard"

export const popularitems: RestaurantMenuItem[] = [
    {
        id: "restaurant-1-paneer-butter-masala",

        restaurant: {
            id: "restaurant-1",
            name: "Brothers Restaurant",
            LogoUrl: null,
            isOpen: true
        },

        name: "Paneer Butter Masala",

        description:
            "Slow-cooked cottage cheese in a rich, creamy tomato gravy",

        imageUrl:
            "https://i.pinimg.com/1200x/75/25/c2/7525c28b815e93b8f4ad4a3bb889090e.jpg",

        price: 380,

        preparationTime: 25,

        deliveryFee: "40",

        isHot: false,

        isAvailable: true,

        isVeg: true,

        tag: "BestSeller",

        rating: 4.5
    },

    {
        id: "restaurant-1-paneer-tikka",

        restaurant: {
            id: "restaurant-1",
            name: "Brothers Restaurant",
            LogoUrl: null,
            isOpen: true
        },

        name: "Paneer Tikka",

        description:
            "Char-grilled paneer with aromatic spices and fresh vegetables",

        imageUrl:
            "https://i.pinimg.com/736x/09/3d/90/093d90af55c44de2226bae7b5a0df7fe.jpg",

        price: 320,

        preparationTime: 20,

        deliveryFee: "40",

        isHot: true,

        isAvailable: false,

        isVeg: true,

        tag: "Popular",

        rating: 4.7
    },

    {
        id: "restaurant-1-dal-makhani",

        restaurant: {
            id: "restaurant-1",
            name: "Brothers Restaurant",
            LogoUrl: null,
            isOpen: true
        },

        name: "Dal Makhani",

        description:
            "Creamy black lentils slow-cooked with butter and aromatic spices",

        imageUrl:
            "https://i.pinimg.com/1200x/ef/6e/1b/ef6e1b22f8de024fc8611bc407b6e761.jpg",

        price: 280,

        preparationTime: 30,

        deliveryFee: "40",

        isHot: false,

        isAvailable: true,

        isVeg: true,

        rating: 4.6
    }
]