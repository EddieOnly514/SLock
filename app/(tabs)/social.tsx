import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

interface Friend {
  id: string;
  username: string;
  treeHeight: number;
  screenTime: number; // minutes
  streak: number;
}

// Mock data
const MOCK_FRIENDS: Friend[] = [
  { id: '1', username: 'sarah_m', treeHeight: 85, screenTime: 120, streak: 7 },
  { id: '2', username: 'mike_k', treeHeight: 72, screenTime: 180, streak: 5 },
  { id: '3', username: 'alex_j', treeHeight: 68, screenTime: 210, streak: 4 },
];

const MY_DATA: Friend = {
  id: 'me',
  username: 'you',
  treeHeight: 78,
  screenTime: 145,
  streak: 6,
};

export default function SocialScreen() {
  const allUsers = [MY_DATA, ...MOCK_FRIENDS].sort(
    (a, b) => b.treeHeight - a.treeHeight
  );

  const renderFriendCard = ({ item, index }: { item: Friend; index: number }) => {
    const isMe = item.username === 'you';
    const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

    return (
      <View style={[styles.friendCard, isMe && styles.myCard]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankEmoji}>{rankEmoji || `#${index + 1}`}</Text>
        </View>

        <View style={styles.treeContainer}>
          <View style={[styles.tree, { height: item.treeHeight }]}>
            <Text style={styles.treeIcon}>🌳</Text>
          </View>
          <Text style={styles.treeHeight}>{item.treeHeight}%</Text>
        </View>

        <View style={styles.friendInfo}>
          <Text style={[styles.username, isMe && styles.myUsername]}>
            {isMe ? 'You' : item.username}
          </Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Screen Time</Text>
              <Text style={styles.statValue}>
                {Math.floor(item.screenTime / 60)}h {item.screenTime % 60}m
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>{item.streak} 🔥</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SLock</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Main Stats Card */}
        <View style={styles.mainStatsCard}>
          <Text style={styles.mainStatsTitle}>Your Progress Today</Text>
          <View style={styles.mainStatsRow}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{MY_DATA.screenTime}m</Text>
              <Text style={styles.mainStatLabel}>Screen Time</Text>
            </View>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{MY_DATA.treeHeight}%</Text>
              <Text style={styles.mainStatLabel}>Tree Growth</Text>
            </View>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{MY_DATA.streak} 🔥</Text>
              <Text style={styles.mainStatLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Leaderboard */}
        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardTitle}>Leaderboard</Text>
          <Text style={styles.leaderboardSubtitle}>
            Compare trees with friends
          </Text>
        </View>

        <FlatList
          data={allUsers}
          renderItem={renderFriendCard}
          keyExtractor={(item) => item.id || 'me'}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    color: Colors.primary[500],
  },
  addButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },
  addButtonText: {
    color: Colors.neutral.white,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
  },
  mainStatsCard: {
    backgroundColor: Colors.neutral.white,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.xl,
    ...Theme.shadow.md,
  },
  mainStatsTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  mainStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainStat: {
    alignItems: 'center',
  },
  mainStatValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.primary[500],
    marginBottom: Theme.spacing.xs,
  },
  mainStatLabel: {
    fontSize: Theme.fontSize.xs,
    color: Colors.text.tertiary,
  },
  leaderboardHeader: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  leaderboardTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  leaderboardSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  listContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
  },
  friendCard: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
    ...Theme.shadow.sm,
  },
  myCard: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: Theme.fontSize.xl,
  },
  treeContainer: {
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  tree: {
    width: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  treeIcon: {
    fontSize: 40,
  },
  treeHeight: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.success[600],
  },
  friendInfo: {
    flex: 1,
  },
  username: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  myUsername: {
    color: Colors.primary[600],
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: Theme.fontWeight.medium,
    color: Colors.text.primary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border.light,
    marginHorizontal: Theme.spacing.sm,
  },
});
