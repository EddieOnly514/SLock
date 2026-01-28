import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

// Wave layer component with subtle breathing effect
const WaveLayer = ({
  delay,
  duration,
  translateRange,
  scaleRange,
  opacity: baseOpacity
}: {
  delay: number;
  duration: number;
  translateRange: number;
  scaleRange: [number, number];
  opacity: number;
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, translateRange]) },
      { scale: interpolate(progress.value, [0, 1], scaleRange) },
    ],
    opacity: interpolate(progress.value, [0, 0.5, 1], [baseOpacity, baseOpacity * 1.3, baseOpacity]),
  }));

  return (
    <Animated.View style={[styles.waveLayer, animatedStyle]}>
      <LinearGradient
        colors={[Colors.primary.soft, 'rgba(255, 59, 59, 0.03)', 'transparent']}
        style={styles.waveGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </Animated.View>
  );
};

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Base gradient - clean white */}
      <LinearGradient
        colors={[Colors.background.primary, Colors.background.secondary, Colors.background.tertiary]}
        style={styles.baseGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Very subtle animated wave layers for depth */}
      <WaveLayer delay={0} duration={4000} translateRange={-15} scaleRange={[1, 1.05]} opacity={0.08} />
      <WaveLayer delay={1000} duration={5000} translateRange={-20} scaleRange={[1.02, 0.98]} opacity={0.05} />
      <WaveLayer delay={2000} duration={6000} translateRange={-10} scaleRange={[0.98, 1.04]} opacity={0.03} />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  baseGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  waveLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  waveGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});
