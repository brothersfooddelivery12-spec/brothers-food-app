export type PastOrderItem = {
    name: string
    quantity: number
}

export type PastOrder = {
    id: string
    restaurantName: string
    restaurantImage: string
    orderId: string
    status: "Delivered" | "Cancelled"
    orderDate: string
    orderTime: string
    deliveryTime: string
    items: PastOrderItem[]
}

export const pastOrders: PastOrder[] = [
    {
        id: "1",
        restaurantName: "Biryani House",
        restaurantImage:
            "https://i.pinimg.com/736x/44/6b/d0/446bd03fd3235b68282c79eb04bc5c37.jpg",
        orderId: "BFD202601248",
        status: "Delivered",
        orderDate: "22 Aug 2026",
        orderTime: "8:42 PM",
        deliveryTime: "24 mins",
        items: [
            {
                name: "Chicken Biryani",
                quantity: 1,
            },
            {
                name: "Chicken Seekh Kebab",
                quantity: 1,
            },
            {
                name: "Raita",
                quantity: 2,
            },
        ],
    },

    {
        id: "2",
        restaurantName: "The Burger Point",
        restaurantImage:
            "https://i.pinimg.com/736x/36/b7/fa/36b7fa818d446a5ccba21e95f2e738b0.jpg",
        orderId: "BFD202601243",
        status: "Delivered",
        orderDate: "20 Aug 2026",
        orderTime: "7:18 PM",
        deliveryTime: "31 mins",
        items: [
            {
                name: "Chicken Burger",
                quantity: 2,
            },
            {
                name: "Peri Peri Fries",
                quantity: 1,
            },
            {
                name: "Coke",
                quantity: 2,
            },
        ],
    },

    {
        id: "3",
        restaurantName: "Spice Villa",
        restaurantImage:
            "https://i.pinimg.com/736x/0c/ed/b0/0cedb031dd636fd1a11948f97fc3d89a.jpg",
        orderId: "BFD202601241",
        status: "Cancelled",
        orderDate: "18 Aug 2026",
        orderTime: "9:05 PM",
        deliveryTime: "28 mins",
        items: [
            {
                name: "Paneer Tikka",
                quantity: 1,
            },
            {
                name: "Butter Naan",
                quantity: 2,
            },
            {
                name: "Dal Makhani",
                quantity: 1,
            },
        ],
    },
]