import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';
import StreakFlame from '../../components/StreakFlame';

interface Friend {
  id: string;
  username: string;
  focusScore: number;
  screenTime: number; // minutes
  streak: number;
  status: 'locked' | 'active' | 'offline';
}

// Mock data
const MOCK_FRIENDS: Friend[] = [
  { id: '1', username: 'sarah_m', focusScore: 2850, screenTime: 45, streak: 12, status: 'locked' },
  { id: '2', username: 'mike_k', focusScore: 2720, screenTime: 67, streak: 8, status: 'active' },
  { id: '3', username: 'alex_j', focusScore: 2680, screenTime: 89, streak: 6, status: 'offline' },
  { id: '4', username: 'you', focusScore: 2590, screenTime: 72, streak: 6, status: 'active' },
];

export default function FriendsScreen() {
  const sortedFriends = [...MOCK_FRIENDS].sort((a, b) => b.focusScore - a.focusScore);

  const renderFriendCard = ({ item, index }: { item: Friend; index: number }) => {
    const isMe = item.username === 'you';
    const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
    const statusColor =
      item.status === 'locked' ? Colors.primary[500] :
      item.status === 'active' ? Colors.accent[500] :
      Colors.neutral[500];

    return (
      <View style={[styles.friendCard, isMe && styles.myCard]}>
        {/* Rank */}
        <View style={styles.rankContainer}>
          <Text style={styles.rankEmoji}>{rankEmoji || `#${index + 1}`}</Text>
        </View>

        {/* User Info */}
        <View style={styles.friendInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.username, isMe && styles.myUsername]}>
              {isMe ? 'You' : item.username}
            </Text>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Focus Score</Text>
              <Text style={styles.statValue}>{item.focusScore}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Streak</Text>
              <StreakFlame streak={item.streak} size="small" animated />
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Screen Time</Text>
              <Text style={styles.statValue}>{item.screenTime}m</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={Colors.gradient.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Squad Feed Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Squad Feed</Text>
          <Text style={styles.sectionSubtitle}>Live focus streaks</Text>
        </View>

        {/* Leaderboard */}
        <FlatList
          data={sortedFriends}
          renderItem={renderFriendCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  addButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.xl,
    ...Theme.shadow.glow,
  },
  addButtonText: {
    color: Colors.text.inverse,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.bold,
  },
  sectionHeader: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  listContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
  },
  friendCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.tertiary,
    borderRadius: Theme.borderRadius.xxl,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Theme.shadow.sm,
  },
  myCard: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
    backgroundColor: Colors.background.elevated,
    ...Theme.shadow.glow,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankEmoji: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
  },
  friendInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  username: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginRight: Theme.spacing.sm,
  },
  myUsername: {
    color: Colors.primary[500],
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: Theme.borderRadius.full,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.secondary,
  },
});
