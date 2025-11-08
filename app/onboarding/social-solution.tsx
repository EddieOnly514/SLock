import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { TooltipCard } from '../../components/onboarding/TooltipCard';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const features = [
  {
    emoji: '🎯',
    title: 'Social Accountability',
    description: 'Friends keep you on track',
    elaboration: 'Connect with friends who share your goals. When you know someone else is watching your progress, you\'re 3x more likely to stick to your commitments. Your accountability partners will check in, celebrate wins, and help you stay focused.',
  },
  {
    emoji: '🔥',
    title: 'Friendly Competition',
    description: 'Turn progress into a game',
    elaboration: 'Climb the leaderboards and see how you stack up against friends. Earn streaks for consecutive focused days, unlock badges for milestones, and compete in weekly challenges. Make productivity addictive, not social media.',
  },
  {
    emoji: '⚡',
    title: 'Real-Time Motivation',
    description: 'Get instant support when you need it',
    elaboration: 'Struggling to stay off your phone? Send a quick SOS to your accountability group and get instant motivation. See when your friends are staying strong, and cheer them on. You\'re never alone in this journey.',
  },
  {
    emoji: '🌟',
    title: 'Collective Growth',
    description: 'Achieve more together',
    elaboration: 'Track your group\'s combined hours saved and watch the impact multiply. Unlock exclusive group challenges and rewards. When one person succeeds, everyone celebrates. Rise together, not alone.',
  },
];

export default function SocialSolutionScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboarding();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(7);
    router.push('/onboarding/name');
  };

  return (
    <AnimatedBackground variant="deepSpace">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={6} totalSteps={11} />

        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.headerEmoji}>✨</Text>
              <Text style={styles.title}>How SLock Helps You</Text>
              <Text style={styles.subtitle}>
                Break free from distractions with the power of{'\n'}
                <Text style={styles.subtitleHighlight}>social accountability</Text>
              </Text>
            </View>

            {/* Features with tap tooltips */}
            <View style={styles.featuresSection}>
              {features.map((feature, index) => (
                <TooltipCard
                  key={index}
                  emoji={feature.emoji}
                  title={feature.title}
                  description={feature.description}
                  elaboration={feature.elaboration}
                />
              ))}
            </View>

            {/* Stats badge */}
            <View style={styles.statsBadge}>
              <LinearGradient
                colors={['rgba(107, 76, 230, 0.25)', 'rgba(157, 78, 221, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statsGradient}
              >
                <Text style={styles.statsNumber}>78%</Text>
                <Text style={styles.statsText}>
                  of users reduce screen time by{' '}
                  <Text style={styles.statsHighlight}>3+ hours</Text> in the first week{'\n'}
                  with social accountability
                </Text>
              </LinearGradient>
            </View>
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable onPress={handleContinue} style={styles.buttonWrapper}>
              <LinearGradient
                colors={Colors.onboarding.vibrantPurple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Let's Get Started</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    gap: 12,
  },
  headerEmoji: {
    fontSize: 72,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  subtitleHighlight: {
    fontWeight: '700',
    color: '#9D4EDD',
  },
  featuresSection: {
    marginBottom: 24,
  },
  statsBadge: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(157, 78, 221, 0.4)',
  },
  statsGradient: {
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  statsNumber: {
    fontSize: 64,
    fontWeight: '800',
    color: '#B794F6',
    textShadowColor: 'rgba(157, 78, 221, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  statsText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  statsHighlight: {
    fontWeight: '700',
    color: '#B794F6',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
