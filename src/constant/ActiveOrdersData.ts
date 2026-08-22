export type OrderItem = {
    name: string
    quantity: number
}

export type Order = {
    id: string
    restaurantName: string
    restaurantImage: string
    orderId: string
    status: string
    eta: string
    activeStep: number
    items: OrderItem[]
}

export const activeorders: Order[] = [
    {
        id: "1",
        restaurantName: "The Burger Point",
        restaurantImage:
            "https://i.pinimg.com/736x/36/b7/fa/36b7fa818d446a5ccba21e95f2e738b0.jpg",
        orderId: "BFD202601245",
        status: "Picked Up",
        eta: "18 mins",
        activeStep: 2,
        items: [
            {
                name: "Chicken Burger",
                quantity: 2,
            },
            {
                name: "Fries",
                quantity: 1,
            },
        ],
    },

    {
        id: "2",
        restaurantName: "Spice Villa",
        restaurantImage:
            "https://i.pinimg.com/736x/0c/ed/b0/0cedb031dd636fd1a11948f97fc3d89a.jpg",
        orderId: "BFD202601246",
        status: "Preparing",
        eta: "32 mins",
        activeStep: 1,
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

    {
        id: "3",
        restaurantName: "Pizza Hub",
        restaurantImage:
            "https://i.pinimg.com/736x/44/6b/d0/446bd03fd3235b68282c79eb04bc5c37.jpg",
        orderId: "BFD202601247",
        status: "Out for Delivery",
        eta: "8 mins",
        activeStep: 3,
        items: [
            {
                name: "Farmhouse Pizza",
                quantity: 1,
            },
            {
                name: "Garlic Bread",
                quantity: 1,
            },
            {
                name: "Coke",
                quantity: 2,
            },
        ],
    },

    // {
    //     id: "4",
    //     restaurantName: "Biryani House",
    //     restaurantImage:
    //         "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500",
    //     orderId: "BFD202601248",
    //     status: "Confirmed",
    //     eta: "42 mins",
    //     activeStep: 0,
    //     items: [
    //         {
    //             name: "Chicken Biryani",
    //             quantity: 1,
    //         },
    //         {
    //             name: "Chicken Seekh Kebab",
    //             quantity: 1,
    //         },
    //         {
    //             name: "Raita",
    //             quantity: 2,
    //         },
    //     ],
    // },
]