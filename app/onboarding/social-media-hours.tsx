import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import CircularSlider from '../../components/onboarding/CircularSlider';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

export default function SocialMediaHoursScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [hours, setHours] = useState(data.socialMediaHours || 15);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ socialMediaHours: hours });
    setCurrentStep(5);
    router.push('/onboarding/impact-visualization');
  };

  return (
    <AnimatedBackground variant="darkBlue">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={4} totalSteps={11} />

        <View style={styles.content}>
          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={styles.question}>
              How many hours a week do you waste on social media?
            </Text>
            <Text style={styles.subtext}>
              Be honest with yourself...
            </Text>
          </View>

          {/* Circular Slider */}
          <View style={styles.sliderSection}>
            <CircularSlider
              value={hours}
              maxValue={50}
              onChange={(value) => {
                setHours(value);
                Haptics.selectionAsync();
              }}
              size={280}
              strokeWidth={20}
              color="#FF6B6B"
              showHelperText={false}
              getCustomText={(value) => value > 25 ? "WAY TOO\nMUCH" : ""}
            />
          </View>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable onPress={handleContinue} style={styles.buttonWrapper}>
              <LinearGradient
                colors={Colors.onboarding.coralOrange}
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
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  sliderSection: {
    alignItems: 'center',
    justifyContent: 'center',
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
