import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import { HoldButton } from '../../components/onboarding/HoldButton';
import { CircleExpandTransition } from '../../components/onboarding/CircleExpandTransition';
import Colors from '../../constants/Colors';

// Static number to track - update this periodically
const TOTAL_HOURS_SAVED = 245870;

export default function ReadyToStartScreen() {
  const router = useRouter();
  const [showTransition, setShowTransition] = useState(false);

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowTransition(true);

    // Navigate after transition animation
    setTimeout(() => {
      router.push('/auth/signup');
    }, 800);
  };

  return (
    <AnimatedBackground variant="deepSpace">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerEmoji}>🎉</Text>
            <Text style={styles.title}>You're Almost There!</Text>
          </View>

          {/* Facts */}
          <View style={styles.factsSection}>
            <View style={styles.factCard}>
              <LinearGradient
                colors={['rgba(76, 201, 240, 0.2)', 'rgba(67, 97, 238, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.factGradient}
              >
                <Text style={styles.factIcon}>📊</Text>
                <Text style={styles.factTitle}>32% Reduction</Text>
                <Text style={styles.factDescription}>
                  Our average user cut down social media usage by{' '}
                  <Text style={styles.factHighlight}>32%</Text> in the first week
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.factCard}>
              <LinearGradient
                colors={['rgba(157, 78, 221, 0.2)', 'rgba(107, 76, 230, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.factGradient}
              >
                <Text style={styles.factIcon}>⏰</Text>
                <Text style={styles.factTitle}>
                  {TOTAL_HOURS_SAVED.toLocaleString()} Hours
                </Text>
                <Text style={styles.factDescription}>
                  We've helped our community save over{' '}
                  <Text style={styles.factHighlight}>
                    {TOTAL_HOURS_SAVED.toLocaleString()} hours
                  </Text>{' '}
                  so far
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.factCard}>
              <LinearGradient
                colors={['rgba(255, 107, 107, 0.2)', 'rgba(255, 142, 83, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.factGradient}
              >
                <Text style={styles.factIcon}>🚀</Text>
                <Text style={styles.factTitle}>Real Results</Text>
                <Text style={styles.factDescription}>
                  Join thousands of users who are{' '}
                  <Text style={styles.factHighlight}>taking control</Text> of their time
                  and building better habits
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaQuestion}>
              Are you ready to{'\n'}
              <Text style={styles.ctaHighlight}>Slock In?</Text>
            </Text>

            <View style={styles.holdButtonContainer}>
              <HoldButton
                title="Let's Go!"
                onComplete={handleComplete}
                holdDuration={3000}
                size={200}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Circle Expand Transition */}
      <CircleExpandTransition isActive={showTransition} />
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  headerEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  factsSection: {
    gap: 20,
    marginBottom: 40,
  },
  factCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  factGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  factIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  factTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  factDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
  factHighlight: {
    fontWeight: '700',
    color: '#4CC9F0',
  },
  ctaSection: {
    alignItems: 'center',
    gap: 32,
  },
  ctaQuestion: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
  },
  ctaHighlight: {
    color: '#4CC9F0',
  },
  holdButtonContainer: {
    marginTop: 20,
  },
});
