import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

// Status types
type LockStatus = 'locked' | 'break' | 'unlocked';

interface Friend {
  id: string;
  name: string;
  screenTime: number; // minutes today
  status: LockStatus;
  streak?: number;
  avgScreenTime7d?: number;
  circlesTogether?: number;
  lockConsistency?: number; // percentage
}

// Mock data - sorted by screenTime (less = better rank)
const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Sarah', screenTime: 45, status: 'locked', streak: 12, avgScreenTime7d: 52, circlesTogether: 3, lockConsistency: 94 },
  { id: '2', name: 'Mike', screenTime: 67, status: 'locked', streak: 8, avgScreenTime7d: 78, circlesTogether: 1, lockConsistency: 87 },
  { id: 'me', name: 'You', screenTime: 89, status: 'locked', streak: 5, avgScreenTime7d: 95, circlesTogether: 0, lockConsistency: 72 },
  { id: '3', name: 'Alex', screenTime: 112, status: 'break', streak: 3, avgScreenTime7d: 120, circlesTogether: 2, lockConsistency: 65 },
  { id: '4', name: 'Emma', screenTime: 134, status: 'unlocked', streak: 0, avgScreenTime7d: 145, circlesTogether: 0, lockConsistency: 45 },
  { id: '5', name: 'Jordan', screenTime: 156, status: 'unlocked', streak: 1, avgScreenTime7d: 168, circlesTogether: 1, lockConsistency: 58 },
];

const PENDING_INCOMING = [
  { id: 'p1', name: 'Chris' },
  { id: 'p2', name: 'Taylor' },
];

const PENDING_OUTGOING = [
  { id: 'o1', name: 'Riley' },
];

type TabType = 'leaderboard' | 'friends';
type TimeScopeType = 'today' | '7days' | 'alltime';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('leaderboard');
  const [timeScope, setTimeScope] = useState<TimeScopeType>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const getStatusColor = (status: LockStatus) => {
    switch (status) {
      case 'locked': return Colors.spec.emerald500;
      case 'break': return Colors.spec.amber500;
      case 'unlocked': return Colors.primary[500];
    }
  };

  const getLeaderboard = () => {
    return [...MOCK_FRIENDS].sort((a, b) => a.screenTime - b.screenTime);
  };

  const getActiveFriends = () => {
    return MOCK_FRIENDS.filter(f => f.id !== 'me' && f.status !== 'unlocked');
  };

  const getAllFriends = () => {
    return MOCK_FRIENDS.filter(f => f.id !== 'me').sort((a, b) => a.name.localeCompare(b.name));
  };

  const getMicroFeedback = () => {
    const leaderboard = getLeaderboard();
    const myIndex = leaderboard.findIndex(f => f.id === 'me');
    if (myIndex === 0) {
      const diff = leaderboard[1]?.screenTime - leaderboard[0].screenTime;
      return `You're leading by ${diff}m 🔥`;
    } else {
      const diff = leaderboard[myIndex].screenTime - leaderboard[myIndex - 1].screenTime;
      return `You're ${diff}m behind ${leaderboard[myIndex - 1].name}`;
    }
  };

  const handleTabChange = (tab: TabType) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const handleTimeScopeChange = (scope: TimeScopeType) => {
    Haptics.selectionAsync();
    setTimeScope(scope);
  };

  const handleFriendPress = (friend: Friend) => {
    if (friend.id === 'me') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFriend(friend);
    setShowProfileModal(true);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAddModal(true);
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Friends</Text>
            <Text style={styles.subtitle}>Today's discipline</Text>
          </View>
          <Pressable onPress={handleAddPress} style={styles.addButton}>
            <Ionicons name="add" size={24} color={Colors.primary[500]} />
          </Pressable>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <Pressable
            style={[styles.segmentButton, activeTab === 'leaderboard' && styles.segmentButtonActive]}
            onPress={() => handleTabChange('leaderboard')}
          >
            <Text style={[styles.segmentText, activeTab === 'leaderboard' && styles.segmentTextActive]}>
              Leaderboard
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segmentButton, activeTab === 'friends' && styles.segmentButtonActive]}
            onPress={() => handleTabChange('friends')}
          >
            <Text style={[styles.segmentText, activeTab === 'friends' && styles.segmentTextActive]}>
              Friends
            </Text>
          </Pressable>
        </View>

        {/* Time Scope (Leaderboard only) */}
        {activeTab === 'leaderboard' && (
          <View style={styles.timeScopeContainer}>
            {(['today', '7days', 'alltime'] as TimeScopeType[]).map((scope) => (
              <Pressable
                key={scope}
                style={[styles.timeScopeChip, timeScope === scope && styles.timeScopeChipActive]}
                onPress={() => handleTimeScopeChange(scope)}
              >
                <Text style={[styles.timeScopeText, timeScope === scope && styles.timeScopeTextActive]}>
                  {scope === 'today' ? 'Today' : scope === '7days' ? '7 days' : 'All time'}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <View style={styles.leaderboardContainer}>
              {getLeaderboard().map((friend, index) => {
                const rank = index + 1;
                const isMe = friend.id === 'me';
                const isTop3 = rank <= 3;

                return (
                  <Pressable
                    key={friend.id}
                    style={[
                      styles.leaderboardRow,
                      isMe && styles.leaderboardRowMe,
                      isTop3 && styles.leaderboardRowTop3,
                    ]}
                    onPress={() => handleFriendPress(friend)}
                  >
                    {/* Rank */}
                    <View style={[styles.rankContainer, isTop3 && styles.rankContainerTop3]}>
                      <Text style={[styles.rankText, isTop3 && styles.rankTextTop3]}>
                        #{rank}
                      </Text>
                    </View>

                    {/* Avatar */}
                    <View style={[styles.avatar, isTop3 && styles.avatarTop3]}>
                      <Text style={[styles.avatarText, isTop3 && styles.avatarTextTop3]}>
                        {friend.name.charAt(0)}
                      </Text>
                    </View>

                    {/* Info */}
                    <View style={styles.leaderboardInfo}>
                      <Text style={[styles.leaderboardName, isMe && styles.leaderboardNameMe]}>
                        {friend.name}{isMe ? '' : ''}
                      </Text>
                      <Text style={styles.leaderboardTime}>
                        {formatTime(friend.screenTime)}
                      </Text>
                    </View>

                    {/* Status Dot */}
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(friend.status) }]} />
                  </Pressable>
                );
              })}

              {/* Micro Feedback */}
              <View style={styles.microFeedback}>
                <Text style={styles.microFeedbackText}>{getMicroFeedback()}</Text>
              </View>
            </View>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <View style={styles.friendsContainer}>
              {/* Active Friends */}
              {getActiveFriends().length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Active Today</Text>
                  {getActiveFriends().map((friend) => (
                    <Pressable
                      key={friend.id}
                      style={styles.friendRow}
                      onPress={() => handleFriendPress(friend)}
                    >
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{friend.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendTime}>{formatTime(friend.screenTime)} today</Text>
                      </View>
                      <View style={[styles.statusDotSmall, { backgroundColor: getStatusColor(friend.status) }]} />
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Pending */}
              {(PENDING_INCOMING.length > 0 || PENDING_OUTGOING.length > 0) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pending</Text>
                  {PENDING_INCOMING.map((request) => (
                    <View key={request.id} style={styles.pendingRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{request.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{request.name}</Text>
                        <Text style={styles.pendingLabel}>Wants to add you</Text>
                      </View>
                      <View style={styles.pendingActions}>
                        <Pressable style={styles.acceptButton}>
                          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                        </Pressable>
                        <Pressable style={styles.declineButton}>
                          <Ionicons name="close" size={18} color={Colors.spec.gray600} />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                  {PENDING_OUTGOING.map((request) => (
                    <View key={request.id} style={styles.pendingRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{request.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{request.name}</Text>
                        <Text style={styles.pendingLabel}>Request sent</Text>
                      </View>
                      <Text style={styles.pendingStatus}>Pending</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* All Friends */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>All Friends</Text>
                {getAllFriends().map((friend) => (
                  <Pressable
                    key={friend.id}
                    style={styles.friendRowSimple}
                    onPress={() => handleFriendPress(friend)}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{friend.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.friendNameSimple}>{friend.name}</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.spec.gray400} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Add Friend Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowAddModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowAddModal(false)}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Add Friend</Text>

              {/* Invite Link (Primary) */}
              <Pressable style={styles.addOptionPrimary}>
                <View style={styles.addOptionIcon}>
                  <Ionicons name="link" size={24} color={Colors.primary[500]} />
                </View>
                <View style={styles.addOptionContent}>
                  <Text style={styles.addOptionTitle}>Share Invite Link</Text>
                  <Text style={styles.addOptionSubtitle}>Send your personal invite</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.spec.gray400} />
              </Pressable>

              {/* Search Username */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.spec.gray400} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search username"
                  placeholderTextColor={Colors.spec.gray400}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <Pressable style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>

        {/* Friend Profile Modal */}
        <Modal
          visible={showProfileModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowProfileModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowProfileModal(false)}>
            <View style={styles.profileModalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHandle} />

              {selectedFriend && (
                <>
                  {/* Profile Header */}
                  <View style={styles.profileHeader}>
                    <View style={styles.profileAvatar}>
                      <Text style={styles.profileAvatarText}>{selectedFriend.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.profileName}>{selectedFriend.name}</Text>
                    <Text style={styles.profileTime}>{formatTime(selectedFriend.screenTime)} today</Text>
                    {selectedFriend.streak && selectedFriend.streak > 0 && (
                      <View style={styles.streakBadge}>
                        <Ionicons name="flame" size={14} color={Colors.spec.amber500} />
                        <Text style={styles.streakText}>{selectedFriend.streak} day streak</Text>
                      </View>
                    )}
                  </View>

                  {/* Stats */}
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{formatTime(selectedFriend.avgScreenTime7d || 0)}</Text>
                      <Text style={styles.statLabel}>Avg (7d)</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{selectedFriend.circlesTogether || 0}</Text>
                      <Text style={styles.statLabel}>Circles</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{selectedFriend.lockConsistency || 0}%</Text>
                      <Text style={styles.statLabel}>Consistency</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.profileActions}>
                    <Pressable style={styles.profileActionButton}>
                      <Ionicons name="people" size={20} color={Colors.primary[500]} />
                      <Text style={styles.profileActionText}>Invite to Circle</Text>
                    </Pressable>
                    <Pressable style={styles.profileActionButton}>
                      <Ionicons name="notifications-outline" size={20} color={Colors.spec.amber500} />
                      <Text style={styles.profileActionText}>Nudge</Text>
                    </Pressable>
                  </View>

                  <Pressable style={styles.removeButton}>
                    <Text style={styles.removeText}>Remove Friend</Text>
                  </Pressable>
                </>
              )}

              <Pressable style={styles.closeButton} onPress={() => setShowProfileModal(false)}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </AnimatedBackground >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.spec.gray500,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: Colors.spec.gray100,
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spec.gray500,
  },
  segmentTextActive: {
    color: Colors.spec.gray900,
  },
  // Time Scope
  timeScopeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 8,
  },
  timeScopeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.spec.gray100,
  },
  timeScopeChipActive: {
    backgroundColor: Colors.primary[500],
  },
  timeScopeText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.spec.gray600,
  },
  timeScopeTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // Leaderboard
  leaderboardContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  leaderboardRowMe: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
    backgroundColor: Colors.primary[50],
  },
  leaderboardRowTop3: {
    paddingVertical: 16,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankContainerTop3: {
    width: 36,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spec.gray500,
  },
  rankTextTop3: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary[500],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarTop3: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  avatarTextTop3: {
    fontSize: 18,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  leaderboardNameMe: {
    color: Colors.primary[600],
  },
  leaderboardTime: {
    fontSize: 13,
    color: Colors.spec.gray500,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  microFeedback: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  microFeedbackText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.spec.gray600,
  },
  // Friends Tab
  friendsContainer: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.spec.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  friendTime: {
    fontSize: 13,
    color: Colors.spec.gray500,
    marginTop: 2,
  },
  statusDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  pendingLabel: {
    fontSize: 12,
    color: Colors.spec.gray500,
    marginTop: 2,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.spec.emerald500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.spec.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingStatus: {
    fontSize: 12,
    color: Colors.spec.gray500,
  },
  friendRowSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.spec.gray100,
  },
  friendNameSimple: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.spec.gray900,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.spec.gray300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginBottom: 20,
  },
  addOptionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  addOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  addOptionContent: {
    flex: 1,
  },
  addOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  addOptionSubtitle: {
    fontSize: 13,
    color: Colors.spec.gray500,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.spec.gray100,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.spec.gray900,
    marginLeft: 10,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.spec.gray600,
  },
  // Profile Modal
  profileModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary[600],
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  profileTime: {
    fontSize: 14,
    color: Colors.spec.gray500,
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.spec.amber100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.spec.amber600,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.spec.gray50,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.spec.gray900,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.spec.gray500,
    marginTop: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  profileActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.spec.gray100,
    borderRadius: 12,
    paddingVertical: 14,
  },
  profileActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spec.gray700,
  },
  removeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[500],
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: Colors.spec.gray100,
    borderRadius: 12,
    marginTop: 8,
  },
  closeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.spec.gray700,
  },
});
