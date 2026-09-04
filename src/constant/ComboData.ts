export type ComboItem = {
    id: string
    name: string
    description: string
    badge?: string
    price: number
    originalPrice?: number
    imageUri: string
    isActive?: boolean
}

export const COMBO_OFFERS: ComboItem[] = [
    {
        id: "1",
        name: "Grand Feast for Two",
        description: "2 Burgers + 1 Large Peri-Peri Fries + 2 Mocktails",
        badge: "Special",
        price: 899,
        originalPrice: 1260,
        imageUri:
            "https://i.pinimg.com/1200x/c9/0e/be/c90ebe2b0a333c71463f4f4aac17d837.jpg",
        isActive: true
    },
    {
        id: "2",
        name: "Burger Buddy Combo",
        description: "2 Classic Burgers + 1 Medium Fries + 2 Cold Drinks",
        badge: "Bestseller",
        price: 649,
        originalPrice: 899,
        imageUri:
            "https://i.pinimg.com/736x/99/bd/ed/99bded8d4b2b6479969de1d596dee62f.jpg",
        isActive: false
    },
    {
        id: "3",
        name: "Family Feast",
        description: "4 Burgers + 2 Large Fries + 4 Cold Drinks",
        badge: "Family Deal",
        price: 1299,
        originalPrice: 1699,
        imageUri:
            "https://i.pinimg.com/736x/94/88/f1/9488f100fe6bde12663800225d762da4.jpg",
        isActive: true
    },
    {
        id: "4",
        name: "Snack Attack Combo",
        description: "1 Burger + Peri-Peri Fries + Garlic Bread + Cold Drink",
        badge: "Value Deal",
        price: 449,
        originalPrice: 599,
        imageUri:
            "https://i.pinimg.com/736x/69/40/b9/6940b918fd1ddc0c9e382baa2bbd28cd.jpg",
        isActive: true
    },
]