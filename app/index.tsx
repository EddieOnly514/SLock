import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

/**
 * App Entry Point / Splash Screen
 *
 * Checks authentication state and redirects accordingly:
 * - If logged in + onboarded -> (tabs)
 * - If logged in but not onboarded -> onboarding/welcome
 * - If not logged in -> auth/login
 */
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    // TODO: Check AsyncStorage for auth token and onboarding status
    // For now, we'll just redirect to login after a brief delay
    setTimeout(() => {
      router.replace('/auth/login');
    }, 1000);
  };

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
    backgroundColor: Colors.background,
  },
});
