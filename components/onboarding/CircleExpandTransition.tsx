import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
const diagonal = Math.sqrt(width * width + height * height);

interface CircleExpandTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
}

export const CircleExpandTransition: React.FC<CircleExpandTransitionProps> = ({
  isActive,
  onComplete,
  duration = 800,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      opacity.value = 1;
      scale.value = withTiming(
        1,
        {
          duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        },
        (finished) => {
          if (finished && onComplete) {
            onComplete();
          }
        }
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    const maxSize = diagonal * 2;

    return {
      width: maxSize,
      height: maxSize,
      borderRadius: maxSize / 2,
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (!isActive && scale.value === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none" />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -(Math.sqrt(width * width + height * height)),
    marginTop: -(Math.sqrt(width * width + height * height)),
    backgroundColor: Colors.primary[500],
    zIndex: 9999,
  },
});
