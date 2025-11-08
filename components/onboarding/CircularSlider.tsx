import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularSliderProps {
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showHelperText?: boolean;
  customLabel?: string;
  getCustomText?: (value: number) => string;
}

export default function CircularSlider({
  value,
  maxValue,
  onChange,
  size = 280,
  strokeWidth = 20,
  color = '#FF6B6B',
  showHelperText = true,
  customLabel = 'per week',
  getCustomText,
}: CircularSliderProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = useSharedValue((value / maxValue) * circumference);

  const [currentValue, setCurrentValue] = useState(value);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const { moveX, moveY } = gestureState;
      const centerX = size / 2;
      const centerY = size / 2;

      // Calculate angle from center
      const dx = moveX - centerX;
      const dy = moveY - centerY;
      let angle = Math.atan2(dy, dx);

      // Convert to 0-360 range, starting from top
      angle = angle + Math.PI / 2;
      if (angle < 0) angle += 2 * Math.PI;

      // Convert angle to value
      const normalizedAngle = angle / (2 * Math.PI);
      const newValue = Math.round(normalizedAngle * maxValue);

      // Update value
      const clampedValue = Math.max(0, Math.min(maxValue, newValue));
      setCurrentValue(clampedValue);
      onChange(clampedValue);
      progress.value = withSpring((clampedValue / maxValue) * circumference);
    },
  });

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - progress.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer} {...panResponder.panHandlers}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>
          {getCustomText && currentValue > maxValue / 2 ? (
            <Text style={[styles.valueText, { fontSize: 36 }]}>
              {getCustomText(currentValue)}
            </Text>
          ) : (
            <>
              <Text style={styles.valueText}>{currentValue}h</Text>
              <Text style={styles.labelText}>{customLabel}</Text>
            </>
          )}
        </View>
      </View>

      {/* Helper text */}
      {showHelperText && (
        <Text style={styles.helperText}>
          Around {currentValue} hours
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sliderContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 72,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  helperText: {
    marginTop: 32,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
});
