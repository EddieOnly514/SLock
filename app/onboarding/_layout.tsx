import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade', // Calm, non-bouncy transition
                animationDuration: 400, // Slightly slower than default 350ms
            }}
        >
            <Stack.Screen name="quiz-intro" />
            <Stack.Screen name="life-satisfaction" />
            <Stack.Screen name="goals" />
            <Stack.Screen name="chronically-online" />
            <Stack.Screen name="social-media-hours" />
            <Stack.Screen name="impact-visualization" />
            <Stack.Screen name="social-solution" />
            <Stack.Screen name="personal-info" />
            <Stack.Screen name="analytics-credibility" />
            <Stack.Screen name="pricing" />
            <Stack.Screen name="completion" />
        </Stack>
    );
}
