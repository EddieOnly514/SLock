import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeIn,
    FadeInUp,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue,
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/Colors';
import { CRAB_MESSAGES, MOCK_MEMBERS, CommitmentLevel, CircleMember } from '../../constants/circles';

export default function ActiveCircleScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        name: string;
        duration: string;
        inviteCode: string;
        appBlockingEnabled: string;
        commitmentLevel: string;
    }>();

    // Timer state
    const durationMinutes = parseInt(params.duration || '25');
    const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
    const [isActive, setIsActive] = useState(true);

    // Members state
    const [members] = useState<CircleMember[]>(MOCK_MEMBERS);

    // Crab message state
    const [crabMessage, setCrabMessage] = useState(CRAB_MESSAGES.focused[0]);

    // Modal states
    const [showBlockedApps, setShowBlockedApps] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    // Animations
    const pulseScale = useSharedValue(1);
    const crabBounce = useSharedValue(0);

    // Timer countdown
    useEffect(() => {
        if (!isActive || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsActive(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeRemaining]);

    // Rotate crab messages
    useEffect(() => {
        const interval = setInterval(() => {
            const focusedCount = members.filter((m) => m.status === 'focused').length;
            const leftCount = members.filter((m) => m.status === 'left').length;

            let messages = CRAB_MESSAGES.focused;
            if (leftCount > 0) {
                messages = CRAB_MESSAGES.someoneLeft;
            }

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            setCrabMessage(randomMessage);
        }, 8000);

        return () => clearInterval(interval);
    }, [members]);

    // Pulse animation
    useEffect(() => {
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    // Crab bounce
    useEffect(() => {
        crabBounce.value = withRepeat(
            withSequence(
                withTiming(-4, { duration: 500 }),
                withTiming(0, { duration: 500 })
            ),
            -1,
            true
        );
    }, []);

    const timerPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const crabBounceStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: crabBounce.value }],
    }));

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'focused': return Colors.spec.emerald500;
            case 'paused': return Colors.spec.amber500;
            case 'left': return Colors.primary[500];
            default: return Colors.spec.gray400;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'focused': return 'Focused';
            case 'paused': return 'Paused';
            case 'left': return 'Left';
            default: return status;
        }
    };

    const handleLeave = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowLeaveConfirm(true);
    };

    const confirmLeave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setShowLeaveConfirm(false);
        router.replace('/(tabs)');
    };

    const getLeaveWarning = () => {
        const level = params.commitmentLevel as CommitmentLevel;
        switch (level) {
            case 'chill': return 'No worries! You can leave anytime.';
            case 'locked_in': return 'Your blocked apps will become available again.';
            case 'hardcore': return 'Everyone will know you left early!';
            default: return 'Are you sure you want to leave?';
        }
    };

    const progress = 1 - timeRemaining / (durationMinutes * 60);

    return (
        <View style={styles.container}>
            {/* Red background */}
            <View style={styles.background} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.homeButton} onPress={() => router.replace('/(tabs)')}>
                        <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.8)" />
                    </Pressable>
                    <View style={styles.circleInfo}>
                        <Text style={styles.circleName}>{params.name || 'Study Circle'}</Text>
                        <View style={styles.inviteCodeBadge}>
                            <Text style={styles.inviteCodeText}>{params.inviteCode}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Timer Card */}
                    <Animated.View style={[styles.timerCard, timerPulseStyle]}>
                        <Text style={styles.timerLabel}>Time Remaining</Text>
                        <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                            </View>
                            <Text style={styles.progressText}>{Math.round(progress * 100)}% complete</Text>
                        </View>
                    </Animated.View>

                    {/* Members Section */}
                    <View style={styles.membersSection}>
                        <Text style={styles.sectionTitle}>Circle Members</Text>
                        <View style={styles.membersList}>
                            {members.map((member) => (
                                <View key={member.id} style={styles.memberCard}>
                                    <View style={styles.memberAvatar}>
                                        <Text style={styles.memberInitial}>
                                            {member.username.charAt(0).toUpperCase()}
                                        </Text>
                                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
                                    </View>
                                    <View style={styles.memberInfo}>
                                        <Text style={styles.memberName}>{member.username}</Text>
                                        <Text style={[styles.memberStatus, { color: getStatusColor(member.status) }]}>
                                            {getStatusLabel(member.status)}
                                        </Text>
                                    </View>
                                    {member.status === 'focused' && (
                                        <Ionicons name="flame" size={16} color={Colors.spec.amber500} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Crab Section */}
                    <View style={styles.crabSection}>
                        <Animated.View style={[styles.crabContainer, crabBounceStyle]}>
                            <View style={styles.crabIconBg}>
                                <Ionicons name="flame" size={32} color={Colors.primary[500]} />
                            </View>
                        </Animated.View>
                        <Text style={styles.crabMessage}>{crabMessage}</Text>
                    </View>
                </ScrollView>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                    <Pressable style={styles.viewAppsButton} onPress={() => setShowBlockedApps(true)}>
                        <Ionicons name="apps-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.viewAppsText}>View Blocked Apps</Text>
                    </Pressable>

                    <Pressable style={styles.leaveButton} onPress={handleLeave}>
                        <Ionicons name="exit-outline" size={20} color={Colors.primary[500]} />
                        <Text style={styles.leaveText}>Leave Circle</Text>
                    </Pressable>
                </View>
            </SafeAreaView>

            {/* Blocked Apps Modal */}
            <Modal visible={showBlockedApps} transparent animationType="fade" onRequestClose={() => setShowBlockedApps(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setShowBlockedApps(false)}>
                    <Animated.View entering={FadeInUp.duration(300)} style={styles.appsModal}>
                        <Pressable onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Blocked Apps</Text>
                                <Text style={styles.modalSubtitle}>
                                    {params.appBlockingEnabled === 'true' ? 'These apps are blocked' : 'App blocking is disabled'}
                                </Text>
                            </View>

                            {params.appBlockingEnabled === 'true' ? (
                                <View style={styles.blockedAppsList}>
                                    {['Instagram', 'TikTok', 'Twitter', 'YouTube', 'Snapchat'].map((app) => (
                                        <View key={app} style={styles.blockedAppItem}>
                                            <Ionicons name="phone-portrait-outline" size={20} color={Colors.spec.gray500} />
                                            <Text style={styles.blockedAppName}>{app}</Text>
                                            <Ionicons name="lock-closed" size={14} color={Colors.primary[500]} />
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.noBlockingMessage}>
                                    <Ionicons name="shield-outline" size={48} color={Colors.spec.gray400} />
                                    <Text style={styles.noBlockingText}>App blocking is not enabled</Text>
                                </View>
                            )}

                            <Pressable style={styles.closeModalButton} onPress={() => setShowBlockedApps(false)}>
                                <Text style={styles.closeModalText}>Close</Text>
                            </Pressable>
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </Modal>

            {/* Leave Confirmation Modal */}
            <Modal visible={showLeaveConfirm} transparent animationType="fade" onRequestClose={() => setShowLeaveConfirm(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setShowLeaveConfirm(false)}>
                    <Animated.View entering={FadeIn.duration(200)} style={styles.leaveModal}>
                        <Pressable onPress={(e) => e.stopPropagation()}>
                            <View style={styles.leaveModalIcon}>
                                <Ionicons name="warning" size={32} color={Colors.spec.amber500} />
                            </View>
                            <Text style={styles.leaveModalTitle}>Leave Circle?</Text>
                            <Text style={styles.leaveModalWarning}>{getLeaveWarning()}</Text>

                            <View style={styles.leaveModalButtons}>
                                <Pressable style={styles.cancelLeaveButton} onPress={() => setShowLeaveConfirm(false)}>
                                    <Text style={styles.cancelLeaveText}>Stay Focused</Text>
                                </Pressable>
                                <Pressable style={styles.confirmLeaveButton} onPress={confirmLeave}>
                                    <Text style={styles.confirmLeaveText}>Leave</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.primary[500],
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 16,
    },
    homeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    circleName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    inviteCodeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    inviteCodeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    // Timer
    timerCard: {
        marginHorizontal: 24,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    timerLabel: {
        fontSize: 14,
        color: Colors.spec.gray500,
        marginBottom: 8,
    },
    timerDisplay: {
        fontSize: 64,
        fontWeight: '700',
        color: Colors.primary[500],
        letterSpacing: 4,
    },
    progressContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 6,
        backgroundColor: Colors.spec.gray200,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary[500],
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: Colors.spec.gray500,
        marginTop: 8,
    },
    // Members
    membersSection: {
        marginTop: 24,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 12,
    },
    membersList: {
        gap: 10,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
    },
    memberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        position: 'relative',
    },
    memberInitial: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary[600],
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray900,
        marginBottom: 2,
    },
    memberStatus: {
        fontSize: 13,
        fontWeight: '500',
    },
    // Crab/Status Section
    crabSection: {
        marginTop: 24,
        marginHorizontal: 24,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
    },
    crabContainer: {
        marginBottom: 12,
    },
    crabIconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
    crabMessage: {
        fontSize: 16,
        color: Colors.spec.gray700,
        textAlign: 'center',
        fontWeight: '500',
    },
    // Bottom Controls
    bottomControls: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 34,
        paddingTop: 16,
        gap: 12,
        backgroundColor: Colors.primary[600],
    },
    viewAppsButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
        paddingVertical: 14,
    },
    viewAppsText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    leaveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 14,
    },
    leaveText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.primary[500],
    },
    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    appsModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxHeight: '70%',
    },
    modalHeader: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.spec.gray500,
    },
    blockedAppsList: {
        gap: 8,
    },
    blockedAppItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 12,
        padding: 14,
        gap: 12,
    },
    blockedAppName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: Colors.spec.gray700,
    },
    noBlockingMessage: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    noBlockingText: {
        fontSize: 15,
        color: Colors.spec.gray500,
        textAlign: 'center',
        marginTop: 12,
    },
    closeModalButton: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 16,
        backgroundColor: Colors.spec.gray100,
        borderRadius: 12,
    },
    closeModalText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray700,
    },
    leaveModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        alignItems: 'center',
    },
    leaveModalIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.spec.amber100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    leaveModalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 8,
    },
    leaveModalWarning: {
        fontSize: 15,
        color: Colors.spec.gray600,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    leaveModalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelLeaveButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: Colors.primary[500],
        borderRadius: 12,
    },
    cancelLeaveText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    confirmLeaveButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: Colors.spec.gray100,
        borderRadius: 12,
    },
    confirmLeaveText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray700,
    },
});
