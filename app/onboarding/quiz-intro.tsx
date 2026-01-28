import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ANIMATION_THEME } from '../../constants/AnimationTheme';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function QuizIntroScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboarding();

  // Premium Animation Values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const logoScale = useSharedValue(0.9);
  const logoOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    // Page Entry: 700ms duration, Bezier easing, Staggered
    const { eased, duration, stagger } = ANIMATION_THEME;

    // 1. Content container (0ms delay)
    contentOpacity.value = withTiming(1, { duration: duration.slow, easing: eased });
    contentTranslateY.value = withTiming(0, { duration: duration.slow, easing: eased });

    // 2. Logo (100ms delay)
    logoOpacity.value = withDelay(stagger, withTiming(1, { duration: duration.slow, easing: eased }));
    logoScale.value = withDelay(stagger, withTiming(1, { duration: duration.slow, easing: eased }));
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleStartQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(1);
    router.push('/onboarding/life-satisfaction');
  };

  // Button Interaction: Subtle scale (0.98), no spring, fast timing (200ms)
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

  // DEV: Skip onboarding for testing
  const handleSkipOnboarding = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Animated.View style={[styles.content, contentStyle]}>
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <Image
              source={require('../../assets/slock_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Title - Stagger handled by container flow */}
          <Text style={styles.title}>
            Ready to{' '}
            <Text style={styles.titleGradient}>SLock</Text>
            {' '}in?
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Take control of your life with social{'\u00A0'}accountability
          </Text>

          {/* CTA Button */}
          <AnimatedPressable
            onPress={handleStartQuiz}
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
              <Text style={styles.buttonText}>Enter</Text>
            </LinearGradient>
          </AnimatedPressable>

          {/* DEV: Skip Button */}
          <Pressable onPress={handleSkipOnboarding} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip (Dev)</Text>
          </Pressable>
        </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 80,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 16,
  },
  titleGradient: {
    color: Colors.primary[500],
  },
  subtitle: {
    fontSize: 18,
    color: Colors.spec.gray600,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48,
    paddingHorizontal: 16,
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
  skipButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
});
