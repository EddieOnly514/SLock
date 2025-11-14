import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

// City pairs with approximate walking distances in km
const CITY_PAIRS = [
  { from: 'New York', to: 'Los Angeles', km: 4500 },
  { from: 'Paris', to: 'Moscow', km: 2850 },
  { from: 'Tokyo', to: 'Beijing', km: 2100 },
  { from: 'London', to: 'Istanbul', km: 3200 },
  { from: 'Sydney', to: 'Perth', km: 3300 },
];

export default function ImpactVisualizationScreen() {
  const router = useRouter();
  const { data, setCurrentStep } = useOnboarding();
  const hoursPerWeek = data.socialMediaHours || 15;

  // Calculate impact statistics
  const hoursPerYear = hoursPerWeek * 52;
  const daysPerYear = Math.round(hoursPerYear / 24);

  // Love Story is 3:55 = 3.92 minutes
  const loveStoryTimes = Math.floor(hoursPerYear * 60 / 3.92);

  // Marvel Cinematic Universe total runtime ~3000 minutes (50 hours)
  const marvelTimes = Math.floor(hoursPerYear / 50);

  // Walking: Average person walks 5 km/hour
  const totalWalkingKm = Math.round(hoursPerYear * 5);

  // Find a city pair that matches best
  const cityPair = CITY_PAIRS.find(pair => pair.km <= totalWalkingKm) || CITY_PAIRS[CITY_PAIRS.length - 1];
  const walkingTimes = Math.floor(totalWalkingKm / cityPair.km);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 90 }));
    opacity.value = withDelay(200, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(6);
    router.push('/onboarding/social-solution');
  };

  // Use days if it's a bigger, more impactful number
  const showDays = daysPerYear >= hoursPerYear;
  const mainNumber = showDays ? daysPerYear : hoursPerYear;
  const mainUnit = showDays ? 'days' : 'hours';

  return (
    <AnimatedBackground variant="darkPurple">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={5} totalSteps={11} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>This time could cost you</Text>
          </View>

          {/* Main impact number */}
          <View style={styles.impactSection}>
            <Animated.View style={[styles.impactCard, animatedStyle]}>
              <Text style={styles.impactNumber}>
                {mainNumber} {mainUnit}
              </Text>
              <Text style={styles.impactLabel}>a year</Text>

              <View style={styles.illustration}>
                <Text style={styles.illustrationEmoji}>😔</Text>
              </View>
            </Animated.View>
          </View>

          {/* What you could do instead */}
          <View style={styles.statsSection}>
            <Text style={styles.statsIntro}>
              That time equates to:
            </Text>

            <View style={styles.statsList}>
              {/* Love Story */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🎵</Text>
                <Text style={styles.statText}>
                  Listen to "Love Story" {' '}
                  <Text style={styles.statHighlight}>
                    {loveStoryTimes.toLocaleString()} times
                  </Text>
                </Text>
              </View>

              {/* Marvel Series */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🎬</Text>
                <Text style={styles.statText}>
                  Watch the entire Marvel series {' '}
                  <Text style={styles.statHighlight}>{marvelTimes} times</Text>
                </Text>
              </View>

              {/* Walking */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🚶</Text>
                <Text style={styles.statText}>
                  Walk from <Text style={styles.statHighlight}>{cityPair.from}</Text> to{' '}
                  <Text style={styles.statHighlight}>{cityPair.to}</Text>
                  {walkingTimes > 1 && (
                    <Text style={styles.statHighlight}> {walkingTimes} times</Text>
                  )}
                </Text>
              </View>

              {/* Productive alternatives */}
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>💼</Text>
                <Text style={styles.statText}>
                  Start an <Text style={styles.statHighlight}>entire business from scratch</Text>
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>📈</Text>
                <Text style={styles.statText}>
                  Learn how to <Text style={styles.statHighlight}>trade stocks</Text>
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🎓</Text>
                <Text style={styles.statText}>
                  Complete a{' '}
                  <Text style={styles.statHighlight}>Harvard online business course</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable onPress={handleContinue} style={styles.buttonWrapper}>
              <LinearGradient
                colors={Colors.onboarding.coralOrange}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>I want to change this</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

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
  headerSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  impactSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  impactCard: {
    alignItems: 'center',
    gap: 8,
  },
  impactNumber: {
    fontSize: 64,
    fontWeight: '800',
    color: '#FF6B6B',
    textAlign: 'center',
    lineHeight: 70,
  },
  impactLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
  },
  illustration: {
    marginTop: 16,
  },
  illustrationEmoji: {
    fontSize: 100,
  },
  statsSection: {
    gap: 20,
  },
  statsIntro: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
  },
  statsList: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.onboarding.cardGlass,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statEmoji: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  statText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  statHighlight: {
    fontWeight: '700',
    color: '#FF8E53',
  },
  footer: {
    paddingVertical: 24,
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
