import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import ProgressBar from '../../components/onboarding/ProgressBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const testimonials = [
  {
    text: "Been using this for 3 weeks and I already feel more locked in than I've ever been.",
    rating: 5,
  },
  {
    text: 'The social accountability feature is a game-changer. My friends keep me motivated!',
    rating: 5,
  },
  {
    text: 'Finally an app that actually helps me stay focused. Worth every penny.',
    rating: 5,
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '4.8/5', label: 'App Store Rating' },
  { value: '3M+', label: 'Hours Reclaimed' },
];

export default function AnalyticsCredibilityScreen() {
  const router = useRouter();
  const { data, setCurrentStep } = useOnboarding();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(9);
    // Check if user is logged in - if not, go to auth-gate, otherwise go to pricing
    router.push('/auth/signup');
  };

  return (
    <AnimatedBackground variant="darkPurple">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ProgressBar currentStep={8} totalSteps={11} />

        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Join Thousands Who Have Transformed Their Lives</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsSection}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Testimonials */}
            <View style={styles.testimonialsSection}>
              <Text style={styles.sectionTitle}>What Our Users Say</Text>
              {testimonials.map((testimonial, index) => (
                <View key={index} style={styles.testimonialCard}>
                  <View style={styles.stars}>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Text key={i} style={styles.star}>
                        ⭐
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
                </View>
              ))}
            </View>

            {/* Trust indicators */}
            <View style={styles.trustSection}>
              <View style={styles.trustBadge}>
                <Text style={styles.trustEmoji}>🔒</Text>
                <Text style={styles.trustText}>Your data is secure & private</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustEmoji}>✅</Text>
                <Text style={styles.trustText}>Cancel anytime, no questions asked</Text>
              </View>
            </View>
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable onPress={handleContinue} style={styles.buttonWrapper}>
              <LinearGradient
                colors={Colors.onboarding.vibrantPurple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </Pressable>
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
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.onboarding.cardGlass,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9D4EDD',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  testimonialsSection: {
    gap: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  testimonialCard: {
    backgroundColor: Colors.onboarding.cardGlass,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 16,
  },
  testimonialText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  trustSection: {
    gap: 12,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(76, 201, 240, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.2)',
  },
  trustEmoji: {
    fontSize: 24,
  },
  trustText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
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
