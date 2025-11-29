import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../frontend/src/hooks/useAuth';
import { AppDataProvider } from '../hooks/useAppData';
import { OnboardingProvider } from '../hooks/useOnboarding';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppDataProvider>
          <OnboardingProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />

            {/* New onboarding flow */}
            <Stack.Screen
              name="onboarding/quiz-intro"
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="onboarding/life-satisfaction" />
            <Stack.Screen name="onboarding/goals" />
            <Stack.Screen name="onboarding/chronically-online" />
            <Stack.Screen name="onboarding/social-media-hours" />
            <Stack.Screen name="onboarding/impact-visualization" />
            <Stack.Screen name="onboarding/social-solution" />
            <Stack.Screen name="onboarding/name" />
            <Stack.Screen name="onboarding/gender" />
            <Stack.Screen name="onboarding/age" />
            <Stack.Screen name="onboarding/ready-to-start" />
            <Stack.Screen name="onboarding/pricing" />

            {/* Legacy onboarding screens (kept for compatibility) */}
            <Stack.Screen name="onboarding/personal-info" />
            <Stack.Screen name="onboarding/analytics-credibility" />

            {/* Old onboarding screens (can be removed later) */}
            <Stack.Screen
              name="onboarding/welcome"
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="onboarding/select-apps" />
            <Stack.Screen name="onboarding/time-analysis" />
            <Stack.Screen name="onboarding/create-profile" />
            <Stack.Screen name="onboarding/add-friends" />

            <Stack.Screen
              name="(tabs)"
              options={{ gestureEnabled: false }}
            />
          </Stack>
        </OnboardingProvider>
      </AppDataProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
