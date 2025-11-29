import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface GlassmorphButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const GlassmorphButton: React.FC<GlassmorphButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'large',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 44;
      case 'medium':
        return 52;
      case 'large':
        return 60;
      default:
        return 60;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 18;
    }
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={Colors.text.inverse} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: getFontSize(),
              color: variant === 'outline' ? Colors.text.inverse : Colors.text.inverse,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[animatedStyle, fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={
            disabled
              ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
              : ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.glassmorphContainer,
            {
              height: getButtonHeight(),
            },
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  if (variant === 'outline') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          animatedStyle,
          styles.outlineContainer,
          {
            height: getButtonHeight(),
          },
          fullWidth && { width: '100%' },
          disabled && styles.disabled,
          style,
        ]}
      >
        {renderContent()}
      </AnimatedTouchable>
    );
  }

  // Secondary variant
  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[
        animatedStyle,
        styles.secondaryContainer,
        {
          height: getButtonHeight(),
        },
        fullWidth && { width: '100%' },
        disabled && styles.disabled,
        style,
      ]}
    >
      {renderContent()}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  glassmorphContainer: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.onboarding.glassBorder,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.onboarding.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  outlineContainer: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.onboarding.glassBorder,
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryContainer: {
    borderRadius: 30,
    backgroundColor: Colors.onboarding.glassBackground,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.4,
  },
});
