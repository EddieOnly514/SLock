import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

export default function GoalsScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [goal, setGoal] = useState(data.lifeGoals || '');

  const handleContinue = () => {
    if (goal.trim().length === 0) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ lifeGoals: goal });
    setCurrentStep(3);
    router.push('/onboarding/chronically-online');
  };

  const isValid = goal.trim().length > 0;

  return (
    <AnimatedBackground variant="deepSpace">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ProgressBar currentStep={2} totalSteps={11} />

          <View style={styles.content}>
            {/* Question */}
            <View style={styles.questionSection}>
              <Text style={styles.question}>
                What do you want to achieve in life?
              </Text>
              <Text style={styles.subtext}>
                Type it out - what's your main goal right now?
              </Text>
            </View>

            {/* Input section */}
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={goal}
                  onChangeText={setGoal}
                  placeholder="I want to..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  multiline
                  maxLength={200}
                  autoFocus
                />
              </View>

              <Text style={styles.charCount}>{goal.length}/200</Text>
            </View>

            {/* Continue Button */}
            <View style={styles.footer}>
              <Pressable
                onPress={handleContinue}
                disabled={!isValid}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={
                    isValid
                      ? Colors.onboarding.vibrantPurple
                      : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
                    Next
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
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
  inputSection: {
    gap: 24,
  },
  inputContainer: {
    backgroundColor: Colors.onboarding.cardGlass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    minHeight: 120,
  },
  input: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 26,
  },
  charCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'right',
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
  buttonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
