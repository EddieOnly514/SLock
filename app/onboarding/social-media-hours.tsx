import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ANIMATION_THEME } from '../../constants/AnimationTheme';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ITEM_HEIGHT = 70;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const hours = Array.from({ length: 13 }, (_, i) => i); // 0-12 hours

export default function SocialMediaHoursScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selectedHours, setSelectedHours] = useState(data.socialMediaHours || 4);
  const buttonScale = useSharedValue(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const lastHapticHour = useRef(selectedHours);

  // Premium Animation Values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  React.useEffect(() => {
    // Page Entry: 700ms duration, Bezier easing
    const { eased, duration } = ANIMATION_THEME;

    contentOpacity.value = withTiming(1, { duration: duration.slow, easing: eased });
    contentTranslateY.value = withTiming(0, { duration: duration.slow, easing: eased });

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: selectedHours * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.min(Math.max(index, 0), 12);

    if (clampedIndex !== selectedHours) {
      setSelectedHours(clampedIndex);

      if (clampedIndex !== lastHapticHour.current) {
        Haptics.selectionAsync();
        lastHapticHour.current = clampedIndex;
      }
    }
  }, [selectedHours]);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.min(Math.max(index, 0), 12);

    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });

    setSelectedHours(clampedIndex);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleHourPress = (hour: number) => {
    scrollViewRef.current?.scrollTo({
      y: hour * ITEM_HEIGHT,
      animated: true,
    });
    setSelectedHours(hour);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ socialMediaHours: selectedHours });
    setCurrentStep(5);
    router.push('/onboarding/impact-visualization');
  };

  // Button Interaction: Subtle scale (0.98), no spring
  const handlePressIn = () => {
    buttonScale.value = withTiming(0.98, {
      duration: ANIMATION_THEME.duration.fast,
      easing: ANIMATION_THEME.eased
    });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, {
      duration: ANIMATION_THEME.duration.fast,
      easing: ANIMATION_THEME.eased
    });
  };

  return (
    <AnimatedBackground>
      <ProgressBar currentStep={4} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.spacer} />

        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[Colors.primary[500], Colors.primary[600]]}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="phone-portrait" size={40} color="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text style={styles.question}>
            How many hours per day on social{'\u00A0'}media?
          </Text>

          <Text style={styles.subtext}>
            Your average daily{'\u00A0'}usage
          </Text>

          <View style={styles.pickerContainer}>
            <View style={styles.selectionIndicator} />
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onScroll={handleScroll}
              onMomentumScrollEnd={handleScrollEnd}
              scrollEventThrottle={16}
              contentContainerStyle={styles.pickerContent}
            >
              {hours.map((hour) => {
                const isSelected = hour === selectedHours;
                const distance = Math.abs(hour - selectedHours);
                // Smooth scaling curve for items
                const scale = isSelected ? 1.2 : Math.max(0.7, 1 - distance * 0.15);
                const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.25);

                return (
                  <Pressable
                    key={hour}
                    onPress={() => handleHourPress(hour)}
                    style={[styles.pickerItem, { height: ITEM_HEIGHT }]}
                  >
                    <Animated.View
                      style={[
                        styles.pickerItemContent,
                        {
                          transform: [{ scale }],
                          opacity,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          isSelected && styles.pickerItemTextSelected,
                        ]}
                      >
                        {hour}
                      </Text>
                      <Text
                        style={[
                          styles.pickerItemLabel,
                          isSelected && styles.pickerItemLabelSelected,
                        ]}
                      >
                        {hour === 1 ? 'hour' : 'hours'}
                      </Text>
                    </Animated.View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Per Week</Text>
                <Text style={styles.statValue}>{selectedHours * 7}h</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Per Month</Text>
                <Text style={styles.statValue}>{Math.round(selectedHours * 30)}h</Text>
              </View>
            </View>
          </View>

          <AnimatedPressable
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.buttonWrapper, buttonStyle]}
          >
            <LinearGradient
              colors={[Colors.primary[500], Colors.primary[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    height: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: Colors.spec.gray600,
    textAlign: 'center',
    marginBottom: 24,
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 20,
    right: 20,
    height: ITEM_HEIGHT,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    zIndex: -1,
  },
  pickerContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  pickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  pickerItemText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.spec.gray400,
  },
  pickerItemTextSelected: {
    color: Colors.primary[500],
  },
  pickerItemLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.spec.gray400,
  },
  pickerItemLabelSelected: {
    color: Colors.primary[500],
  },
  statsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.spec.gray600,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
