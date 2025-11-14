/**
 * Duolingo-inspired Animation Utilities
 * Smooth, delightful animations for screen transitions and interactions
 */

import {
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

// Animation configs
export const AnimationConfig = {
  // Duolingo-style bouncy spring
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },

  // Gentle spring for subtle animations
  gentleSpring: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  },

  // Timing for smooth transitions
  timing: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },

  // Fast timing for quick feedback
  fast: {
    duration: 150,
    easing: Easing.out(Easing.cubic),
  },

  // Slow timing for emphasis
  slow: {
    duration: 500,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
};

// Screen transition animations
export const screenTransitions = {
  // Slide from right (default)
  slideRight: {
    cardStyleInterpolator: ({ current, layouts }: any) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    }),
  },

  // Fade transition
  fade: {
    cardStyleInterpolator: ({ current }: any) => ({
      cardStyle: {
        opacity: current.progress,
      },
    }),
  },
};

// Button press animation
export const buttonPressAnimation = () => {
  'worklet';
  return withSequence(
    withTiming(0.95, { duration: 100 }),
    withSpring(1, AnimationConfig.spring)
  );
};

// Success celebration animation
export const celebrationAnimation = () => {
  'worklet';
  return withSequence(
    withSpring(1.2, AnimationConfig.spring),
    withSpring(1, AnimationConfig.gentleSpring)
  );
};

// Shake animation (for errors)
export const shakeAnimation = () => {
  'worklet';
  return withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};

// Pulse animation (for streaks, notifications)
export const pulseAnimation = () => {
  'worklet';
  return withRepeat(
    withSequence(
      withTiming(1.1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    ),
    -1, // Infinite repeat
    true // Reverse
  );
};

// Floating points animation
export const floatingPointsAnimation = () => {
  'worklet';
  return {
    translateY: withTiming(-100, { duration: 1500, easing: Easing.out(Easing.exp) }),
    opacity: withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1300 })
    ),
  };
};

// Tree growth animation
export const treeGrowthAnimation = (targetHeight: number) => {
  'worklet';
  return withSpring(targetHeight, {
    damping: 12,
    stiffness: 100,
    mass: 1,
  });
};

// Progress bar fill animation
export const progressBarAnimation = (targetWidth: number) => {
  'worklet';
  return withTiming(targetWidth, {
    duration: 800,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
};

// Confetti animation
export const confettiAnimation = () => {
  'worklet';
  return {
    translateY: withTiming(500, {
      duration: 2000,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94)
    }),
    rotate: withTiming(360, { duration: 2000 }),
    opacity: withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1800 })
    ),
  };
};

// Entrance animations
export const entranceAnimations = {
  fadeInUp: () => {
    'worklet';
    return {
      opacity: withTiming(1, AnimationConfig.timing),
      translateY: withTiming(0, AnimationConfig.timing),
    };
  },

  scaleIn: () => {
    'worklet';
    return {
      opacity: withTiming(1, AnimationConfig.timing),
      scale: withSpring(1, AnimationConfig.spring),
    };
  },

  slideInRight: () => {
    'worklet';
    return {
      opacity: withTiming(1, AnimationConfig.timing),
      translateX: withSpring(0, AnimationConfig.spring),
    };
  },
};

export default {
  AnimationConfig,
  screenTransitions,
  buttonPressAnimation,
  celebrationAnimation,
  shakeAnimation,
  pulseAnimation,
  floatingPointsAnimation,
  treeGrowthAnimation,
  progressBarAnimation,
  confettiAnimation,
  entranceAnimations,
};
