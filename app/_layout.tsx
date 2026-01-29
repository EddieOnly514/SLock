import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../hooks/useAuth';
import { AppDataProvider } from '../hooks/useAppData';
import { OnboardingProvider } from '../hooks/useOnboarding';
import { CircleOverlayProvider, useCircleOverlay } from '../hooks/useCircleOverlay';
import CircleExpandOverlay from '../components/CircleExpandOverlay';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isVisible, hideOverlay } = useCircleOverlay();

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />

        {/* Onboarding flow (11 screens) */}
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
        <Stack.Screen name="onboarding/personal-info" />
        <Stack.Screen name="onboarding/analytics-credibility" />
        <Stack.Screen name="onboarding/pricing" />
        <Stack.Screen name="onboarding/completion" />

        <Stack.Screen
          name="(tabs)"
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="circle"
          options={{
            animation: 'none',
            gestureEnabled: false,
          }}
        />
      </Stack>

      {/* Global Circle Overlay - shows on top of any screen */}
      <CircleExpandOverlay visible={isVisible} onClose={hideOverlay} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppDataProvider>
          <OnboardingProvider>
            <CircleOverlayProvider>
              <AppContent />
            </CircleOverlayProvider>
          </OnboardingProvider>
        </AppDataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

