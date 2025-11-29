import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';
import ProgressPet from '../../components/ProgressPet';
import StreakFlame from '../../components/StreakFlame';

export default function RewardsScreen() {
  const [characterTheme, setCharacterTheme] = useState<'digitalCreature' | 'growingPlant' | 'miniAvatar' | 'energyCore'>('growingPlant');
  const [level, setLevel] = useState(12);
  const [progress, setProgress] = useState(65); // Progress to next level

  return (
    <LinearGradient
      colors={Colors.gradient.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Rewards</Text>
            <TouchableOpacity>
              <Text style={styles.historyLink}>History →</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Pet Card */}
          <View style={styles.petCard}>
            <ProgressPet
              progress={progress}
              level={level}
              theme={characterTheme}
              animated
            />
            <Text style={styles.motto}>Lock in. Level up.</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <StreakFlame streak={6} size="medium" animated />
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statValue}>24.5h</Text>
              <Text style={styles.statLabel}>Total Focus</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>89%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>2,590</Text>
              <Text style={styles.statLabel}>Focus Score</Text>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>🏆</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>First Lock</Text>
                  <Text style={styles.achievementDesc}>Complete your first focus session</Text>
                </View>
                <Text style={styles.achievementCheck}>✓</Text>
              </View>

              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>🔥</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Week Warrior</Text>
                  <Text style={styles.achievementDesc}>Maintain a 7-day streak</Text>
                </View>
                <View style={styles.achievementProgress}>
                  <Text style={styles.progressText}>6/7</Text>
                </View>
              </View>

              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>⚡</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Power Hour</Text>
                  <Text style={styles.achievementDesc}>Focus for 1 hour straight</Text>
                </View>
                <Text style={styles.achievementCheck}>✓</Text>
              </View>

              <View style={[styles.achievementCard, styles.lockedCard]}>
                <Text style={styles.achievementIcon}>👑</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Focus King</Text>
                  <Text style={styles.achievementDesc}>Reach #1 on leaderboard</Text>
                </View>
                <Text style={styles.achievementLock}>🔒</Text>
              </View>
            </View>
          </View>

          {/* Character Theme */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Character Theme</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.themesScroll}
            >
              <TouchableOpacity
                style={[styles.themeCard, characterTheme === 'growingPlant' && styles.themeActive]}
                onPress={() => setCharacterTheme('growingPlant')}
              >
                <Text style={styles.themeIcon}>🌳</Text>
                <Text style={styles.themeName}>Growing Plant</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeCard, characterTheme === 'digitalCreature' && styles.themeActive]}
                onPress={() => setCharacterTheme('digitalCreature')}
              >
                <Text style={styles.themeIcon}>🤖</Text>
                <Text style={styles.themeName}>Digital Creature</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeCard, characterTheme === 'miniAvatar' && styles.themeActive]}
                onPress={() => setCharacterTheme('miniAvatar')}
              >
                <Text style={styles.themeIcon}>👤</Text>
                <Text style={styles.themeName}>Mini Avatar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeCard, styles.themeLocked]}
                disabled
              >
                <Text style={styles.themeIcon}>⚡</Text>
                <Text style={styles.themeName}>Energy Core</Text>
                <Text style={styles.themeLockBadge}>Lvl 20</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: Theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
  },
  historyLink: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: Theme.fontWeight.semibold,
  },
  petCard: {
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  motto: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background.tertiary,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  statIcon: {
    fontSize: Theme.fontSize.xxxl,
    marginBottom: Theme.spacing.xs,
  },
  statValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  achievementsList: {
    gap: Theme.spacing.sm,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  lockedCard: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: Theme.fontSize.xxxl,
    marginRight: Theme.spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
  },
  achievementCheck: {
    fontSize: Theme.fontSize.xl,
    color: Colors.primary[500],
  },
  achievementLock: {
    fontSize: Theme.fontSize.lg,
  },
  achievementProgress: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.md,
  },
  progressText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.inverse,
  },
  themesScroll: {
    paddingRight: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  themeCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.md,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  themeActive: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
    ...Theme.shadow.glow,
  },
  themeLocked: {
    opacity: 0.5,
  },
  themeIcon: {
    fontSize: 40,
    marginBottom: Theme.spacing.xs,
  },
  themeName: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  themeLockBadge: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
});
