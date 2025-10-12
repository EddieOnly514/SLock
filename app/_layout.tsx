import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
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
    </>
  );
}
