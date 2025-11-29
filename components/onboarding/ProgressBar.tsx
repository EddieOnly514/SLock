import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showBackButton?: boolean;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  showBackButton = true,
}: ProgressBarProps) {
  const router = useRouter();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring((currentStep / totalSteps) * 100, {
      damping: 20,
      stiffness: 90,
    });
  }, [currentStep, totalSteps]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      {showBackButton && (
        <Pressable onPress={handleBack} style={styles.backButton}>
          <View style={styles.backIcon}>
            <View style={styles.chevron} />
          </View>
        </Pressable>
      )}

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressBar, animatedProgressStyle]}>
            <LinearGradient
              colors={Colors.onboarding.glowBlue}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ rotate: '45deg' }],
  },
  progressContainer: {
    flex: 1,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
});
