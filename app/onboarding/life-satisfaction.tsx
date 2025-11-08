import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const SATISFACTION_LABELS = ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];

export default function LifeSatisfactionScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [satisfaction, setSatisfaction] = useState(data.lifeSatisfaction || 50);

  const getSatisfactionLabel = (value: number) => {
    if (value < 20) return SATISFACTION_LABELS[0];
    if (value < 40) return SATISFACTION_LABELS[1];
    if (value < 60) return SATISFACTION_LABELS[2];
    if (value < 80) return SATISFACTION_LABELS[3];
    return SATISFACTION_LABELS[4];
  };

  const getSatisfactionEmoji = (value: number) => {
    if (value < 20) return '😔';
    if (value < 40) return '😐';
    if (value < 60) return '🙂';
    if (value < 80) return '😊';
    return '😄';
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ lifeSatisfaction: satisfaction });
    setCurrentStep(2);
    router.push('/onboarding/goals');
  };

  return (
    <AnimatedBackground variant="darkBlue">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={1} totalSteps={11} />

        <View style={styles.content}>
          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={styles.question}>
              Are you satisfied with your life?
            </Text>
            <Text style={styles.subtext}>
              Be honest - this helps us personalize your journey
            </Text>
          </View>

          {/* Satisfaction display */}
          <View style={styles.displaySection}>
            <Text style={styles.emojiDisplay}>{getSatisfactionEmoji(satisfaction)}</Text>
            <Text style={styles.labelDisplay}>{getSatisfactionLabel(satisfaction)}</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>{Math.round(satisfaction)}%</Text>
              <Text style={styles.percentageLabel}>Satisfaction Level</Text>
            </View>
          </View>

          {/* Slider */}
          <View style={styles.sliderSection}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={satisfaction}
              onValueChange={(value) => {
                setSatisfaction(value);
                Haptics.selectionAsync();
              }}
              minimumTrackTintColor={Colors.onboarding.glowBlue[1]}
              maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              thumbTintColor="#FFFFFF"
            />

            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>Not at all</Text>
              <Text style={styles.sliderLabelText}>Very much</Text>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable onPress={handleContinue} style={styles.buttonWrapper}>
              <LinearGradient
                colors={Colors.onboarding.electricBlue}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Next</Text>
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  questionSection: {
    marginTop: 32,
    gap: 12,
  },
  question: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  displaySection: {
    alignItems: 'center',
    gap: 16,
  },
  emojiDisplay: {
    fontSize: 120,
  },
  labelDisplay: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  percentageContainer: {
    alignItems: 'center',
    gap: 4,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.onboarding.glowBlue[1],
  },
  percentageLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  sliderSection: {
    gap: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabelText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  footer: {
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
