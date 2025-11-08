import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { GlassmorphButton } from '../../components/onboarding/GlassmorphButton';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

export default function NameScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [name, setName] = useState(data.name || '');

  const handleContinue = () => {
    if (name.trim().length === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ name: name.trim() });
    setCurrentStep(8);
    router.push('/onboarding/gender');
  };

  const isValid = name.trim().length > 0;

  return (
    <AnimatedBackground variant="darkBlue">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ProgressBar currentStep={7} totalSteps={14} />

          <View style={styles.content}>
            {/* Question */}
            <View style={styles.questionSection}>
              <Text style={styles.emoji}>👋</Text>
              <Text style={styles.question}>
                What's your name?
              </Text>
              <Text style={styles.subtext}>
                Let's get to know you better
              </Text>
            </View>

            {/* Input */}
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Continue Button */}
            <View style={styles.footer}>
              <GlassmorphButton
                title="Next"
                onPress={handleContinue}
                disabled={!isValid}
                variant="primary"
                size="large"
              />
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
  inputSection: {
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: Colors.onboarding.glassBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.onboarding.glassBorder,
    padding: 20,
  },
  input: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
  },
});
