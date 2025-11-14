import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  runOnJS,
  scrollTo,
  useAnimatedRef,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

const { height } = Dimensions.get('window');

interface ScrollPickerProps {
  minValue: number;
  maxValue: number;
  initialValue?: number;
  onValueChange: (value: number) => void;
  itemHeight?: number;
  visibleItems?: number;
  suffix?: string;
}

export const ScrollPicker: React.FC<ScrollPickerProps> = ({
  minValue,
  maxValue,
  initialValue,
  onValueChange,
  itemHeight = 60,
  visibleItems = 5,
  suffix = '',
}) => {
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const values = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => minValue + i
  );

  const containerHeight = itemHeight * visibleItems;
  const paddingVertical = (containerHeight - itemHeight) / 2;

  useEffect(() => {
    if (initialValue !== undefined) {
      const index = initialValue - minValue;
      const offset = index * itemHeight;
      scrollTo(scrollViewRef, 0, offset, false);
      scrollY.value = offset;
    }
  }, []);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const offset = event.contentOffset.y;
      const index = Math.round(offset / itemHeight);
      const snappedOffset = index * itemHeight;

      // Snap to nearest item
      scrollTo(scrollViewRef, 0, snappedOffset, true);

      // Calculate selected value and trigger callback
      const selectedValue = minValue + index;
      runOnJS(onValueChange)(selectedValue);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    },
  });

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {/* Selection indicator */}
      <View
        style={[
          styles.selectionIndicator,
          {
            height: itemHeight,
            top: paddingVertical,
          },
        ]}
      />

      {/* Gradient overlays */}
      <View style={[styles.gradientTop, { height: paddingVertical }]} />
      <View style={[styles.gradientBottom, { height: paddingVertical, bottom: 0 }]} />

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical,
        }}
      >
        {values.map((value, index) => (
          <PickerItem
            key={value}
            value={value}
            index={index}
            scrollY={scrollY}
            itemHeight={itemHeight}
            suffix={suffix}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

interface PickerItemProps {
  value: number;
  index: number;
  scrollY: Animated.SharedValue<number>;
  itemHeight: number;
  suffix: string;
}

const PickerItem: React.FC<PickerItemProps> = ({
  value,
  index,
  scrollY,
  itemHeight,
  suffix,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * itemHeight,
      (index - 1) * itemHeight,
      index * itemHeight,
      (index + 1) * itemHeight,
      (index + 2) * itemHeight,
    ];

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0.3, 0.5, 1, 0.5, 0.3],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      inputRange,
      [0.7, 0.85, 1.1, 0.85, 0.7],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      inputRange,
      [0, 0, 0, 0, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View style={[styles.item, { height: itemHeight }, animatedStyle]}>
      <Text style={styles.itemText}>
        {value}
        {suffix}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.onboarding.glassBackground,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.onboarding.glassBorder,
    zIndex: 1,
    pointerEvents: 'none',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(14, 30, 64, 0.95)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(14, 30, 64, 0.95)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});
