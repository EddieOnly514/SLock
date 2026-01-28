import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ANIMATION_THEME } from '../../constants/AnimationTheme';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const stats = [
  { icon: 'people' as const, value: '50K+', label: 'Active Users' },
  { icon: 'star' as const, value: '4.8/5', label: 'App Rating' },
  { icon: 'time' as const, value: '3M+', label: 'Hours Saved' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    rating: 5,
    text: 'SLock changed my life. I finally have time for what matters.',
  },
  {
    name: 'Mike R.',
    rating: 5,
    text: 'The accountability feature is genius. My friends keep me on track!',
  },
  {
    name: 'Alex K.',
    rating: 5,
    text: "I've read 12 books this year thanks to the time I saved.",
  },
];

export default function AnalyticsCredibilityScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboarding();
  const buttonScale = useSharedValue(1);

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  React.useEffect(() => {
    // 700ms Bezier Ease, no bounce
    contentOpacity.value = withTiming(1, {
      duration: ANIMATION_THEME.duration.slow,
      easing: ANIMATION_THEME.eased
    });
    contentTranslateY.value = withTiming(0, {
      duration: ANIMATION_THEME.duration.slow,
      easing: ANIMATION_THEME.eased
    });
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(9);
    router.push('/onboarding/pricing');
  };

  const handlePressIn = () => {
    // Scale 0.98, timing only
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

  return (
    <AnimatedBackground>
      <ProgressBar currentStep={8} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.spacer} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, contentStyle]}>
            <Text style={styles.title}>
              Join Thousands Who've Taken{'\u00A0'}Control
            </Text>
            <Text style={styles.subtext}>Real results from real people</Text>

            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name={stat.icon} size={20} color={Colors.spec.blue600} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.testimonialsContainer}>
              {testimonials.map((testimonial, index) => (
                <View key={index} style={styles.testimonialCard}>
                  <View style={styles.testimonialHeader}>
                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                    <View style={styles.starsContainer}>
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Ionicons key={i} name="star" size={12} color="#EAB308" />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
                </View>
              ))}
            </View>

            <View style={styles.trustBadges}>
              <View style={styles.trustBadgeGreen}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.spec.emerald600} />
                <Text style={styles.trustBadgeText}>SSL Encrypted</Text>
              </View>
              <View style={styles.trustBadgeBlue}>
                <Ionicons name="close-circle" size={20} color={Colors.spec.blue600} />
                <Text style={styles.trustBadgeText}>Cancel Anytime</Text>
              </View>
            </View>

            <AnimatedPressable
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.buttonWrapper, buttonStyle]}
            >
              <LinearGradient
                colors={Colors.spec.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Choose Your Plan</Text>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    color: Colors.spec.gray600,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.spec.blue50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.spec.gray600,
    textAlign: 'center',
  },
  testimonialsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 16,
    padding: 16,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: Colors.spec.gray600,
    fontStyle: 'italic',
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 32,
  },
  trustBadgeGreen: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.spec.emerald50,
    borderWidth: 1,
    borderColor: Colors.spec.emerald100,
    borderRadius: 12,
    padding: 12,
  },
  trustBadgeBlue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.spec.blue50,
    borderWidth: 1,
    borderColor: Colors.spec.blue100,
    borderRadius: 12,
    padding: 12,
  },
  trustBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.spec.gray700,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.spec.blue500,
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
