import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
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

const features = [
  {
    icon: 'people' as const,
    title: 'Accountability Partners',
    description: 'Connect with friends who keep you honest',
  },
  {
    icon: 'shield-checkmark' as const,
    title: 'Social Pressure',
    description: 'Your streak is visible to your circle',
  },
  {
    icon: 'trophy' as const,
    title: 'Compete & Win',
    description: 'Leaderboards and weekly challenges',
  },
  {
    icon: 'flash' as const,
    title: 'Real-time Alerts',
    description: 'Friends get notified if you slip',
  },
];

export default function SocialSolutionScreen() {
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
    setCurrentStep(7);
    router.push('/onboarding/personal-info');
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
      <ProgressBar currentStep={6} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.spacer} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, contentStyle]}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={Colors.spec.gradientIcon}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="people" size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>The Social Solution</Text>
            <Text style={styles.subtext}>Willpower alone isn't{'\u00A0'}enough</Text>

            <View style={styles.successRateContainer}>
              <Text style={styles.successRateNumber}>78%</Text>
              <Text style={styles.successRateText}>success rate with{'\u00A0'}accountability</Text>
            </View>

            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <Animated.View
                  key={index}
                  style={styles.featureCard}
                >
                  <View style={styles.featureIconContainer}>
                    <Ionicons name={feature.icon} size={24} color={Colors.spec.blue600} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </Animated.View>
              ))}
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
                <Text style={styles.buttonText}>Continue</Text>
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
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: Colors.spec.gray600,
    textAlign: 'center',
    marginBottom: 8,
  },
  successRateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  successRateNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.spec.blue600,
  },
  successRateText: {
    fontSize: 18,
    color: Colors.spec.gray600,
    marginLeft: 8,
  },
  featuresContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.spec.blue50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray900,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.spec.gray600,
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
