export interface Addon {
    id: number
    title: string
    description: string
    price: number
}

export const addons: Addon[] = [
    {
        id: 1,
        title: "Extra Black Truffle Shavings",
        description: "+ 5g Perigord",
        price: 40,
    },
    {
        id: 2,
        title: "Caramelized Onion Jam",
        description: "Balsamic reduction",
        price: 30,
    },
    {
        id: 3,
        title: "Double Wagyu Patty",
        description: "Add another 200g",
        price: 120,
    },
    {
        id: 4,
        title: "Smoked Cheddar Cheese",
        description: "Aged smoked cheddar",
        price: 50,
    },
]