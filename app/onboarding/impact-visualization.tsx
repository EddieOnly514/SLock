import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ANIMATION_THEME } from '../../constants/AnimationTheme';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ImpactVisualizationScreen() {
  const router = useRouter();
  const { data, setCurrentStep } = useOnboarding();
  const buttonScale = useSharedValue(1);

  const hoursPerDay = data.socialMediaHours || 4;
  const hoursPerYear = hoursPerDay * 365;
  const booksCouldRead = Math.round(hoursPerYear / 8);
  const daysWasted = Math.round(hoursPerYear / 24);
  const exerciseHours = hoursPerYear;

  // Premium Animation Values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const impactScale = useSharedValue(0.9);
  const impactOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);

  React.useEffect(() => {
    // Page Entry: 700ms duration, Bezier easing
    const { eased, duration, stagger } = ANIMATION_THEME;

    // 1. Content (0ms)
    contentOpacity.value = withTiming(1, { duration: duration.slow, easing: eased });
    contentTranslateY.value = withTiming(0, { duration: duration.slow, easing: eased });

    // 2. Impact Card (200ms -> 2 * stagger)
    impactOpacity.value = withDelay(stagger * 2, withTiming(1, { duration: duration.slow, easing: eased }));
    // Subtle scale up, no bounce
    impactScale.value = withDelay(stagger * 2, withTiming(1, { duration: duration.slow, easing: eased }));

    // 3. Stats Grid (400ms -> 4 * stagger)
    statsOpacity.value = withDelay(stagger * 4, withTiming(1, { duration: duration.slow, easing: eased }));
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const impactStyle = useAnimatedStyle(() => ({
    opacity: impactOpacity.value,
    transform: [{ scale: impactScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(6);
    router.push('/onboarding/social-solution');
  };

  // Button Interaction: Subtle scale (0.98), no spring
  const handlePressIn = () => {
    buttonScale.value = withTiming(0.98, {
      duration: ANIMATION_THEME.duration.fast,
      easing: ANIMATION_THEME.eased
    });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, {
      duration: ANIMATION_THEME.duration.fast,
      easing: ANIMATION_THEME.eased
    });
  };

  const stats = [
    { icon: 'book-outline' as const, value: booksCouldRead, label: 'Books you could read' },
    { icon: 'calendar-outline' as const, value: daysWasted, label: 'Full days per year' },
    { icon: 'fitness-outline' as const, value: `${exerciseHours}h`, label: 'Hours for exercise yearly' },
  ];

  return (
    <AnimatedBackground>
      <ProgressBar currentStep={5} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.spacer} />

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.title}>The Reality Check</Text>
          <Text style={styles.subtext}>
            At {hoursPerDay} hours per day, you're{'\u00A0'}losing...
          </Text>

          <Animated.View style={[styles.impactCard, impactStyle]}>
            <Text style={styles.impactNumber}>{daysWasted}</Text>
            <Text style={styles.impactLabel}>full days per year</Text>
          </Animated.View>

          <Animated.View style={[styles.statsContainer, statsStyle]}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name={stat.icon} size={22} color="Colors.primary[500]" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          <AnimatedPressable
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.buttonWrapper, buttonStyle]}
          >
            <LinearGradient
              colors={[Colors.primary[500], Colors.primary[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>I'm Ready to Change</Text>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    height: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: Colors.spec.gray600,
    textAlign: 'center',
    marginBottom: 20,
  },
  impactCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  impactNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.primary[500],
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.spec.gray900,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.spec.gray600,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
