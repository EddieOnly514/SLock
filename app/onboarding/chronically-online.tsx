import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

type OnlineLevel = 'nope' | 'a_little' | 'pretty_much' | 'extremely' | 'i_live_online';

const OPTIONS: Array<{
  value: OnlineLevel;
  emoji: string;
  title: string;
  subtext: string;
  colors: string[];
}> = [
  {
    value: 'nope',
    emoji: '😌',
    title: 'Nope',
    subtext: 'I barely use my phone',
    colors: Colors.onboarding.electricBlue,
  },
  {
    value: 'a_little',
    emoji: '🙂',
    title: 'A Little',
    subtext: 'I check my phone occasionally',
    colors: Colors.onboarding.glowBlue,
  },
  {
    value: 'pretty_much',
    emoji: '😬',
    title: 'Pretty Much',
    subtext: "I'm on my phone a lot",
    colors: ['#FFA500', '#FF8C00'],
  },
  {
    value: 'extremely',
    emoji: '😅',
    title: 'Extremely',
    subtext: 'My phone is always in my hand',
    colors: Colors.onboarding.coralOrange,
  },
  {
    value: 'i_live_online',
    emoji: '🤯',
    title: 'I Live Online',
    subtext: 'Screen time? More like screen life',
    colors: ['#FF0000', '#CC0000'],
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ChronicallyOnlineScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState<OnlineLevel | null>(
    (data.chronicallyOnlineLevel as OnlineLevel) || null
  );

  const handleSelect = (value: OnlineLevel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(value);
    updateData({ chronicallyOnlineLevel: value });

    // Auto-advance after brief delay
    setTimeout(() => {
      setCurrentStep(4);
      router.push('/onboarding/social-media-hours');
    }, 400);
  };

  return (
    <AnimatedBackground variant="darkPurple">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={3} totalSteps={11} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={styles.emoji}>📱</Text>
            <Text style={styles.question}>Are you chronically online?</Text>
            <Text style={styles.subtext}>
              Be honest - how much time do you spend scrolling?
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsSection}>
            {OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                option={option}
                isSelected={selected === option.value}
                onPress={() => handleSelect(option.value)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

interface OptionCardProps {
  option: typeof OPTIONS[0];
  isSelected: boolean;
  onPress: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.optionWrapper, animatedStyle]}
    >
      <LinearGradient
        colors={
          isSelected
            ? option.colors
            : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.option, isSelected && styles.optionSelected]}
      >
        <Text style={styles.optionEmoji}>{option.emoji}</Text>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionSubtext}>{option.subtext}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  questionSection: {
    marginTop: 32,
    marginBottom: 24,
    gap: 16,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  question: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsSection: {
    gap: 14,
  },
  optionWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  option: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  optionSelected: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 3,
  },
  optionEmoji: {
    fontSize: 48,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  optionSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
