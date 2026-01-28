import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function CircleLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.primary[500] },
            }}
        >
            <Stack.Screen name="basics" options={{ animation: 'fade' }} />
            <Stack.Screen name="focus-rules" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="active" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="join" options={{ animation: 'fade' }} />
        </Stack>
    );
}
