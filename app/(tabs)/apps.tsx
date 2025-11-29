import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

interface TrackedApp {
  id: string;
  name: string;
  icon: string;
  isBlocked: boolean;
  schedule?: string;
}

// Mock data
const MOCK_APPS: TrackedApp[] = [
  { id: '1', name: 'Instagram', icon: '📷', isBlocked: true, schedule: 'Daily 9AM-5PM' },
  { id: '2', name: 'TikTok', icon: '📱', isBlocked: true, schedule: 'Daily 9AM-5PM' },
  { id: '3', name: 'Twitter', icon: '🐦', isBlocked: false },
  { id: '4', name: 'YouTube', icon: '▶️', isBlocked: false },
];

export default function AppsScreen() {
  const [apps, setApps] = useState(MOCK_APPS);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<TrackedApp | null>(null);

  const toggleAppBlock = (appId: string) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === appId ? { ...app, isBlocked: !app.isBlocked } : app
      )
    );
  };

  const openSchedule = (app: TrackedApp) => {
    setSelectedApp(app);
    setShowTimerModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>App Control</Text>
          <TouchableOpacity>
            <Text style={styles.addAppText}>+ Add App</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Timer Card */}
        <View style={styles.quickTimerCard}>
          <Text style={styles.quickTimerTitle}>Start Focus Session</Text>
          <Text style={styles.quickTimerSubtitle}>
            Lock apps and grow your tree
          </Text>
          <View style={styles.timerPresets}>
            <TouchableOpacity style={styles.timerPreset}>
              <Text style={styles.timerPresetText}>15 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timerPreset}>
              <Text style={styles.timerPresetText}>30 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timerPreset}>
              <Text style={styles.timerPresetText}>1 hour</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timerPreset}>
              <Text style={styles.timerPresetText}>2 hours</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tracked Apps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Apps</Text>
          {apps.map((app) => (
            <View key={app.id} style={styles.appCard}>
              <View style={styles.appIcon}>
                <Text style={styles.appIconText}>{app.icon}</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>{app.name}</Text>
                {app.schedule && (
                  <Text style={styles.appSchedule}>{app.schedule}</Text>
                )}
              </View>
              <View style={styles.appActions}>
                <TouchableOpacity
                  style={[
                    styles.blockToggle,
                    app.isBlocked && styles.blockToggleActive,
                  ]}
                  onPress={() => toggleAppBlock(app.id)}
                >
                  <Text
                    style={[
                      styles.blockToggleText,
                      app.isBlocked && styles.blockToggleTextActive,
                    ]}
                  >
                    {app.isBlocked ? '🔒 Blocked' : '🔓 Active'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={() => openSchedule(app)}
                >
                  <Text style={styles.scheduleButtonText}>⏰</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Schedules Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Schedules</Text>
            <TouchableOpacity>
              <Text style={styles.createScheduleText}>+ Create</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleName}>Workday Focus</Text>
              <Text style={styles.scheduleTime}>Mon-Fri, 9:00 AM - 5:00 PM</Text>
              <Text style={styles.scheduleApps}>
                Instagram, TikTok, Twitter
              </Text>
            </View>
            <TouchableOpacity style={styles.scheduleToggle}>
              <View style={styles.scheduleToggleActive} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Timer Modal */}
      <Modal
        visible={showTimerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Schedule</Text>
            <Text style={styles.modalSubtitle}>
              for {selectedApp?.name}
            </Text>

            <View style={styles.modalDays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <TouchableOpacity key={index} style={styles.dayButton}>
                  <Text style={styles.dayButtonText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalTimeRow}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Start</Text>
                <Text style={styles.timeValue}>9:00 AM</Text>
              </View>
              <Text style={styles.timeSeparator}>→</Text>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>End</Text>
                <Text style={styles.timeValue}>5:00 PM</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowTimerModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={() => setShowTimerModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
  },
  addAppText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: Theme.fontWeight.semibold,
  },
  quickTimerCard: {
    backgroundColor: Colors.primary[500],
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.xl,
    ...Theme.shadow.md,
  },
  quickTimerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.neutral.white,
    marginBottom: Theme.spacing.xs,
  },
  quickTimerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary[50],
    marginBottom: Theme.spacing.md,
  },
  timerPresets: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  timerPreset: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  timerPresetText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.primary[500],
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
  createScheduleText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: Theme.fontWeight.semibold,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadow.sm,
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  appIconText: {
    fontSize: 28,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  appSchedule: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
  },
  appActions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  blockToggle: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.neutral[100],
  },
  blockToggleActive: {
    backgroundColor: Colors.error[50],
  },
  blockToggleText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.tertiary,
  },
  blockToggleTextActive: {
    color: Colors.error[600],
  },
  scheduleButton: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 18,
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  scheduleTime: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Theme.spacing.xs,
  },
  scheduleApps: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
  },
  scheduleToggle: {
    width: 50,
    height: 30,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.success[500],
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scheduleToggleActive: {
    width: 26,
    height: 26,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.neutral.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: Theme.borderRadius.xxl,
    borderTopRightRadius: Theme.borderRadius.xxl,
    padding: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxl,
  },
  modalTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  modalSubtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.tertiary,
    marginBottom: Theme.spacing.xl,
  },
  modalDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xl,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  modalTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xl,
  },
  timeInput: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Theme.spacing.xs,
  },
  timeValue: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
  },
  timeSeparator: {
    fontSize: Theme.fontSize.xl,
    color: Colors.text.tertiary,
    marginHorizontal: Theme.spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
