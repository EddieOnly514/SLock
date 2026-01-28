import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
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

type PlanId = 'free' | 'monthly' | 'yearly';

const plans: Array<{
  id: PlanId;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  price: string;
  period: string;
  badge: string;
  badgeGradient: boolean;
  features: string[];
  monthlyPrice?: string;
}> = [
    {
      id: 'free',
      name: 'Free',
      icon: 'gift',
      price: '$0',
      period: 'forever',
      badge: 'Start Here',
      badgeGradient: false,
      features: [
        'Basic screen time tracking',
        'Daily goals & reminders',
        'Simple statistics',
        'Community support',
      ],
    },
    {
      id: 'monthly',
      name: 'Monthly',
      icon: 'flash',
      price: '$9.99',
      period: 'per month',
      badge: 'Popular',
      badgeGradient: false,
      features: [
        'Everything in Free',
        'Unlimited accountability partners',
        'Advanced analytics & insights',
        'Custom focus sessions',
        'Leaderboards & challenges',
        'Priority support',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      icon: 'diamond',
      price: '$79.99',
      period: 'per year',
      badge: 'Best Value - Save 33%',
      badgeGradient: true,
      monthlyPrice: 'Just $6.67/month',
      features: [
        'Everything in Monthly',
        'Lifetime streak protection',
        'Exclusive badges & rewards',
        'Early access to new features',
        'Personal coaching session',
        'Ad-free experience',
      ],
    },
  ];

export default function PricingScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(data.selectedPlan || 'free');
  const buttonScale = useSharedValue(1);

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  React.useEffect(() => {
    // 700ms Bezier Ease, no bounce
    contentOpacity.value = withTiming(1, {
      duration: ANIMATION_THEME.duration.slow,
      easing: ANIMATION_THEME.eased
    });
    contentTranslateY.value = withTiming(0, {
      duration: ANIMATION_THEME.duration.slow,
      easing: ANIMATION_THEME.eased
    });
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ selectedPlan });
    setCurrentStep(10);
    router.push('/onboarding/completion');
  };

  const handlePressIn = () => {
    // Scale 0.98, timing only
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
      <ProgressBar currentStep={9} totalSteps={11} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.spacer} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, contentStyle]}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtext}>
              Start free, upgrade anytime. No credit card{'\u00A0'}required.
            </Text>

            <View style={styles.plansContainer}>
              {plans.map((plan) => (
                <Pressable
                  key={plan.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedPlan(plan.id);
                  }}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.planCardSelected,
                  ]}
                >
                  {plan.badgeGradient ? (
                    <LinearGradient
                      colors={Colors.spec.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.badgeGradient}
                    >
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={[
                      styles.badge,
                      plan.id === 'free' ? styles.badgeGreen : styles.badgeBlue,
                    ]}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}

                  <View style={styles.planHeader}>
                    <View style={styles.planIconContainer}>
                      <Ionicons name={plan.icon} size={24} color={Colors.spec.blue600} />
                    </View>
                    <View>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planPeriod}>{plan.period}</Text>
                    </View>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{plan.price}</Text>
                    {plan.monthlyPrice && (
                      <Text style={styles.monthlyPrice}>{plan.monthlyPrice}</Text>
                    )}
                  </View>

                  <View style={styles.featuresContainer}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Ionicons name="checkmark" size={16} color={Colors.spec.emerald600} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {selectedPlan === plan.id && (
                    <View style={styles.selectionIndicator}>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            <AnimatedPressable
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.buttonWrapper, buttonStyle]}
            >
              <LinearGradient
                colors={Colors.spec.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {selectedPlan === 'free' ? 'Start Free' : 'Continue'}
                </Text>
              </LinearGradient>
            </AnimatedPressable>

            <Text style={styles.helperText}>
              Cancel anytime • No credit card required for free{'\u00A0'}plan
            </Text>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.spec.gray900,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    color: Colors.spec.gray600,
    textAlign: 'center',
    marginBottom: 32,
  },
  plansContainer: {
    width: '100%',
    gap: 24,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.spec.gray200,
    borderRadius: 24,
    padding: 24,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.spec.blue500,
    shadowColor: Colors.spec.blue500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeGradient: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeGreen: {
    backgroundColor: Colors.spec.emerald600,
  },
  badgeBlue: {
    backgroundColor: Colors.spec.blue600,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.spec.blue50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  planPeriod: {
    fontSize: 14,
    color: Colors.spec.gray600,
  },
  priceContainer: {
    marginBottom: 24,
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  monthlyPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.spec.emerald600,
    marginTop: 4,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.spec.gray700,
    lineHeight: 20,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.spec.blue600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.spec.blue500,
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
  helperText: {
    fontSize: 14,
    color: Colors.spec.gray400,
    marginTop: 16,
    textAlign: 'center',
  },
});
