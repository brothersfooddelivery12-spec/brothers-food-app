export type RestaurantInfo = {
    id: string
    name: string
    imageUri: string
    deliveryTime: string
    deliveryFee: number
    isActive: boolean
}

export const RESTAURANTS: RestaurantInfo[] = [
    {
        id: "restaurant-1",
        name: "The Heritage Kitchen",
        imageUri:
            "https://i.pinimg.com/736x/04/5c/e2/045ce255f197758acff31daef213e62d.jpg",
        deliveryTime: "20-25 mins",
        deliveryFee: 30,
        isActive: true
    },
    {
        id: "restaurant-2",
        name: "Spice Route",
        imageUri:
            "https://i.pinimg.com/736x/78/bd/2b/78bd2b1e18685a367e232897a350ec1b.jpg",
        deliveryTime: "25-30 mins",
        deliveryFee: 40,
        isActive: true
    },
    {
        id: "restaurant-3",
        name: "Royal Thali House",
        imageUri:
            "https://i.pinimg.com/736x/f3/98/b5/f398b5ab4c39d52808509349d2fb44bc.jpg",
        deliveryTime: "20-30 mins",
        deliveryFee: 20,
        isActive: true
    }
]