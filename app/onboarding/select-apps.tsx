import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

interface App {
  id: string;
  name: string;
  icon: string;
  category: string;
}

// Mock data - In production, get from device
const POPULAR_APPS: App[] = [
  { id: '1', name: 'TikTok', icon: '📱', category: 'Social Media' },
  { id: '2', name: 'Instagram', icon: '📷', category: 'Social Media' },
  { id: '3', name: 'Twitter/X', icon: '🐦', category: 'Social Media' },
  { id: '4', name: 'Facebook', icon: '📘', category: 'Social Media' },
  { id: '5', name: 'YouTube', icon: '▶️', category: 'Video' },
  { id: '6', name: 'Snapchat', icon: '👻', category: 'Social Media' },
  { id: '7', name: 'Reddit', icon: '🤖', category: 'Social Media' },
  { id: '8', name: 'Netflix', icon: '🎬', category: 'Entertainment' },
];

export default function SelectAppsScreen() {
  const router = useRouter();
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const toggleApp = (appId: string) => {
    setSelectedApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const handleContinue = () => {
    if (selectedApps.length === 0) {
      alert('Please select at least one app to track');
      return;
    }
    // TODO: Save selected apps
    router.push('/onboarding/time-analysis');
  };

  const renderApp = ({ item }: { item: App }) => {
    const isSelected = selectedApps.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.appCard, isSelected && styles.appCardSelected]}
        onPress={() => toggleApp(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>{item.icon}</Text>
        </View>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>{item.name}</Text>
          <Text style={styles.appCategory}>{item.category}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Apps to Track</Text>
          <Text style={styles.subtitle}>
            Choose the apps you want to monitor and control
          </Text>
        </View>

        {/* App List */}
        <FlatList
          data={POPULAR_APPS}
          renderItem={renderApp}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Continue Button */}
        <View style={styles.footer}>
          <Text style={styles.selectedCount}>
            {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''}{' '}
            selected
          </Text>
          <Button
            title="Continue"
            onPress={handleContinue}
            fullWidth
            disabled={selectedApps.length === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
  },
  header: {
    paddingVertical: Theme.spacing.lg,
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
  listContent: {
    paddingBottom: Theme.spacing.md,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  appCardSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
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
  appCategory: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.neutral.white,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
  },
  footer: {
    paddingVertical: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  selectedCount: {
    textAlign: 'center',
    fontSize: Theme.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
});
