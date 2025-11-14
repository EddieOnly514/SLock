import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

type PlanType = 'free' | 'monthly' | 'yearly';

const plans = [
  {
    id: 'free' as PlanType,
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Track up to 3 apps',
      'Basic analytics',
      'Community support',
      '7-day lock sessions',
    ],
    gradient: Colors.onboarding.electricBlue,
  },
  {
    id: 'monthly' as PlanType,
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    features: [
      'Unlimited app tracking',
      'Advanced analytics',
      'Priority support',
      'Custom lock sessions',
      'Social accountability',
      'Leaderboards',
    ],
    gradient: Colors.onboarding.vibrantPurple,
    badge: 'Popular',
  },
  {
    id: 'yearly' as PlanType,
    name: 'Yearly',
    price: '$4.99',
    period: '/month',
    originalPrice: '$119.88',
    savings: 'Save 50%',
    features: [
      'Everything in Monthly',
      '50% OFF (billed yearly)',
      'Exclusive beta features',
      'Lifetime priority support',
    ],
    gradient: Colors.onboarding.pinkPurple,
    badge: 'Best Value',
  },
];

export default function PricingScreen() {
  const router = useRouter();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(data.selectedPlan || 'free');

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData({ selectedPlan });
    setCurrentStep(10);

    // Navigate to main app
    router.replace('/(tabs)/social');
  };

  return (
    <AnimatedBackground variant="deepSpace">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={10} totalSteps={11} showBackButton={false} />

        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Choose Your Plan</Text>
              <Text style={styles.subtitle}>
                Start free, upgrade anytime
              </Text>
            </View>

            {/* Plans */}
            <View style={styles.plansSection}>
              {plans.map((plan) => (
                <Pressable
                  key={plan.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedPlan(plan.id);
                  }}
                  style={styles.planWrapper}
                >
                  <LinearGradient
                    colors={
                      selectedPlan === plan.id
                        ? plan.gradient
                        : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.planCard, selectedPlan === plan.id && styles.planCardSelected]}
                  >
                    {plan.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
                      </View>
                    )}

                    <View style={styles.planHeader}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.price}>{plan.price}</Text>
                        <Text style={styles.period}>{plan.period}</Text>
                      </View>
                      {plan.originalPrice && (
                        <View style={styles.savingsRow}>
                          <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
                          <Text style={styles.savings}>{plan.savings}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.features}>
                      {plan.features.map((feature, index) => (
                        <View key={index} style={styles.feature}>
                          <Text style={styles.checkmark}>✓</Text>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {selectedPlan === plan.id && (
                      <View style={styles.selectedIndicator}>
                        <View style={styles.selectedDot} />
                      </View>
                    )}
                  </LinearGradient>
                </Pressable>
              ))}
            </View>

            {/* Footer notes */}
            <View style={styles.notesSection}>
              <Text style={styles.noteText}>
                • Auto-renewable. Cancel anytime.
              </Text>
              <Text style={styles.noteText}>
                • 7-day free trial for paid plans
              </Text>
            </View>
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable onPress={handleContinue} style={styles.buttonWrapper}>
              <LinearGradient
                colors={Colors.onboarding.glowBlue}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {selectedPlan === 'free' ? 'Start Free' : 'Start 7-Day Trial'}
                </Text>
              </LinearGradient>
            </Pressable>
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerSection: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  plansSection: {
    gap: 16,
    marginBottom: 24,
  },
  planWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  planCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  period: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ADE80',
  },
  features: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4361EE',
  },
  notesSection: {
    gap: 8,
    paddingVertical: 16,
  },
  noteText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
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
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});
