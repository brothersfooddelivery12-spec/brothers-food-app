export interface Category {
    id: string
    title: string
    imageUri: string
}

export const categories: Category[] = [
    {
        id: "1",
        title: "Burger",
        imageUri: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786039634/file_00000000af94820687c80d62aa094892_h3hh6t.png",
    },
    {
        id: "2",
        title: "Pizza",
        imageUri: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786099332/pixelup_1786098690167_cjhhff.png",
    },
    {
        id: "3",
        title: "Drinks",
        imageUri: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786086834/pixelup_1786041387322_rg3of1.png",
    },
    {
        id: "4",
        title: "Indian",
        imageUri: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786187376/pixelup_1786186816931_jsiv1p.png",
    },
    {
        id: "5",
        title: "South Indian",
        imageUri: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786187363/pixelup_1786186853431_djhto6.png",
    },
    {
        id: "6",
        title: "Desserts",
        imageUri: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786086838/pixelup_1786086251828_goubxl.png",
    },
]