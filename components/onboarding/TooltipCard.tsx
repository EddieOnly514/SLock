import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

interface TooltipCardProps {
  emoji: string;
  title: string;
  description: string;
  elaboration: string;
}

export const TooltipCard: React.FC<TooltipCardProps> = ({
  emoji,
  title,
  description,
  elaboration,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scale = useSharedValue(1);
  const tooltipHeight = useSharedValue(0);
  const tooltipOpacity = useSharedValue(0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(!isExpanded);

    if (!isExpanded) {
      tooltipHeight.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      tooltipOpacity.value = withTiming(1, { duration: 200 });
    } else {
      tooltipHeight.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      tooltipOpacity.value = withTiming(0, { duration: 150 });
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedTooltipStyle = useAnimatedStyle(() => ({
    height: tooltipHeight.value === 0 ? 0 : 'auto',
    maxHeight: tooltipHeight.value * 200, // Max height when expanded
    opacity: tooltipOpacity.value,
    marginTop: tooltipHeight.value * 12,
    overflow: 'hidden',
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={animatedCardStyle}>
          <LinearGradient
            colors={[Colors.onboarding.glassBackground, 'rgba(255, 255, 255, 0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardContainer}
          >
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{emoji}</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            <View style={styles.tapIndicator}>
              <Text style={styles.tapText}>Tap</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {/* Tooltip */}
      <Animated.View style={[styles.tooltipContainer, animatedTooltipStyle]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.tooltip}
        >
          <View style={styles.tooltipArrow} />
          <Text style={styles.tooltipText}>{elaboration}</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.onboarding.glassBorder,
    backgroundColor: Colors.onboarding.glassBackground,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text.inverse,
    opacity: 0.7,
    lineHeight: 20,
  },
  tapIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: Colors.onboarding.glassBorder,
  },
  tapText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
    opacity: 0.6,
  },
  tooltipContainer: {
    overflow: 'hidden',
  },
  tooltip: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.onboarding.glassBorder,
    marginHorizontal: 8,
  },
  tooltipArrow: {
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: Colors.onboarding.glassBorder,
    transform: [{ rotate: '45deg' }],
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.inverse,
    lineHeight: 20,
    opacity: 0.9,
  },
});
