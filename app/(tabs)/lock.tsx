import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';
import FloatingLockButton from '../../components/FloatingLockButton';
import LockPortal from '../../components/LockPortal';
import StreakFlame from '../../components/StreakFlame';

export default function LockScreen() {
  const [isLocked, setIsLocked] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(6);
  const [focusTime, setFocusTime] = useState(0); // minutes today
  const [showPortal, setShowPortal] = useState(false);

  const handleLock = () => {
    setShowPortal(true);
    setTimeout(() => {
      setIsLocked(!isLocked);
    }, 800);
  };

  return (
    <LinearGradient
      colors={Colors.gradient.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lock</Text>
          <StreakFlame streak={currentStreak} size="medium" animated />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Focus Status */}
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>
              {isLocked ? 'Focus Session Active' : 'Ready to Lock In'}
            </Text>
            <Text style={styles.timeDisplay}>
              {Math.floor(focusTime / 60)}h {focusTime % 60}m
            </Text>
            <Text style={styles.timeLabel}>Today's Focus Time</Text>
          </View>

          {/* Floating Lock Button */}
          <View style={styles.lockButtonContainer}>
            <FloatingLockButton
              onLock={handleLock}
              isLocked={isLocked}
            />
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.5h</Text>
              <Text style={styles.statLabel}>Avg/Day</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>89%</Text>
              <Text style={styles.statLabel}>Success</Text>
            </View>
          </View>
        </View>

        {/* Bottom Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 Lock your phone to earn focus points and grow your streak
          </Text>
        </View>
      </SafeAreaView>

      {/* Lock Portal Animation */}
      <LockPortal
        visible={showPortal}
        onAnimationComplete={() => setShowPortal(false)}
      />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  statusCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: Theme.borderRadius.xxl,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  statusLabel: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.secondary,
    marginBottom: Theme.spacing.md,
  },
  timeDisplay: {
    fontSize: Theme.fontSize.huge,
    fontWeight: Theme.fontWeight.extrabold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  timeLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  lockButtonContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.xxl,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: Theme.borderRadius.xxl,
    padding: Theme.spacing.lg,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Theme.spacing.sm,
  },
  tipCard: {
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  tipText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
