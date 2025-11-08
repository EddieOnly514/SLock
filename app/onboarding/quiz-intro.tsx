import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { TouchInteractiveBackground } from '../../components/onboarding/TouchInteractiveBackground';
import { GlassmorphButton } from '../../components/onboarding/GlassmorphButton';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const FloatingIllustration = () => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-30, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    rotate.value = withRepeat(
      withTiming(10, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.illustrationContainer, animatedStyle]}>
      <View style={styles.illustration}>
        <Text style={styles.illustrationEmoji}>🔒</Text>
      </View>
    </Animated.View>
  );
};

export default function QuizIntroScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboarding();

  const handleStartQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(1);
    router.push('/onboarding/life-satisfaction');
  };

  return (
    <TouchInteractiveBackground gradientColors={Colors.onboarding.blueGradient1}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Top section with illustration */}
          <View style={styles.topSection}>
            <FloatingIllustration />
          </View>

          {/* Main content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Are you ready to{'\n'}Slock In?</Text>
            <Text style={styles.subtitle}>
              Take control of your time and build{'\n'}the life you deserve.
            </Text>
          </View>

          {/* CTA Button */}
          <View style={styles.footer}>
            <GlassmorphButton
              title="Start Slocking In"
              onPress={handleStartQuiz}
              variant="primary"
              size="large"
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchInteractiveBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  illustrationContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.onboarding.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  illustrationEmoji: {
    fontSize: 90,
  },
  mainContent: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 24,
  },
});
