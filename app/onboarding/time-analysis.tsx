import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

export default function TimeAnalysisScreen() {
  const router = useRouter();

  // Mock data - In production, calculate from actual screen time
  const totalHours = 42;
  const hoursPerDay = 6;
  const analogy = "watched 21 movies";
  const alternativeActivities = [
    "Read 2 books cover to cover",
    "Learn basics of a new language",
    "Complete 3 online courses",
    "Exercise for an entire week",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Screen Time</Text>
          <Text style={styles.subtitle}>
            Here's what we discovered from the past week
          </Text>
        </View>

        {/* Main Stats */}
        <View style={styles.statsCard}>
          <View style={styles.mainStat}>
            <Text style={styles.statNumber}>{totalHours}h</Text>
            <Text style={styles.statLabel}>Total Screen Time</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.secondaryStat}>
            <Text style={styles.statNumber}>{hoursPerDay}h</Text>
            <Text style={styles.statLabel}>per day average</Text>
          </View>
        </View>

        {/* Analogy */}
        <View style={styles.analogyCard}>
          <Text style={styles.analogyIcon}>⏰</Text>
          <Text style={styles.analogyTitle}>Time in Perspective</Text>
          <Text style={styles.analogyText}>
            In the past week, you could have{' '}
            <Text style={styles.analogyHighlight}>{analogy}</Text>
          </Text>
        </View>

        {/* What You Could Have Done */}
        <View style={styles.activitiesCard}>
          <Text style={styles.activitiesTitle}>
            Or you could have accomplished:
          </Text>
          {alternativeActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityBullet}>✓</Text>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            Ready to take control and make the most of your time?
          </Text>
        </View>

        {/* Continue Button */}
        <Button
          title="Let's Do This"
          onPress={() => router.push('/onboarding/create-profile')}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.secondary,
  },
  statsCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.md,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  statNumber: {
    fontSize: 56,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginBottom: Theme.spacing.lg,
  },
  secondaryStat: {
    alignItems: 'center',
  },
  analogyCard: {
    backgroundColor: Colors.warning[50],
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    alignItems: 'center',
  },
  analogyIcon: {
    fontSize: 48,
    marginBottom: Theme.spacing.md,
  },
  analogyTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  analogyText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  analogyHighlight: {
    color: Colors.warning[700],
    fontWeight: Theme.fontWeight.semibold,
  },
  activitiesCard: {
    backgroundColor: Colors.success[50],
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  activitiesTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  activityBullet: {
    fontSize: Theme.fontSize.md,
    color: Colors.success[600],
    marginRight: Theme.spacing.sm,
    fontWeight: Theme.fontWeight.bold,
  },
  activityText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  motivationCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  motivationText: {
    fontSize: Theme.fontSize.md,
    color: Colors.primary[700],
    textAlign: 'center',
    fontWeight: Theme.fontWeight.medium,
    lineHeight: 22,
  },
});
