import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male', emoji: '👨' },
  { value: 'female', label: 'Female', emoji: '👩' },
  { value: 'non-binary', label: 'Non-binary', emoji: '🧑' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', emoji: '✨' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GenderOptionProps {
  option: typeof GENDER_OPTIONS[0];
  isSelected: boolean;
  onPress: () => void;
}

const GenderOption: React.FC<GenderOptionProps> = ({ option, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.optionWrapper, animatedStyle]}
    >
      <LinearGradient
        colors={
          isSelected
            ? Colors.onboarding.electricBlue
            : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.option, isSelected && styles.optionSelected]}
      >
        <Text style={styles.optionEmoji}>{option.emoji}</Text>
        <Text style={styles.optionLabel}>{option.label}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
};

export default function GenderScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selectedGender, setSelectedGender] = useState<string | null>(data.gender || null);

  const handleSelect = (gender: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGender(gender);
    updateData({ gender });

    // Auto-advance after brief delay
    setTimeout(() => {
      setCurrentStep(9);
      router.push('/onboarding/age');
    }, 400);
  };

  return (
    <AnimatedBackground variant="darkPurple">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={8} totalSteps={14} />

        <View style={styles.content}>
          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.question}>
              What's your gender?
            </Text>
            <Text style={styles.subtext}>
              Help us personalize your experience
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsSection}>
            {GENDER_OPTIONS.map((option) => (
              <GenderOption
                key={option.value}
                option={option}
                isSelected={selectedGender === option.value}
                onPress={() => handleSelect(option.value)}
              />
            ))}
          </View>

          {/* Spacer */}
          <View />
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  questionSection: {
    marginTop: 60,
    alignItems: 'center',
    gap: 16,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  question: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsSection: {
    gap: 14,
  },
  optionWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  option: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  optionSelected: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 3,
  },
  optionEmoji: {
    fontSize: 36,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
