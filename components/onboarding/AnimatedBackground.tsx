import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';

interface AnimatedBackgroundProps {
  variant?: 'darkPurple' | 'darkBlue' | 'deepSpace';
  children?: React.ReactNode;
}

const FloatingParticle = ({ delay = 0, size = 4 }: { delay?: number; size?: number }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-50, {
          duration: 3000 + Math.random() * 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.8, {
          duration: 2000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.5, {
          duration: 2500 + Math.random() * 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function AnimatedBackground({
  variant = 'darkPurple',
  children,
}: AnimatedBackgroundProps) {
  const gradientColors = Colors.onboarding[variant];

  // Generate particles with different delays
  const particles = Array.from({ length: 20 }, (_, i) => ({
    key: i,
    delay: i * 100,
    size: 2 + Math.random() * 4,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating particles */}
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.key}
            delay={particle.delay}
            size={particle.size}
          />
        ))}

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 999,
  },
});
