export interface Restaurant {
  id: string
  name: string
  imageUri: string
  rating: number
  cuisines: string[]
  deliveryFee: number
  deliveryTime: string
  priceForTwo: number,
  isFavourite: boolean
  isActive?: boolean
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Mizu Sushi House",
    imageUri:
      "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786697794/ChatGPT_Image_Aug_14_2026_02_25_41_PM_jqsknv.png",
    rating: 4.5,
    cuisines: ["Japanese", "Seafood", "Fine Dining"],
    deliveryFee: 40,
    deliveryTime: "30–35 min",
    priceForTwo: 700,
    isFavourite: false,
    isActive: true
  },
  {
    id: "2",
    name: "Royal Spice Kitchen",
    imageUri:
      "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786701932/ChatGPT_Image_Aug_14_2026_03_34_39_PM_z7lyws.png",
    rating: 4.7,
    cuisines: ["North Indian", "Mughlai", "Tandoor"],
    deliveryFee: 0,
    deliveryTime: "20–25 min",
    priceForTwo: 500,
    isFavourite: true,
    isActive: false
  },
//   {
//     id: "3",
//     name: "The Curry Table",
//     imageUri:
//       "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
//     rating: 4.6,
//     cuisines: ["Indian", "Punjabi", "North Indian"],
//     deliveryFee: 30,
//     deliveryTime: "25–30 min",
//     priceForTwo: 600,
//   },
//   {
//     id: "4",
//     name: "Green Leaf Bistro",
//     imageUri:
//       "https://images.unsplash.com/photo-1540420773420-3366772f4999",
//     rating: 4.4,
//     cuisines: ["Vegetarian", "Healthy", "Indian"],
//     deliveryFee: 0,
//     deliveryTime: "20–25 min",
//     priceForTwo: 450,
//   },
//   {
//     id: "5",
//     name: "Royal Tandoor",
//     imageUri:
//       "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
//     rating: 4.8,
//     cuisines: ["North Indian", "Tandoor", "Mughlai"],
//     deliveryFee: 25,
//     deliveryTime: "30–35 min",
//     priceForTwo: 750,
//   },
//   {
//     id: "6",
//     name: "Spice Garden",
//     imageUri:
//       "https://images.unsplash.com/photo-1601050690597-df0568f70950",
//     rating: 4.5,
//     cuisines: ["Indian", "Street Food", "Snacks"],
//     deliveryFee: 20,
//     deliveryTime: "15–20 min",
//     priceForTwo: 350,
//   },
]