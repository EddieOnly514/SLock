import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
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
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

// Face Icons (5 stages, 20% increments)
const satisfactionIcons = [
  { min: 0, max: 20, icon: 'sad-outline' as const, label: 'Very Unsatisfied', color: '#EF4444' }, // Red
  { min: 20, max: 40, icon: 'sad-outline' as const, label: 'Unsatisfied', color: '#F97316' }, // Orange
  { min: 40, max: 60, icon: 'remove-circle-outline' as const, label: 'Neutral', color: '#EAB308' }, // Yellow (using remove-circle as straight mouth)
  { min: 60, max: 80, icon: 'happy-outline' as const, label: 'Satisfied', color: '#22C55E' }, // Green
  { min: 80, max: 101, icon: 'happy-outline' as const, label: 'Very Satisfied', color: Colors.success[500] }, // Emerald
];

export default function LifeSatisfactionScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [satisfaction, setSatisfaction] = useState(data.lifeSatisfaction || 50);
  const buttonScale = useSharedValue(1);

  // Animation values for icon
  const iconScale = useSharedValue(1);
  const iconRotation = useSharedValue(0);

  const currentIcon = satisfactionIcons.find(
    state => satisfaction >= state.min && satisfaction < state.max
  ) || satisfactionIcons[2];

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  // Dynamic color for transitions
  const activeColor = currentIcon.color;

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

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSliderChange = useCallback((value: number) => {
    const newValue = Math.round(value);
    const oldIcon = satisfactionIcons.find(
      state => satisfaction >= state.min && satisfaction < state.max
    );
    const newIcon = satisfactionIcons.find(
      state => newValue >= state.min && newValue < state.max
    );

    // Animate icon when category changes
    if (oldIcon?.label !== newIcon?.label) {
      // Gentle pop effect
      iconScale.value = withTiming(1.2, { duration: 200, easing: ANIMATION_THEME.eased });
      // Tilt based on direction
      iconRotation.value = withTiming(satisfaction < newValue ? 10 : -10, { duration: 200, easing: ANIMATION_THEME.eased });

      setTimeout(() => {
        iconScale.value = withTiming(1, { duration: 200, easing: ANIMATION_THEME.eased });
        iconRotation.value = withTiming(0, { duration: 200, easing: ANIMATION_THEME.eased });
      }, 150);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setSatisfaction(newValue);
  }, [satisfaction, iconScale, iconRotation]);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ lifeSatisfaction: satisfaction });
    setCurrentStep(2);
    router.push('/onboarding/goals');
  };

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

  return (
    <AnimatedBackground>
      <ProgressBar currentStep={1} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.spacer} />

        <Animated.View style={[styles.content, contentStyle]}>
          {/* Icon Display */}
          <View style={styles.iconDisplayContainer}>
            <View style={[styles.iconCircle, { borderColor: activeColor }]}>
              <AnimatedIcon
                name={currentIcon.icon}
                size={64}
                color={activeColor}
                style={iconStyle}
              />
            </View>
          </View>

          {/* Question with balanced text */}
          <Text style={styles.question}>
            How satisfied are you with your{'\u00A0'}life?
          </Text>

          <Text style={styles.subtext}>
            Be honest – this helps us personalize your{'\u00A0'}experience
          </Text>

          {/* Slider with dynamic solid color track */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrackContainer}>
              {/* Background Grey Track */}
              <View style={styles.sliderTrackBackground} />

              {/* Active Color Track */}
              <View
                style={[
                  styles.sliderTrackFill,
                  {
                    width: `${satisfaction}%`,
                    backgroundColor: activeColor
                  }
                ]}
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={satisfaction}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={activeColor}
            />

            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>0%</Text>
              <Text style={styles.sliderLabelText}>50%</Text>
              <Text style={styles.sliderLabelText}>100%</Text>
            </View>
          </View>

          {/* Current State Label */}
          <View style={styles.valueDisplay}>
            <Text style={[styles.valueText, { color: activeColor }]}>
              {satisfaction}%
            </Text>
            <Text style={styles.labelText}>{currentIcon.label}</Text>
          </View>

          {/* Continue Button */}
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
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    height: 80,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconDisplayContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4, // Slightly thicker border for impact
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.spec.gray400,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  question: {
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
    marginBottom: 48,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 32,
    position: 'relative',
  },
  sliderTrackContainer: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: Colors.spec.gray200,
  },
  sliderTrackBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.spec.gray200,
  },
  sliderTrackFill: {
    height: '100%',
    borderRadius: 3,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    color: Colors.spec.gray400,
  },
  valueDisplay: {
    alignItems: 'center',
    marginBottom: 48,
  },
  valueText: {
    fontSize: 48,
    fontWeight: '700',
  },
  labelText: {
    fontSize: 18,
    color: Colors.spec.gray600,
    marginTop: 4,
    fontWeight: '500',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.spec.blue500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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
