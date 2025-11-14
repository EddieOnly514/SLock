import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import Colors from '../constants/Colors';

/**
 * App Entry Point / Splash Screen
 *
 * TEMPORARY: Bypassing auth/onboarding for testing core features
 * TODO: Re-enable auth by uncommenting the original logic
 */
export default function Index() {
  const router = useRouter();
  // const { user, isLoading, isOnboarded } = useAuth();

  useEffect(() => {
    // TEMPORARY: Skip auth and go directly to main app
    setTimeout(() => {
      router.replace('/(tabs)/lock');
    }, 500);

    /* ORIGINAL AUTH LOGIC - Uncomment to re-enable:
    if (!isLoading) {
      checkAuthState();
    }
    */
  }, []);

  /* ORIGINAL checkAuthState function - Uncomment to re-enable:
  const checkAuthState = () => {
    if (!user) {
      router.replace('/onboarding/quiz-intro');
    } else if (!isOnboarded) {
      router.replace('/onboarding/quiz-intro');
    } else {
      router.replace('/(tabs)/lock');
    }
  };
  */

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary[500]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
});
