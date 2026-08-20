import BottomTabBar from "@/components/BottomTabBar"
import { Tabs } from "expo-router"

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                }}
            />

            <Tabs.Screen
                name="favourite"
                options={{
                    title: "Favourite",
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                }}
            />

            <Tabs.Screen
                name="order"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    )
}