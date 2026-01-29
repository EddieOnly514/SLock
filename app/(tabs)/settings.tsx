import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear auth and redirect
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const accountSettings: SettingItem[] = [
    {
      id: 'profile',
      title: 'Edit Profile',
      subtitle: 'Update your username and photo',
      icon: 'person-outline',
      onPress: () => console.log('Edit profile'),
      showArrow: true,
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Control who can see your activity',
      icon: 'lock-closed-outline',
      onPress: () => console.log('Privacy settings'),
      showArrow: true,
    },
    {
      id: 'friends',
      title: 'Friends & Following',
      subtitle: 'Manage your connections',
      icon: 'people-outline',
      onPress: () => console.log('Manage friends'),
      showArrow: true,
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Customize alerts and reminders',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
      showArrow: true,
    },
    {
      id: 'theme',
      title: 'Theme',
      subtitle: 'Light or dark mode',
      icon: 'color-palette-outline',
      onPress: () => console.log('Theme'),
      showArrow: true,
    },
    {
      id: 'tracking',
      title: 'App Tracking',
      subtitle: 'Manage tracked apps',
      icon: 'analytics-outline',
      onPress: () => console.log('App tracking'),
      showArrow: true,
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with SLock',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help'),
      showArrow: true,
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve SLock',
      icon: 'chatbubble-outline',
      onPress: () => console.log('Feedback'),
      showArrow: true,
    },
    {
      id: 'about',
      title: 'About SLock',
      subtitle: 'Version 1.0.0',
      icon: 'information-circle-outline',
      onPress: () => console.log('About'),
      showArrow: true,
    },
  ];

  const dangerSettings: SettingItem[] = [
    {
      id: 'logout',
      title: 'Log Out',
      icon: 'log-out-outline',
      onPress: handleLogout,
      danger: true,
    },
    {
      id: 'delete',
      title: 'Delete Account',
      icon: 'trash-outline',
      onPress: () => console.log('Delete account'),
      danger: true,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, item.danger && styles.settingItemDanger]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, item.danger && styles.settingIconDanger]}>
        <Ionicons name={item.icon as any} size={22} color={item.danger ? Colors.error[500] : Colors.primary[500]} />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[styles.settingTitle, item.danger && styles.settingTitleDanger]}
        >
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      {item.showArrow && (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace('/profile');
            }}
          >
            <Ionicons name="chevron-back" size={28} color={Colors.primary[500]} />
          </Pressable>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsGroup}>
            {accountSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingsGroup}>
            {appSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsGroup}>
            {supportSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.settingsGroup}>
            {dangerSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with care to help you focus
          </Text>
          <Text style={styles.footerText}>© 2025 SLock</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.primary[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  settingsGroup: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  settingItemDanger: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  settingIconDanger: {
    backgroundColor: Colors.error[50],
  },
  settingIconText: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  settingTitleDanger: {
    color: Colors.error[500],
  },
  settingSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  settingArrow: {
    fontSize: 24,
    color: Colors.text.tertiary,
    marginLeft: Theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  footerText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Theme.spacing.xs,
  },
});
