import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  runOnJS,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface HoldButtonProps {
  title: string;
  onComplete: () => void;
  holdDuration?: number; // in milliseconds
  size?: number;
  disabled?: boolean;
}

export const HoldButton: React.FC<HoldButtonProps> = ({
  title,
  onComplete,
  holdDuration = 3000,
  size = 200,
  disabled = false,
}) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const isCompleted = useSharedValue(false);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (progress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleComplete = () => {
    if (!isCompleted.value) {
      isCompleted.value = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    }
  };

  const longPressGesture = Gesture.LongPress()
    .minDuration(50)
    .onStart(() => {
      if (disabled || isCompleted.value) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withTiming(0.95, { duration: 100 });

      // Start progress animation
      progress.value = withTiming(
        100,
        {
          duration: holdDuration,
        },
        (finished) => {
          if (finished) {
            runOnJS(handleComplete)();
          }
        }
      );
    })
    .onEnd(() => {
      if (isCompleted.value) return;

      scale.value = withTiming(1, { duration: 100 });

      // Reset progress if not completed
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 200 });
    });

  const tapGesture = Gesture.Tap().onStart(() => {
    if (disabled || isCompleted.value) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  });

  const composedGestures = Gesture.Exclusive(longPressGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={[styles.container, animatedButtonStyle]}>
        {/* Progress ring */}
        <Svg width={size} height={size} style={styles.svgContainer}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.onboarding.glassBorder}
            strokeWidth={8}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.text.inverse}
            strokeWidth={8}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={animatedCircleProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Button content */}
        <View style={styles.contentContainer}>
          <View style={styles.glassButton}>
            <Text style={styles.buttonText}>{title}</Text>
            <Text style={styles.instructionText}>Hold to continue</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'absolute',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassButton: {
    backgroundColor: Colors.onboarding.glassBackground,
    borderWidth: 1,
    borderColor: Colors.onboarding.glassBorder,
    borderRadius: 100,
    paddingHorizontal: 40,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 4,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.inverse,
    opacity: 0.7,
    textAlign: 'center',
  },
});
