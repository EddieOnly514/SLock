import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

interface Friend {
  id: string;
  username: string;
  treeHeight: number;
  screenTime: number;
  streak: number;
}

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

// Rank icons
const getRankIcon = (index: number) => {
  if (index === 0) return <Ionicons name="trophy" size={22} color="#FFD700" />;
  if (index === 1) return <Ionicons name="medal" size={22} color="#C0C0C0" />;
  if (index === 2) return <Ionicons name="medal-outline" size={22} color="#CD7F32" />;
  return <Text style={styles.rankNumber}>#{index + 1}</Text>;
};

export default function SocialScreen() {
  const allUsers = [MY_DATA, ...MOCK_FRIENDS].sort(
    (a, b) => b.treeHeight - a.treeHeight
  );

  const renderFriendCard = ({ item, index }: { item: Friend; index: number }) => {
    const isMe = item.username === 'you';

    return (
      <View style={[styles.friendCard, isMe && styles.myCard]}>
        <View style={styles.rankContainer}>
          {getRankIcon(index)}
        </View>

        <View style={styles.treeContainer}>
          <View style={[styles.tree, { height: item.treeHeight }]}>
            <Ionicons name="leaf" size={32} color={Colors.spec.emerald600} />
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
              <View style={styles.streakRow}>
                <Text style={styles.statValue}>{item.streak}</Text>
                <Ionicons name="flame" size={14} color="#F97316" />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>SLock</Text>
            <Pressable style={styles.addButton}>
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Ionicons name="person-add" size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Friends</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Main Stats Card */}
          <View style={styles.mainStatsCard}>
            <LinearGradient
              colors={[Colors.primary[500], Colors.primary[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statsCardGradient}
            >
              <Text style={styles.mainStatsTitle}>Your Progress Today</Text>
              <View style={styles.mainStatsRow}>
                <View style={styles.mainStat}>
                  <Text style={styles.mainStatValue}>{MY_DATA.screenTime}m</Text>
                  <Text style={styles.mainStatLabel}>Screen Time</Text>
                </View>
                <View style={styles.statDividerVertical} />
                <View style={styles.mainStat}>
                  <Text style={styles.mainStatValue}>{MY_DATA.treeHeight}%</Text>
                  <Text style={styles.mainStatLabel}>Tree Growth</Text>
                </View>
                <View style={styles.statDividerVertical} />
                <View style={styles.mainStat}>
                  <View style={styles.streakRowMain}>
                    <Text style={styles.mainStatValue}>{MY_DATA.streak}</Text>
                    <Ionicons name="flame" size={18} color="#FFFFFF" />
                  </View>
                  <Text style={styles.mainStatLabel}>Day Streak</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Leaderboard */}
          <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardTitle}>Leaderboard</Text>
            <Text style={styles.leaderboardSubtitle}>
              Compare trees with{'\u00A0'}friends
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
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
    color: Colors.spec.blue600,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mainStatsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.spec.blue500,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  statsCardGradient: {
    padding: 20,
  },
  mainStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  mainStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mainStat: {
    alignItems: 'center',
    flex: 1,
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  streakRowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statDividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  leaderboardHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: Colors.spec.gray600,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  friendCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  myCard: {
    borderWidth: 2,
    borderColor: Colors.spec.blue500,
    backgroundColor: Colors.spec.blue50,
  },
  rankContainer: {
    width: 36,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray500,
  },
  treeContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  tree: {
    width: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 4,
  },
  treeHeight: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.spec.emerald600,
  },
  friendInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray900,
    marginBottom: 8,
  },
  myUsername: {
    color: Colors.spec.blue600,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.spec.gray500,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.spec.gray900,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.spec.gray200,
    marginHorizontal: 12,
  },
});
