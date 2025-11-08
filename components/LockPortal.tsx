import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LockPortalProps {
  visible: boolean;
  onAnimationComplete?: () => void;
}

export default function LockPortal({ visible, onAnimationComplete }: LockPortalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Entry animation
      Animated.parallel([
        // Scale from center
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Fade in
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Rotation (started separately)
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto-hide after animation
      const timer = setTimeout(() => {
        hidePortal();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hidePortal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete?.();
    });
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Background overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.8],
            }),
          },
        ]}
      />

      {/* Portal rings */}
      <Animated.View
        style={[
          styles.portalContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Outer rotating ring */}
        <Animated.View
          style={[
            styles.ring,
            styles.outerRing,
            {
              transform: [{ rotate: rotation }, { scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.primary[500], Colors.accent[500], Colors.primary[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ringGradient}
          />
        </Animated.View>

        {/* Middle ring */}
        <Animated.View
          style={[
            styles.ring,
            styles.middleRing,
            {
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['360deg', '0deg'], // Counter-rotate
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.accent[500], Colors.secondary.purple, Colors.accent[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ringGradient}
          />
        </Animated.View>

        {/* Inner core */}
        <Animated.View
          style={[
            styles.core,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={Colors.gradient.primary}
            style={styles.coreGradient}
          />
        </Animated.View>

        {/* Center icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.icon}>
            <View style={styles.lockIcon}>
              <View style={styles.lockBody} />
              <View style={styles.lockShackle} />
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Particles/sparkles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        const translateX = Math.cos((angle * Math.PI) / 180) * 100;
        const translateY = Math.sin((angle * Math.PI) / 180) * 100;

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                opacity: opacityAnim,
                transform: [
                  { translateX: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, translateX],
                  }) as any },
                  { translateY: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, translateY],
                  }) as any },
                ],
              },
            ]}
          >
            <View style={styles.particleDot} />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background.primary,
  },
  portalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    width: 300,
    height: 300,
  },
  middleRing: {
    width: 220,
    height: 220,
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.full,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  core: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coreGradient: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.full,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    width: 50,
    height: 60,
    position: 'relative',
  },
  lockBody: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: 35,
    backgroundColor: Colors.text.inverse,
    borderRadius: Theme.borderRadius.lg,
  },
  lockShackle: {
    position: 'absolute',
    top: 0,
    left: 10,
    width: 30,
    height: 35,
    borderWidth: 5,
    borderColor: Colors.text.inverse,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 0,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
  },
  particleDot: {
    width: 8,
    height: 8,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary[500],
  },
});
