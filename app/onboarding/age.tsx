import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { ScrollPicker } from '../../components/onboarding/ScrollPicker';
import { GlassmorphButton } from '../../components/onboarding/GlassmorphButton';
import { useOnboarding } from '../../hooks/useOnboarding';

export default function AgeScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [age, setAge] = useState(data.age || 25);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ age });
    setCurrentStep(10);
    router.push('/onboarding/ready-to-start');
  };

  return (
    <AnimatedBackground variant="darkBlue">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={9} totalSteps={14} />

        <View style={styles.content}>
          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={styles.emoji}>🎂</Text>
            <Text style={styles.question}>
              How old are you?
            </Text>
            <Text style={styles.subtext}>
              We'll tailor your experience to your age
            </Text>
          </View>

          {/* Age Picker */}
          <View style={styles.pickerSection}>
            <ScrollPicker
              minValue={13}
              maxValue={100}
              initialValue={age}
              onValueChange={setAge}
              itemHeight={60}
              visibleItems={5}
            />
            <Text style={styles.ageLabel}>years old</Text>
          </View>

          {/* Continue Button */}
          <View style={styles.footer}>
            <GlassmorphButton
              title="Next"
              onPress={handleContinue}
              variant="primary"
              size="large"
            />
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
  pickerSection: {
    alignItems: 'center',
    gap: 16,
  },
  ageLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    paddingVertical: 24,
  },
});
