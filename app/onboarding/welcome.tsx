import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.placeholderIllustration}>
            <Text style={styles.placeholderText}>🌳</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to SLock!</Text>
          <Text style={styles.subtitle}>
            Build healthier phone habits with friends. Lock distracting apps,
            grow your tree, and compete for better focus.
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding/select-apps')}
            fullWidth
          />
          <Text style={styles.disclaimer}>
            We need permission to track app usage to help you stay focused
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.xl,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIllustration: {
    width: 200,
    height: 200,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  textContainer: {
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: Theme.spacing.md,
  },
  disclaimer: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
