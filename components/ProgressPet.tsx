import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

interface ProgressPetProps {
  progress: number; // 0-100
  level: number;
  theme?: 'digitalCreature' | 'growingPlant' | 'miniAvatar' | 'energyCore';
  animated?: boolean;
}

export default function ProgressPet({
  progress,
  level,
  theme = 'growingPlant',
  animated = true
}: ProgressPetProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Animate progress changes
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [progress, progressAnim]);

  // Idle animations
  useEffect(() => {
    if (!animated) return;

    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    bounceAnimation.start();
    glowAnimation.start();

    return () => {
      bounceAnimation.stop();
      glowAnimation.stop();
    };
  }, [animated, bounceAnim, glowAnim]);

  // Theme configurations
  const themeConfig = {
    digitalCreature: {
      emoji: level >= 20 ? '🦾' : level >= 10 ? '🤖' : '🔮',
      color: Colors.characterTheme.digitalCreature,
      gradient: [Colors.primary[500], Colors.secondary.cyan] as const,
    },
    growingPlant: {
      emoji: level >= 20 ? '🌳' : level >= 10 ? '🌿' : '🌱',
      color: Colors.characterTheme.growingPlant,
      gradient: [Colors.success[500], Colors.secondary.cyan] as const,
    },
    miniAvatar: {
      emoji: level >= 20 ? '🦸' : level >= 10 ? '🧑' : '👤',
      color: Colors.characterTheme.miniAvatar,
      gradient: [Colors.accent[500], Colors.accent[300]] as const,
    },
    energyCore: {
      emoji: level >= 20 ? '💎' : level >= 10 ? '⚡' : '✨',
      color: Colors.characterTheme.energyCore,
      gradient: [Colors.secondary.purple, Colors.secondary.cyan] as const,
    },
  };

  const config = themeConfig[theme];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 16],
  });

  // Get evolution stage name
  const getEvolutionStage = () => {
    if (level >= 20) return 'Legendary';
    if (level >= 15) return 'Master';
    if (level >= 10) return 'Expert';
    if (level >= 5) return 'Adept';
    return 'Novice';
  };

  return (
    <View style={styles.container}>
      {/* Pet Avatar */}
      <Animated.View
        style={[
          styles.petContainer,
          {
            transform: [{ translateY: bounceAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.petGlow,
            {
              shadowColor: config.color,
              shadowOpacity: 0.6,
              shadowRadius: glowRadius as any,
            },
          ]}
        >
          <LinearGradient
            colors={config.gradient}
            style={styles.petBackground}
          >
            <Text style={styles.petEmoji}>{config.emoji}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Level Badge */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lvl {level}</Text>
        </View>
      </Animated.View>

      {/* Evolution Stage */}
      <Text style={styles.stageName}>{getEvolutionStage()}</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressWidth as any,
              },
            ]}
          >
            <LinearGradient
              colors={config.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>

        {/* Progress Text */}
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {/* Next Evolution Info */}
      {level < 20 && (
        <Text style={styles.nextEvolution}>
          {100 - progress}% to next evolution
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
  },
  petContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.md,
  },
  petGlow: {
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  petBackground: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.background.elevated,
  },
  petEmoji: {
    fontSize: 60,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 3,
    borderColor: Colors.background.primary,
    ...Theme.shadow.glow,
  },
  levelText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.inverse,
  },
  stageName: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.background.tertiary,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  progressBarFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    marginTop: Theme.spacing.xs,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  nextEvolution: {
    marginTop: Theme.spacing.sm,
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
  },
});
