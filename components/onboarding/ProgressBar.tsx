import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  showBackButton = true,
  onBack,
}: ProgressBarProps) {
  const router = useRouter();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming((currentStep / totalSteps) * 100, {
      duration: 400,
    });
  }, [currentStep, totalSteps]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Back button */}
        {showBackButton && (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={Colors.spec.gray600} />
          </Pressable>
        )}

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressBar, animatedProgressStyle]}>
              <LinearGradient
                colors={Colors.spec.gradientProgress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </Animated.View>
          </View>
        </View>

        {/* Step counter */}
        <Text style={styles.stepCounter}>
          {currentStep}/{totalSteps}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.spec.gray100,
    paddingTop: 50, // Safe area
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    maxWidth: 672, // max-w-2xl
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.spec.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressBackground: {
    height: 6,
    backgroundColor: Colors.spec.gray100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
    borderRadius: 999,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.spec.gray400,
    minWidth: 50,
    textAlign: 'right',
  },
});
