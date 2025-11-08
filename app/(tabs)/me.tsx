import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

interface AppUsage {
  id: string;
  name: string;
  icon: string;
  duration: number; // minutes
  percentage: number;
}

// Mock data
const MOCK_APP_USAGE: AppUsage[] = [
  { id: '1', name: 'Instagram', icon: '📷', duration: 85, percentage: 35 },
  { id: '2', name: 'TikTok', icon: '📱', duration: 65, percentage: 27 },
  { id: '3', name: 'Twitter', icon: '🐦', duration: 45, percentage: 19 },
  { id: '4', name: 'YouTube', icon: '▶️', duration: 30, percentage: 12 },
  { id: '5', name: 'Others', icon: '📲', duration: 20, percentage: 7 },
];

export default function MeScreen() {
  const totalScreenTime = MOCK_APP_USAGE.reduce(
    (sum, app) => sum + app.duration,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.profilePhotoContainer}>
            <View style={styles.profilePhoto}>
              <Text style={styles.profilePhotoText}>👤</Text>
            </View>
            <TouchableOpacity style={styles.editPhotoButton}>
              <Text style={styles.editPhotoText}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>@username</Text>
          <TouchableOpacity>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>243</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Today's Screen Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Screen Time</Text>
          <View style={styles.screenTimeCard}>
            <View style={styles.screenTimeMain}>
              <Text style={styles.screenTimeValue}>
                {Math.floor(totalScreenTime / 60)}h {totalScreenTime % 60}m
              </Text>
              <Text style={styles.screenTimeLabel}>Total Time</Text>
            </View>
            <View style={styles.screenTimeComparison}>
              <Text style={styles.comparisonText}>↓ 23% from yesterday</Text>
            </View>
          </View>
        </View>

        {/* App Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App Breakdown</Text>
            <TouchableOpacity>
              <Text style={styles.manageText}>Manage Apps</Text>
            </TouchableOpacity>
          </View>

          {MOCK_APP_USAGE.map((app) => (
            <View key={app.id} style={styles.appUsageItem}>
              <View style={styles.appUsageLeft}>
                <View style={styles.appIcon}>
                  <Text style={styles.appIconText}>{app.icon}</Text>
                </View>
                <View style={styles.appUsageInfo}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appDuration}>
                    {Math.floor(app.duration / 60)}h {app.duration % 60}m
                  </Text>
                </View>
              </View>
              <View style={styles.appUsageRight}>
                <Text style={styles.appPercentage}>{app.percentage}%</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${app.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Activity Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Analysis</Text>
          <View style={styles.analysisCard}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisIcon}>🔥</Text>
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisLabel}>Current Streak</Text>
                <Text style={styles.analysisValue}>6 days</Text>
              </View>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisIcon}>🏆</Text>
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisLabel}>Longest Streak</Text>
                <Text style={styles.analysisValue}>12 days</Text>
              </View>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisIcon}>⏱️</Text>
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisLabel}>Focus Sessions</Text>
                <Text style={styles.analysisValue}>45 completed</Text>
              </View>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisIcon}>🌳</Text>
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisLabel}>Tree Growth</Text>
                <Text style={styles.analysisValue}>78%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    paddingBottom: Theme.spacing.xxl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
    backgroundColor: Colors.neutral.white,
    marginBottom: Theme.spacing.lg,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.md,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  profilePhotoText: {
    fontSize: 50,
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  editPhotoText: {
    fontSize: 14,
  },
  username: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  editProfileText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: Theme.fontWeight.medium,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    ...Theme.shadow.sm,
  },
  statNumber: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  section: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  manageText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: Theme.fontWeight.medium,
  },
  screenTimeCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.sm,
  },
  screenTimeMain: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  screenTimeValue: {
    fontSize: 40,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  screenTimeLabel: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.tertiary,
  },
  screenTimeComparison: {
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.success[600],
    fontWeight: Theme.fontWeight.medium,
  },
  appUsageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  appUsageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  appIconText: {
    fontSize: 20,
  },
  appUsageInfo: {
    flex: 1,
  },
  appName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  appDuration: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  appUsageRight: {
    alignItems: 'flex-end',
    marginLeft: Theme.spacing.md,
  },
  appPercentage: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  progressBarContainer: {
    width: 60,
    height: 4,
    backgroundColor: Colors.neutral[100],
    borderRadius: Theme.borderRadius.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: Theme.borderRadius.xs,
  },
  analysisCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.sm,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  analysisIcon: {
    fontSize: 32,
    marginRight: Theme.spacing.md,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: 2,
  },
  analysisValue: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
  },
});
