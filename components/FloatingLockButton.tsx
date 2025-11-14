import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

interface FloatingLockButtonProps {
  onLock: () => void;
  isLocked?: boolean;
}

export default function FloatingLockButton({
  onLock,
  isLocked = false
}: FloatingLockButtonProps) {
  const [pressing, setPressing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pressProgress = useRef(new Animated.Value(0)).current;

  // Idle floating animation
  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    if (!pressing) {
      floatAnimation.start();
      glowAnimation.start();
    }

    return () => {
      floatAnimation.stop();
      glowAnimation.stop();
    };
  }, [pressing, scaleAnim, glowAnim]);

  const handlePressIn = () => {
    setPressing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animated press delay (hold to lock)
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressProgress, {
        toValue: 1,
        duration: 1500, // 1.5s hold time
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        // Lock action triggered
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onLock();
        resetPress();
      }
    });
  };

  const handlePressOut = () => {
    resetPress();
  };

  const resetPress = () => {
    setPressing(false);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pressProgress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 20],
  });

  const borderColor = pressProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.primary[500], Colors.accent[500]],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            shadowColor: isLocked ? Colors.error[500] : Colors.primary[500],
            shadowOpacity: 0.6,
            shadowRadius: glowRadius as any,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />

      {/* Progress ring */}
      {pressing && (
        <Animated.View
          style={[
            styles.progressRing,
            {
              borderColor: borderColor as any,
              opacity: pressProgress,
            },
          ]}
        />
      )}

      {/* Main button */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
      >
        <LinearGradient
          colors={isLocked ? Colors.gradient.error : Colors.gradient.primary}
          style={styles.button}
        >
          <Text style={styles.icon}>{isLocked ? '🔓' : '🔒'}</Text>
          <Text style={styles.label}>
            {pressing ? 'Hold...' : isLocked ? 'Locked' : 'Lock In'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Hint text */}
      {!pressing && !isLocked && (
        <Text style={styles.hint}>Hold to lock</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: Theme.borderRadius.full,
    elevation: 20,
  },
  progressRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 4,
  },
  touchable: {
    width: 150,
    height: 150,
    borderRadius: Theme.borderRadius.full,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.full,
  },
  icon: {
    fontSize: 50,
    marginBottom: Theme.spacing.xs,
  },
  label: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.inverse,
  },
  hint: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
});
