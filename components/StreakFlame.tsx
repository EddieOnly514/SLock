import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

interface StreakFlameProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export default function StreakFlame({
  streak,
  size = 'medium',
  animated = true
}: StreakFlameProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Get intensity level based on streak
  const getIntensity = () => {
    if (streak >= 30) return 'legendary';
    if (streak >= 14) return 'hot';
    if (streak >= 7) return 'warm';
    return 'cool';
  };

  const intensity = getIntensity();

  // Size configurations
  const sizeConfig = {
    small: { fontSize: 20, containerSize: 32 },
    medium: { fontSize: 32, containerSize: 50 },
    large: { fontSize: 48, containerSize: 70 },
  };

  // Intensity configurations
  const intensityConfig = {
    cool: {
      emoji: '🔥',
      glowColor: Colors.accent[500],
      glowOpacity: 0.3,
    },
    warm: {
      emoji: '🔥',
      glowColor: Colors.accent[500],
      glowOpacity: 0.5,
    },
    hot: {
      emoji: '🔥',
      glowColor: Colors.accent[400],
      glowOpacity: 0.7,
    },
    legendary: {
      emoji: '🔥',
      glowColor: Colors.primary[500],
      glowOpacity: 0.9,
    },
  };

  const config = {
    ...sizeConfig[size],
    ...intensityConfig[intensity],
  };

  useEffect(() => {
    if (!animated) return;

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, [animated, scaleAnim, glowAnim]);

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 12],
  });

  return (
    <View style={[styles.container, { width: config.containerSize, height: config.containerSize }]}>
      <Animated.View
        style={[
          styles.flameContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glow,
            {
              shadowColor: config.glowColor,
              shadowOpacity: config.glowOpacity,
              shadowRadius: glowRadius as any,
            },
          ]}
        >
          <Text style={[styles.flame, { fontSize: config.fontSize }]}>
            {config.emoji}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Streak number */}
      <View style={styles.streakBadge}>
        <Text style={[styles.streakText, { fontSize: size === 'small' ? 10 : 12 }]}>
          {streak}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  flame: {
    textAlign: 'center',
  },
  streakBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.background.elevated,
    borderRadius: Theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.accent[500],
  },
  streakText: {
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
  },
});
