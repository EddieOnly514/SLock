import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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

export default function GoalsScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();

  // Three separate goals
  const [goal1, setGoal1] = useState(data.goals?.[0] || '');
  const [goal2, setGoal2] = useState(data.goals?.[1] || '');
  const [goal3, setGoal3] = useState(data.goals?.[2] || '');

  const buttonScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  // Valid if at least one goal is entered
  const isValid = goal1.trim().length > 0 || goal2.trim().length > 0 || goal3.trim().length > 0;

  React.useEffect(() => {
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
    // Store goals as an array
    const goalsArray = [goal1, goal2, goal3].filter(g => g.trim().length > 0);
    updateData({ goals: goalsArray });
    setCurrentStep(3);
    router.push('/onboarding/chronically-online');
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
      <ProgressBar currentStep={2} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.content, contentStyle]}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={[Colors.primary[500], Colors.primary[600]]}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="flag" size={40} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text style={styles.question}>
                What's your top three goals for{'\u00A0'}2026?
              </Text>

              {/* Three Goal Inputs */}
              <View style={styles.goalsContainer}>
                <View style={styles.goalRow}>
                  <View style={styles.goalNumber}>
                    <Text style={styles.goalNumberText}>1</Text>
                  </View>
                  <TextInput
                    style={styles.goalInput}
                    value={goal1}
                    onChangeText={setGoal1}
                    placeholder="First goal..."
                    placeholderTextColor={Colors.spec.gray400}
                    maxLength={100}
                  />
                </View>

                <View style={styles.goalRow}>
                  <View style={styles.goalNumber}>
                    <Text style={styles.goalNumberText}>2</Text>
                  </View>
                  <TextInput
                    style={styles.goalInput}
                    value={goal2}
                    onChangeText={setGoal2}
                    placeholder="Second goal..."
                    placeholderTextColor={Colors.spec.gray400}
                    maxLength={100}
                  />
                </View>

                <View style={styles.goalRow}>
                  <View style={styles.goalNumber}>
                    <Text style={styles.goalNumberText}>3</Text>
                  </View>
                  <TextInput
                    style={styles.goalInput}
                    value={goal3}
                    onChangeText={setGoal3}
                    placeholder="Third goal..."
                    placeholderTextColor={Colors.spec.gray400}
                    maxLength={100}
                  />
                </View>
              </View>

              {/* Continue Button */}
              <AnimatedPressable
                onPress={handleContinue}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!isValid}
                style={[styles.buttonWrapper, buttonStyle, !isValid && styles.buttonDisabled]}
              >
                <LinearGradient
                  colors={isValid ? [Colors.primary[500], Colors.primary[600]] : [Colors.spec.gray300, Colors.spec.gray300]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
                    Continue
                  </Text>
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  content: {
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
  question: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 32,
  },
  goalsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.spec.blue100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.blue600,
  },
  goalInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.spec.gray900,
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
  buttonDisabled: {
    opacity: 0.6,
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
  buttonTextDisabled: {
    color: Colors.spec.gray500,
  },
});
