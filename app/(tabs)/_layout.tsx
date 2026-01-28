import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import LiquidTabBar from '../../components/LiquidTabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <LiquidTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                // Smooth horizontal slide animation matching the blob speed
                animation: 'shift',
                transitionSpec: {
                    animation: 'spring',
                    config: {
                        damping: 18,      // Same as blob animation
                        stiffness: 150,   // Same as blob animation
                        mass: 0.8,        // Same as blob animation
                    },
                },
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
