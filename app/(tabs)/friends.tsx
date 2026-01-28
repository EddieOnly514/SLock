import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  screenTime: number;
  lockedApps: number;
  hoursSaved: number;
  isOnline: boolean;
}

// Mock data
const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Sarah Miller', screenTime: 45, lockedApps: 3, hoursSaved: 2.5, isOnline: true },
  { id: '2', name: 'Mike Johnson', screenTime: 67, lockedApps: 5, hoursSaved: 1.8, isOnline: true },
  { id: '3', name: 'Alex Chen', screenTime: 89, lockedApps: 2, hoursSaved: 0.5, isOnline: false },
];

const PENDING_REQUESTS = [
  { id: 'p1', name: 'Eddie Wang' },
];

export default function FriendsScreen() {
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS);
  const [showEmptyState, setShowEmptyState] = useState(false); // Toggle for demo

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const handleAddFriends = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to add friends screen
  };

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Friends</Text>
              <Text style={styles.subtitle}>How your friends are{'\u00A0'}doing</Text>
            </View>
            <Pressable onPress={handleAddFriends} style={styles.addButton}>
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Friends</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Empty State */}
          {showEmptyState && (
            <Animated.View
              entering={FadeInDown.duration(600)}
              style={styles.emptyContainer}
            >
              <View style={styles.emptyIcon}>
                <Ionicons name="people-outline" size={56} color={Colors.spec.gray400} />
              </View>
              <Text style={styles.emptyTitle}>Connect with Friends</Text>
              <Text style={styles.emptySubtitle}>
                Add friends to see their progress and{'\u00A0'}compete together
              </Text>

              <View style={styles.connectOptions}>
                <Pressable style={styles.connectButton}>
                  <Ionicons name="book-outline" size={24} color={Colors.spec.blue600} />
                  <Text style={styles.connectButtonText}>Contacts</Text>
                </Pressable>
                <Pressable style={styles.connectButton}>
                  <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                  <Text style={styles.connectButtonText}>Instagram</Text>
                </Pressable>
                <Pressable style={styles.connectButton}>
                  <Ionicons name="link-outline" size={24} color={Colors.spec.blue600} />
                  <Text style={styles.connectButtonText}>Share Link</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}

          {/* Friends List */}
          {!showEmptyState && (
            <>
              {/* Me Card */}
              <Animated.View
                entering={FadeInDown.duration(600).delay(100)}
                style={styles.meCard}
              >
                <View style={styles.meHeader}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>EW</Text>
                    </View>
                    <View style={styles.onlineDot} />
                  </View>
                  <View style={styles.meInfo}>
                    <Text style={styles.meName}>Eddie Wang (me)</Text>
                    <Text style={styles.meTime}>2h 15m today</Text>
                  </View>
                  <View style={styles.streakBadge}>
                    <Ionicons name="flame" size={14} color="#F97316" />
                    <Text style={styles.streakText}>0</Text>
                  </View>
                </View>
                <View style={styles.meApps}>
                  <View style={styles.noAppsIcon}>
                    <Ionicons name="apps-outline" size={24} color={Colors.spec.gray400} />
                  </View>
                  <Text style={styles.noAppsText}>no apps</Text>
                </View>
              </Animated.View>

              {/* Friend Cards */}
              {friends.map((friend, index) => (
                <Animated.View
                  key={friend.id}
                  entering={FadeInDown.duration(600).delay(200 + index * 100)}
                >
                  <Pressable style={styles.friendCard}>
                    <View style={styles.friendHeader}>
                      <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, styles.friendAvatar]}>
                          <Text style={styles.avatarText}>
                            {friend.name.split(' ').map(n => n[0]).join('')}
                          </Text>
                        </View>
                        {friend.isOnline && <View style={styles.onlineDot} />}
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendTime}>{formatTime(friend.screenTime)} today</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors.spec.gray400} />
                    </View>
                    <View style={styles.friendStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="lock-closed" size={16} color={Colors.spec.blue600} />
                        <Text style={styles.statValue}>{friend.lockedApps} apps</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Ionicons name="time" size={16} color={Colors.spec.emerald600} />
                        <Text style={styles.statValue}>{friend.hoursSaved}h saved</Text>
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}

              {/* Pending Requests */}
              {PENDING_REQUESTS.length > 0 && (
                <Animated.View
                  entering={FadeInDown.duration(600).delay(500)}
                  style={styles.pendingSection}
                >
                  <Text style={styles.pendingTitle}>Pending Requests</Text>
                  {PENDING_REQUESTS.map((request) => (
                    <View key={request.id} style={styles.pendingCard}>
                      <View style={styles.avatarSmall}>
                        <Text style={styles.avatarTextSmall}>
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </View>
                      <View style={styles.pendingInfo}>
                        <Text style={styles.pendingName}>{request.name}</Text>
                        <Text style={styles.pendingStatus}>Request pending</Text>
                      </View>
                      <View style={styles.pendingActions}>
                        <Pressable style={styles.pendingButton}>
                          <Ionicons name="refresh" size={18} color={Colors.spec.gray600} />
                        </Pressable>
                        <Pressable style={styles.pendingButton}>
                          <Ionicons name="close" size={18} color={Colors.spec.gray600} />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </Animated.View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.spec.gray500,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.spec.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.spec.gray900,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.spec.gray500,
    textAlign: 'center',
    marginBottom: 32,
  },
  connectOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  connectButton: {
    width: 100,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  connectButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.spec.gray700,
    marginTop: 8,
  },
  // Me Card
  meCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.spec.blue500,
  },
  meHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.spec.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendAvatar: {
    backgroundColor: Colors.spec.blue100,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray700,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.spec.emerald500,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  meInfo: {
    flex: 1,
    marginLeft: 12,
  },
  meName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  meTime: {
    fontSize: 13,
    color: Colors.spec.gray500,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.spec.orange50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  meApps: {
    backgroundColor: Colors.spec.gray50,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.spec.gray300,
  },
  noAppsIcon: {
    marginBottom: 8,
  },
  noAppsText: {
    fontSize: 13,
    color: Colors.spec.gray500,
  },
  // Friend Card
  friendCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  friendTime: {
    fontSize: 13,
    color: Colors.spec.gray500,
  },
  friendStats: {
    flexDirection: 'row',
    backgroundColor: Colors.spec.gray50,
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.spec.gray700,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.spec.gray200,
    marginHorizontal: 8,
  },
  // Pending
  pendingSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spec.gray700,
    marginBottom: 12,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.spec.gray200,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.spec.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spec.gray700,
  },
  pendingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pendingName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.spec.gray900,
  },
  pendingStatus: {
    fontSize: 12,
    color: Colors.spec.gray500,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pendingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.spec.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
