import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

export default function AddFriendsScreen() {
  const router = useRouter();
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  const syncMethods = [
    {
      id: 'instagram',
      icon: '📷',
      title: 'Instagram',
      description: 'Find friends from Instagram',
    },
    {
      id: 'contacts',
      icon: '📞',
      title: 'Contacts',
      description: 'Sync from your phone contacts',
    },
    {
      id: 'facebook',
      icon: '📘',
      title: 'Facebook',
      description: 'Connect with Facebook friends',
    },
  ];

  const toggleMethod = (methodId: string) => {
    // TODO: Implement actual sync logic
    console.log(`Sync with ${methodId}`);
  };

  const handleFinish = () => {
    // Complete onboarding
    router.replace('/(tabs)/social');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Friends</Text>
          <Text style={styles.subtitle}>
            Stay motivated together! Connect with friends to share progress and
            compete.
          </Text>
        </View>

        {/* Sync Methods */}
        <View style={styles.methodsContainer}>
          {syncMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodCard}
              onPress={() => toggleMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.methodIcon}>
                <Text style={styles.methodIconText}>{method.icon}</Text>
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>
                  {method.description}
                </Text>
              </View>
              <View style={styles.methodArrow}>
                <Text style={styles.methodArrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why add friends?</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🏆</Text>
            <Text style={styles.benefitText}>
              Compete on leaderboards and streaks
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>👀</Text>
            <Text style={styles.benefitText}>
              See each other's progress transparently
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💪</Text>
            <Text style={styles.benefitText}>
              Stay accountable and motivated together
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.footer}>
          <Button
            title="Finish Setup"
            onPress={handleFinish}
            fullWidth
          />
          <TouchableOpacity onPress={handleFinish}>
            <Text style={styles.skipText}>I'll add friends later</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
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
    lineHeight: 22,
  },
  methodsContainer: {
    marginBottom: Theme.spacing.xl,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  methodIconText: {
    fontSize: 24,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  methodArrow: {
    marginLeft: Theme.spacing.sm,
  },
  methodArrowText: {
    fontSize: Theme.fontSize.xl,
    color: Colors.primary[500],
  },
  benefitsCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  benefitsTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  benefitIcon: {
    fontSize: Theme.fontSize.lg,
    marginRight: Theme.spacing.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: Theme.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    marginTop: 'auto',
    gap: Theme.spacing.md,
  },
  skipText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
