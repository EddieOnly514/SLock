import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function ChronicallyOnlineScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState<boolean | null>(
    data.isChronicallyOnline ?? null
  );

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const yesScale = useSharedValue(1);
  const noScale = useSharedValue(1);

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

  const yesStyle = useAnimatedStyle(() => ({
    transform: [{ scale: yesScale.value }],
  }));

  const noStyle = useAnimatedStyle(() => ({
    transform: [{ scale: noScale.value }],
  }));

  const handleSelect = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(value);
    updateData({ isChronicallyOnline: value });

    // Auto-advance after selection
    setTimeout(() => {
      setCurrentStep(4);
      router.push('/onboarding/social-media-hours');
    }, 500);
  };

  const handlePressIn = (scale: Animated.SharedValue<number>) => {
    // Scale 0.98, timing only
    scale.value = withTiming(0.98, {
      duration: ANIMATION_THEME.duration.fast,
      easing: ANIMATION_THEME.eased
    });
  };

  const handlePressOut = (scale: Animated.SharedValue<number>) => {
    scale.value = withTiming(1, {
      duration: ANIMATION_THEME.duration.fast,
      easing: ANIMATION_THEME.eased
    });
  };

  return (
    <AnimatedBackground>
      <ProgressBar currentStep={3} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.spacer} />

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.question}>
            Are you chronically online?
          </Text>

          <Text style={styles.subtext}>
            Be honest with{'\u00A0'}yourself
          </Text>

          <View style={styles.optionsContainer}>
            <AnimatedPressable
              onPress={() => handleSelect(true)}
              onPressIn={() => handlePressIn(yesScale)}
              onPressOut={() => handlePressOut(yesScale)}
              style={[styles.optionWrapper, yesStyle]}
            >
              <View style={[
                styles.optionCard,
                selected === true && styles.optionCardSelectedYes
              ]}>
                <Text style={styles.optionTitle}>Yes</Text>
                <Text style={styles.optionSubtext}>
                  I spend way too much time on my{'\u00A0'}phone
                </Text>
                {selected === true && (
                  <View style={styles.checkmarkContainer}>
                    <View style={styles.checkmarkBlue}>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  </View>
                )}
              </View>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => handleSelect(false)}
              onPressIn={() => handlePressIn(noScale)}
              onPressOut={() => handlePressOut(noScale)}
              style={[styles.optionWrapper, noStyle]}
            >
              <View style={[
                styles.optionCard,
                selected === false && styles.optionCardSelectedNo
              ]}>
                <Text style={styles.optionTitle}>No</Text>
                <Text style={styles.optionSubtext}>
                  I have decent control over my{'\u00A0'}usage
                </Text>
                {selected === false && (
                  <View style={styles.checkmarkContainer}>
                    <View style={styles.checkmarkGreen}>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  </View>
                )}
              </View>
            </AnimatedPressable>
          </View>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  question: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    color: Colors.spec.gray600,
    textAlign: 'center',
    marginBottom: 48,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
  },
  optionWrapper: {
    width: '100%',
  },
  optionCard: {
    width: '100%',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.spec.gray200,
    position: 'relative',
  },
  optionCardSelectedYes: {
    borderColor: Colors.spec.blue500,
    backgroundColor: Colors.spec.blue50,
  },
  optionCardSelectedNo: {
    borderColor: Colors.spec.emerald500,
    backgroundColor: Colors.spec.emerald50,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginBottom: 8,
  },
  optionSubtext: {
    fontSize: 14,
    color: Colors.spec.gray600,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  checkmarkBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.spec.blue600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.spec.emerald600,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
