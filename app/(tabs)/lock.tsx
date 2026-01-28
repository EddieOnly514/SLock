import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import FloatingLockButton from '../../components/FloatingLockButton';
import LockPortal from '../../components/LockPortal';

export default function LockScreen() {
  const [isLocked, setIsLocked] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(6);
  const [focusTime, setFocusTime] = useState(0);
  const [showPortal, setShowPortal] = useState(false);

  const handleLock = () => {
    setShowPortal(true);
    setTimeout(() => {
      setIsLocked(!isLocked);
    }, 800);
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lock</Text>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={18} color="#F97316" />
            <Text style={styles.streakText}>{currentStreak}</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Focus Status Card */}
          <View style={styles.statusCard}>
            <LinearGradient
              colors={[Colors.primary[500], Colors.primary[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statusCardGradient}
            >
              <Text style={styles.statusLabel}>
                {isLocked ? 'Focus Session Active' : 'Ready to Lock In'}
              </Text>
              <Text style={styles.timeDisplay}>
                {Math.floor(focusTime / 60)}h {focusTime % 60}m
              </Text>
              <Text style={styles.timeLabel}>Today's Focus Time</Text>
            </LinearGradient>
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
              <Ionicons name="timer-outline" size={24} color={Colors.spec.blue600} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={24} color={Colors.spec.blue600} />
              <Text style={styles.statValue}>4.5h</Text>
              <Text style={styles.statLabel}>Avg/Day</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.spec.emerald600} />
              <Text style={styles.statValue}>89%</Text>
              <Text style={styles.statLabel}>Success</Text>
            </View>
          </View>
        </View>

        {/* Bottom Tip */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={20} color={Colors.spec.blue600} />
          <Text style={styles.tipText}>
            Lock your phone to earn focus points and grow your{'\u00A0'}streak
          </Text>
        </View>
      </SafeAreaView>

      {/* Lock Portal Animation */}
      <LockPortal
        visible={showPortal}
        onAnimationComplete={() => setShowPortal(false)}
      />
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.spec.orange50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.spec.orange100,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  statusCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: Colors.spec.blue500,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  statusCardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  lockButtonContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.spec.gray500,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.spec.gray200,
    marginHorizontal: 8,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.spec.blue50,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.spec.blue100,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.spec.gray700,
  },
});
