import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  duration: number;
}

interface TouchInteractiveBackgroundProps {
  children: React.ReactNode;
  gradientColors?: string[];
  particleCount?: number;
}

// Generate particles
const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * width,
    initialY: Math.random() * height,
    size: Math.random() * 60 + 30, // 30-90
    duration: Math.random() * 3000 + 4000, // 4-7 seconds
  }));
};

const TouchParticle: React.FC<{
  particle: Particle;
  touchX: Animated.SharedValue<number>;
  touchY: Animated.SharedValue<number>;
  isTouching: Animated.SharedValue<boolean>;
}> = ({ particle, touchX, touchY, isTouching }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: particle.duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Base floating animation
    const baseY = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, -30, 0]
    );

    const baseX = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 15, 0]
    );

    const opacity = interpolate(
      progress.value,
      [0, 0.2, 0.8, 1],
      [0.2, 0.6, 0.6, 0.2]
    );

    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 1.2, 1]
    );

    // Calculate distance from touch point
    const distanceX = touchX.value - (particle.initialX + baseX);
    const distanceY = touchY.value - (particle.initialY + baseY);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Repulsion effect - particles move away from touch
    const repulsionRadius = 150;
    const repulsionStrength = isTouching.value && distance < repulsionRadius
      ? ((repulsionRadius - distance) / repulsionRadius) * 50
      : 0;

    const angle = Math.atan2(distanceY, distanceX);
    const repulsionX = -Math.cos(angle) * repulsionStrength;
    const repulsionY = -Math.sin(angle) * repulsionStrength;

    return {
      position: 'absolute',
      left: particle.initialX + baseX + repulsionX,
      top: particle.initialY + baseY + repulsionY,
      width: particle.size,
      height: particle.size,
      borderRadius: particle.size / 2,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      opacity: opacity,
      transform: [{ scale: scale }],
    };
  });

  return <Animated.View style={animatedStyle} />;
};

export const TouchInteractiveBackground: React.FC<TouchInteractiveBackgroundProps> = ({
  children,
  gradientColors = Colors.onboarding.blueGradient1,
  particleCount = 25,
}) => {
  const touchX = useSharedValue(width / 2);
  const touchY = useSharedValue(height / 2);
  const isTouching = useSharedValue(false);
  const particles = generateParticles(particleCount);

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      isTouching.value = true;
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onUpdate((event) => {
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onEnd(() => {
      isTouching.value = false;
    });

  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      isTouching.value = true;
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onEnd(() => {
      // Keep touch effect for a moment after tap
      setTimeout(() => {
        isTouching.value = false;
      }, 300);
    });

  const composedGestures = Gesture.Race(panGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGestures}>
      <View style={styles.container}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Interactive particles */}
        <View style={StyleSheet.absoluteFillObject}>
          {particles.map((particle) => (
            <TouchParticle
              key={particle.id}
              particle={particle}
              touchX={touchX}
              touchY={touchY}
              isTouching={isTouching}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    zIndex: 10,
  },
});
