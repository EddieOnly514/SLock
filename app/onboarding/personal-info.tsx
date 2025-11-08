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

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [name, setName] = useState(data.name || '');
  const [gender, setGender] = useState(data.gender || '');
  const [age, setAge] = useState(data.age?.toString() || '');

  const handleContinue = () => {
    if (!isValid) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({
      name: name.trim(),
      gender,
      age: parseInt(age),
    });
    setCurrentStep(8);
    router.push('/onboarding/analytics-credibility');
  };

  const isValid = name.trim().length > 0 && gender.length > 0 && age.length > 0 && parseInt(age) >= 13;

  return (
    <AnimatedBackground variant="darkBlue">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ProgressBar currentStep={7} totalSteps={11} />

          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtitle}>
                Help us personalize your experience
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              {/* Name */}
              <View style={styles.field}>
                <Text style={styles.label}>What's your name?</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    autoComplete="name"
                  />
                </View>
              </View>

              {/* Age */}
              <View style={styles.field}>
                <Text style={styles.label}>How old are you?</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Enter your age"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                </View>
              </View>

              {/* Gender */}
              <View style={styles.field}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderOptions}>
                  {GENDERS.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setGender(option);
                      }}
                      style={styles.genderOptionWrapper}
                    >
                      <LinearGradient
                        colors={
                          gender === option
                            ? Colors.onboarding.electricBlue
                            : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                          styles.genderOption,
                          gender === option && styles.genderOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.genderOptionText,
                            gender === option && styles.genderOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  ))}
                </View>
              </View>
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
                      ? Colors.onboarding.glowBlue
                      : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
                    Continue
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
  headerSection: {
    marginTop: 32,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  formSection: {
    gap: 24,
  },
  field: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputContainer: {
    backgroundColor: Colors.onboarding.cardGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  genderOptions: {
    gap: 12,
  },
  genderOptionWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  genderOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genderOptionSelected: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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
