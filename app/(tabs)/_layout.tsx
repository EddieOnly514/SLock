import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import LiquidTabBar from '../../components/LiquidTabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <LiquidTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                // No screen transition animation - instant switch
                animation: 'none',
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />

            {/* Friends Tab */}
            <Tabs.Screen
                name="friends"
                options={{
                    title: 'Friends',
                }}
            />

            {/* Create Circle Tab (Center Button) */}
            <Tabs.Screen
                name="create"
                options={{
                    title: '',
                }}
            />

            {/* Rewards Tab */}
            <Tabs.Screen
                name="rewards"
                options={{
                    title: 'Rewards',
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />

            {/* Hidden legacy tabs */}
            <Tabs.Screen name="social" options={{ href: null }} />
            <Tabs.Screen name="me" options={{ href: null }} />
            <Tabs.Screen name="apps" options={{ href: null }} />
            <Tabs.Screen name="settings" options={{ href: null }} />
            <Tabs.Screen name="lock" options={{ href: null }} />
        </Tabs>
    );
}
