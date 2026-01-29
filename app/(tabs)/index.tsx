import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Modal,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    withRepeat,
    withSequence,
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

// Mock apps data - ranked by screen time
const AVAILABLE_APPS = [
    { id: '1', name: 'Instagram', icon: 'logo-instagram', screenTime: 145, color: '#E4405F' },
    { id: '2', name: 'TikTok', icon: 'musical-notes', screenTime: 98, color: '#000000' },
    { id: '3', name: 'YouTube', icon: 'logo-youtube', screenTime: 67, color: '#FF0000' },
    { id: '4', name: 'Twitter', icon: 'logo-twitter', screenTime: 45, color: '#1DA1F2' },
    { id: '5', name: 'Reddit', icon: 'logo-reddit', screenTime: 32, color: '#FF4500' },
    { id: '6', name: 'Snapchat', icon: 'happy', screenTime: 28, color: '#FFFC00' },
    { id: '7', name: 'Discord', icon: 'chatbubbles', screenTime: 22, color: '#5865F2' },
    { id: '8', name: 'Facebook', icon: 'logo-facebook', screenTime: 15, color: '#1877F2' },
];

// Rotating messages for locked state
const LOCK_MESSAGES = [
    "Stay with it.",
    "Don't break now.",
    "You chose this.",
    "Focus is power.",
    "Keep going.",
    "Almost there.",
    "Discipline wins.",
];

interface SelectedApp {
    id: string;
    name: string;
    icon: string;
    color: string;
    screenTime: number;
    minutesSaved: number;
}

type ScreenState = 'empty' | 'session';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
    const [screenState, setScreenState] = useState<ScreenState>('empty');
    const [selectedApps, setSelectedApps] = useState<SelectedApp[]>([]);
    const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
    const [showAppPicker, setShowAppPicker] = useState(false);
    const [showBreaksModal, setShowBreaksModal] = useState(false);
    const [showLockedApps, setShowLockedApps] = useState(false);
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [showAppDetail, setShowAppDetail] = useState(false);
    const [detailApp, setDetailApp] = useState<SelectedApp | null>(null);
    const [selectedBreaks, setSelectedBreaks] = useState(3);
    const [breaksRemaining, setBreaksRemaining] = useState(3);
    const [sessionDuration, setSessionDuration] = useState(0); // seconds
    const [lockMessage, setLockMessage] = useState(LOCK_MESSAGES[0]);

    const buttonScale = useSharedValue(1);
    const mascotScale = useSharedValue(1);

    // Mascot breathing animation
    useEffect(() => {
        if (screenState === 'session') {
            mascotScale.value = withRepeat(
                withSequence(
                    withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        }
    }, [screenState]);

    // Session timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (screenState === 'session') {
            interval = setInterval(() => {
                setSessionDuration(prev => prev + 1);
                setSelectedApps(prev => prev.map(app => ({
                    ...app,
                    minutesSaved: Math.floor((sessionDuration + 1) / 60)
                })));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [screenState, sessionDuration]);

    // Rotate lock messages
    useEffect(() => {
        if (screenState !== 'session') return;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * LOCK_MESSAGES.length);
            setLockMessage(LOCK_MESSAGES[randomIndex]);
        }, 6000);
        return () => clearInterval(interval);
    }, [screenState]);

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const mascotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: mascotScale.value }],
    }));

    const handlePressIn = () => {
        buttonScale.value = withTiming(0.96, { duration: 100 });
    };

    const handlePressOut = () => {
        buttonScale.value = withTiming(1, { duration: 100 });
    };

    const formatTime = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    const formatSessionTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChooseApp = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTempSelectedIds([]);
        setShowAppPicker(true);
    };

    const toggleAppSelection = (appId: string) => {
        Haptics.selectionAsync();
        setTempSelectedIds(prev =>
            prev.includes(appId)
                ? prev.filter(id => id !== appId)
                : [...prev, appId]
        );
    };

    const confirmAppSelection = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowAppPicker(false);
        setSelectedBreaks(3);
        setShowBreaksModal(true);
    };

    const confirmBreaksSelection = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const apps = AVAILABLE_APPS
            .filter(app => tempSelectedIds.includes(app.id))
            .map(app => ({ ...app, minutesSaved: 0 }));

        const existingIds = selectedApps.map(a => a.id);
        const newApps = apps.filter(a => !existingIds.includes(a.id));
        setSelectedApps(prev => [...prev, ...newApps]);
        setBreaksRemaining(selectedBreaks);

        setShowBreaksModal(false);
        setScreenState('session');
        if (sessionDuration === 0) {
            setSessionDuration(0);
        }
    };

    const handleViewLockedApps = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowLockedApps(true);
    };

    const handleEndSessionPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowEndConfirm(true);
    };

    const confirmEndSession = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setShowEndConfirm(false);
        setScreenState('empty');
        setSelectedApps([]);
        setSessionDuration(0);
    };

    return (
        <View style={styles.container}>
            {/* Different backgrounds for different states */}
            {screenState === 'empty' ? (
                <AnimatedBackground>
                    <SafeAreaView style={styles.safeArea} edges={['top']}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>
                                <Text style={{ color: Colors.primary[500] }}>S</Text>
                                <Text style={{ color: Colors.text.primary }}>Lock</Text>
                            </Text>
                        </View>

                        {/* Empty State */}
                        <View style={styles.emptyState}>
                            <View style={styles.logoWrapper}>
                                <Image
                                    source={require('../../assets/slock_logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>

                            <Text style={styles.ctaTitle}>Start to SLock in</Text>

                            <AnimatedPressable
                                onPress={handleChooseApp}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                style={[styles.ctaButton, buttonStyle]}
                            >
                                <LinearGradient
                                    colors={[Colors.primary[500], Colors.primary[600]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.ctaButtonGradient}
                                >
                                    <Ionicons name="add" size={18} color="#FFFFFF" />
                                    <Text style={styles.ctaButtonText}>Add An App</Text>
                                </LinearGradient>
                            </AnimatedPressable>
                        </View>
                    </SafeAreaView>
                </AnimatedBackground>
            ) : (
                /* LOCKED SESSION STATE - Serious, Quiet, Intentional */
                <View style={styles.lockedContainer}>
                    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                        {/* Top - Timer */}
                        <View style={styles.timerSection}>
                            <Text style={styles.timerDisplay}>{formatSessionTime(sessionDuration)}</Text>
                            <Text style={styles.sessionLabel}>Focus session active</Text>
                        </View>

                        {/* Middle - Emotional Feedback */}
                        <View style={styles.mascotSection}>
                            <Animated.View style={[styles.mascotContainer, mascotStyle]}>
                                <View style={styles.mascotFace}>
                                    {/* Judgy eyes */}
                                    <View style={styles.eyesRow}>
                                        <View style={styles.eye}>
                                            <View style={styles.eyebrow} />
                                            <View style={styles.pupil} />
                                        </View>
                                        <View style={styles.eye}>
                                            <View style={styles.eyebrow} />
                                            <View style={styles.pupil} />
                                        </View>
                                    </View>
                                    {/* Neutral/serious mouth */}
                                    <View style={styles.mouth} />
                                </View>
                            </Animated.View>
                            <Text style={styles.lockMessage}>{lockMessage}</Text>
                        </View>

                        {/* Breaks remaining */}
                        <View style={styles.breaksInfo}>
                            <Ionicons name="pause-circle-outline" size={18} color={Colors.spec.gray500} />
                            <Text style={styles.breaksText}>{breaksRemaining} breaks remaining</Text>
                        </View>

                        {/* Bottom - Controls */}
                        <View style={styles.controlsSection}>
                            <Pressable
                                style={styles.viewAppsButton}
                                onPress={handleViewLockedApps}
                            >
                                <Ionicons name="lock-closed-outline" size={20} color={Colors.spec.gray700} />
                                <Text style={styles.viewAppsText}>View Locked Apps</Text>
                            </Pressable>

                            <Pressable
                                style={styles.endButton}
                                onPress={handleEndSessionPress}
                            >
                                <Text style={styles.endButtonText}>End Session Early</Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </View>
            )}

            {/* App Picker Modal */}
            <Modal
                visible={showAppPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAppPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />

                        <Text style={styles.modalTitle}>Choose Apps to Lock</Text>
                        <Text style={styles.modalSubtitle}>
                            Ranked by your screen{'\u00A0'}time
                        </Text>

                        <ScrollView
                            style={styles.appList}
                            showsVerticalScrollIndicator={false}
                        >
                            {AVAILABLE_APPS
                                .filter(app => !selectedApps.some(selected => selected.id === app.id))
                                .map((app, index) => {
                                    const isSelected = tempSelectedIds.includes(app.id);
                                    return (
                                        <Pressable
                                            key={app.id}
                                            onPress={() => toggleAppSelection(app.id)}
                                            style={[styles.appSelectCard, isSelected && styles.appSelectCardActive]}
                                        >
                                            <View style={styles.appSelectRank}>
                                                <Text style={styles.appSelectRankText}>{index + 1}</Text>
                                            </View>
                                            <View style={[styles.appSelectIcon, { backgroundColor: app.color + '20' }]}>
                                                <Ionicons name={app.icon as any} size={24} color={app.color} />
                                            </View>
                                            <View style={styles.appSelectInfo}>
                                                <Text style={styles.appSelectName}>{app.name}</Text>
                                                <Text style={styles.appSelectTime}>{formatTime(app.screenTime)} today</Text>
                                            </View>
                                            <View style={[
                                                styles.appSelectCheck,
                                                isSelected && styles.appSelectCheckActive
                                            ]}>
                                                {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                                            </View>
                                        </Pressable>
                                    );
                                })}
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <Pressable
                                onPress={() => setShowAppPicker(false)}
                                style={styles.modalCancelButton}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={confirmAppSelection}
                                disabled={tempSelectedIds.length === 0}
                                style={[
                                    styles.modalConfirmButton,
                                    tempSelectedIds.length === 0 && styles.modalConfirmButtonDisabled
                                ]}
                            >
                                <LinearGradient
                                    colors={tempSelectedIds.length > 0 ? [Colors.primary[500], Colors.primary[600]] : [Colors.neutral[300], Colors.neutral[300]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.modalConfirmGradient}
                                >
                                    <Ionicons
                                        name="lock-closed"
                                        size={18}
                                        color={tempSelectedIds.length > 0 ? '#FFFFFF' : Colors.neutral[500]}
                                    />
                                    <Text style={[
                                        styles.modalConfirmText,
                                        tempSelectedIds.length === 0 && styles.modalConfirmTextDisabled
                                    ]}>
                                        Start Locking ({tempSelectedIds.length})
                                    </Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Breaks Selection Modal */}
            <Modal
                visible={showBreaksModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowBreaksModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.breaksModalContent}>
                        <View style={styles.modalHandle} />

                        <Text style={styles.modalTitle}>How many breaks?</Text>
                        <Text style={styles.modalSubtitle}>
                            Allow yourself short breaks during the session
                        </Text>

                        <View style={styles.breaksCounter}>
                            <Pressable
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSelectedBreaks(prev => Math.max(0, prev - 1));
                                }}
                                style={[
                                    styles.breaksButton,
                                    selectedBreaks === 0 && styles.breaksButtonDisabled
                                ]}
                                disabled={selectedBreaks === 0}
                            >
                                <Ionicons
                                    name="remove"
                                    size={28}
                                    color={selectedBreaks === 0 ? Colors.neutral[300] : Colors.primary[500]}
                                />
                            </Pressable>

                            <View style={styles.breaksDisplay}>
                                <Text style={styles.breaksValue}>{selectedBreaks}</Text>
                                <Text style={styles.breaksLabel}>
                                    {selectedBreaks === 1 ? 'break' : 'breaks'}
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSelectedBreaks(prev => Math.min(10, prev + 1));
                                }}
                                style={[
                                    styles.breaksButton,
                                    selectedBreaks === 10 && styles.breaksButtonDisabled
                                ]}
                                disabled={selectedBreaks === 10}
                            >
                                <Ionicons
                                    name="add"
                                    size={28}
                                    color={selectedBreaks === 10 ? Colors.neutral[300] : Colors.primary[500]}
                                />
                            </Pressable>
                        </View>

                        <View style={styles.modalActions}>
                            <Pressable
                                onPress={() => {
                                    setShowBreaksModal(false);
                                    setShowAppPicker(true);
                                }}
                                style={styles.modalCancelButton}
                            >
                                <Text style={styles.modalCancelText}>Back</Text>
                            </Pressable>
                            <Pressable
                                onPress={confirmBreaksSelection}
                                style={styles.modalConfirmButton}
                            >
                                <LinearGradient
                                    colors={[Colors.primary[500], Colors.primary[600]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.modalConfirmGradient}
                                >
                                    <Ionicons name="play" size={18} color="#FFFFFF" />
                                    <Text style={styles.modalConfirmText}>Start Session</Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* View Locked Apps Modal */}
            <Modal
                visible={showLockedApps}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLockedApps(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowLockedApps(false)}>
                    <View style={styles.lockedAppsModal}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Locked Apps</Text>
                        <Text style={styles.modalSubtitle}>
                            {selectedApps.length} apps locked • {formatSessionTime(sessionDuration)} elapsed
                        </Text>

                        <ScrollView style={styles.lockedAppsList} showsVerticalScrollIndicator={false}>
                            {selectedApps.map((app) => (
                                <Pressable
                                    key={app.id}
                                    style={styles.lockedAppRow}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setDetailApp(app);
                                        setShowLockedApps(false);
                                        setShowAppDetail(true);
                                    }}
                                >
                                    <View style={[styles.lockedAppIcon, { backgroundColor: app.color + '15' }]}>
                                        <Ionicons name={app.icon as any} size={24} color={app.color} />
                                    </View>
                                    <View style={styles.lockedAppInfo}>
                                        <Text style={styles.lockedAppName}>{app.name}</Text>
                                        <Text style={styles.lockedAppSaved}>
                                            {app.minutesSaved > 0 ? `${app.minutesSaved}m saved` : 'Locked'}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={Colors.spec.gray400} />
                                </Pressable>
                            ))}
                        </ScrollView>

                        <View style={styles.lockedAppsNote}>
                            <Ionicons name="information-circle-outline" size={16} color={Colors.spec.gray500} />
                            <Text style={styles.lockedAppsNoteText}>
                                Apps cannot be removed during an active session
                            </Text>
                        </View>

                        <Pressable style={styles.closeModalButton} onPress={() => setShowLockedApps(false)}>
                            <Text style={styles.closeModalText}>Close</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            {/* End Session Confirmation Modal */}
            <Modal
                visible={showEndConfirm}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowEndConfirm(false)}
            >
                <View style={styles.endConfirmOverlay}>
                    <View style={styles.endConfirmModal}>
                        <View style={styles.endConfirmIcon}>
                            <Ionicons name="warning" size={32} color={Colors.primary[500]} />
                        </View>
                        <Text style={styles.endConfirmTitle}>End Session Early?</Text>

                        <View style={styles.consequencesList}>
                            <View style={styles.consequenceRow}>
                                <Ionicons name="close-circle" size={18} color={Colors.primary[500]} />
                                <Text style={styles.consequenceText}>This will be visible to your study circle</Text>
                            </View>
                            <View style={styles.consequenceRow}>
                                <Ionicons name="close-circle" size={18} color={Colors.primary[500]} />
                                <Text style={styles.consequenceText}>You'll lose today's streak</Text>
                            </View>
                            <View style={styles.consequenceRow}>
                                <Ionicons name="close-circle" size={18} color={Colors.primary[500]} />
                                <Text style={styles.consequenceText}>Locked apps will be unlocked</Text>
                            </View>
                        </View>

                        <View style={styles.endConfirmActions}>
                            <Pressable
                                style={styles.stayFocusedButton}
                                onPress={() => setShowEndConfirm(false)}
                            >
                                <LinearGradient
                                    colors={[Colors.spec.emerald500, Colors.spec.emerald600]}
                                    style={styles.stayFocusedGradient}
                                >
                                    <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
                                    <Text style={styles.stayFocusedText}>Stay Focused</Text>
                                </LinearGradient>
                            </Pressable>
                            <Pressable
                                style={styles.confirmEndButton}
                                onPress={confirmEndSession}
                            >
                                <Text style={styles.confirmEndText}>End Anyway</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* App Detail Modal */}
            <Modal
                visible={showAppDetail}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAppDetail(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowAppDetail(false)}>
                    <View style={styles.appDetailModal} onStartShouldSetResponder={() => true}>
                        <View style={styles.modalHandle} />

                        {detailApp && (
                            <>
                                {/* App Header */}
                                <View style={styles.appDetailHeader}>
                                    <View style={[styles.appDetailIcon, { backgroundColor: detailApp.color + '15' }]}>
                                        <Ionicons name={detailApp.icon as any} size={36} color={detailApp.color} />
                                    </View>
                                    <Text style={styles.appDetailName}>{detailApp.name}</Text>
                                    <View style={styles.lockedBadge}>
                                        <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
                                        <Text style={styles.lockedBadgeText}>Locked</Text>
                                    </View>
                                </View>

                                {/* Why Locked */}
                                <View style={styles.appDetailSection}>
                                    <Text style={styles.appDetailSectionTitle}>Why it's locked</Text>
                                    <Text style={styles.appDetailSectionText}>
                                        You chose to lock {detailApp.name} to reduce screen time and stay focused.
                                    </Text>
                                </View>

                                {/* Stats Row */}
                                <View style={styles.appDetailStats}>
                                    <View style={styles.appDetailStat}>
                                        <Text style={styles.appDetailStatValue}>{formatSessionTime(sessionDuration)}</Text>
                                        <Text style={styles.appDetailStatLabel}>Elapsed</Text>
                                    </View>
                                    <View style={styles.appDetailStatDivider} />
                                    <View style={styles.appDetailStat}>
                                        <Text style={styles.appDetailStatValue}>{breaksRemaining}</Text>
                                        <Text style={styles.appDetailStatLabel}>Breaks left</Text>
                                    </View>
                                    <View style={styles.appDetailStatDivider} />
                                    <View style={styles.appDetailStat}>
                                        <Text style={styles.appDetailStatValue}>{detailApp.minutesSaved}m</Text>
                                        <Text style={styles.appDetailStatLabel}>Saved</Text>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={styles.appDetailActions}>
                                    {breaksRemaining > 0 ? (
                                        <Pressable
                                            style={styles.useBreakButton}
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                                setBreaksRemaining(prev => prev - 1);
                                                setShowAppDetail(false);
                                                // In real app, would unlock for break duration
                                            }}
                                        >
                                            <Ionicons name="pause-circle" size={20} color={Colors.spec.amber600} />
                                            <Text style={styles.useBreakText}>Use a Break</Text>
                                        </Pressable>
                                    ) : (
                                        <View style={styles.noBreaksMessage}>
                                            <Ionicons name="alert-circle" size={18} color={Colors.spec.gray500} />
                                            <Text style={styles.noBreaksText}>No breaks remaining</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Disabled Actions Note */}
                                <View style={styles.disabledNote}>
                                    <Ionicons name="information-circle-outline" size={16} color={Colors.spec.gray400} />
                                    <Text style={styles.disabledNoteText}>
                                        Removing apps or changing duration is disabled during lock
                                    </Text>
                                </View>

                                <Pressable style={styles.closeModalButton} onPress={() => setShowAppDetail(false)}>
                                    <Text style={styles.closeModalText}>Close</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    // Header
    header: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        marginTop: -60,
    },
    logoWrapper: {
        marginBottom: 20,
    },
    logo: {
        width: 180,
        height: 180,
    },
    ctaTitle: {
        ...Typography.h2,
        color: Colors.spec.gray700,
        marginBottom: Spacing.section,
        textAlign: 'center',
    },
    ctaButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    ctaButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    ctaButtonText: {
        ...Typography.button,
        color: '#FFFFFF',
    },
    // LOCKED SESSION STATE
    lockedContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    // Timer Section
    timerSection: {
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 24,
    },
    timerDisplay: {
        fontSize: 72,
        fontWeight: '200',
        color: Colors.spec.gray900,
        letterSpacing: 4,
        fontVariant: ['tabular-nums'],
    },
    sessionLabel: {
        fontSize: 15,
        color: Colors.spec.gray500,
        marginTop: 8,
    },
    // Mascot Section
    mascotSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 48,
    },
    mascotContainer: {
        marginBottom: 24,
    },
    mascotFace: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.spec.gray200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eyesRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 8,
    },
    eye: {
        width: 20,
        height: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 4,
    },
    eyebrow: {
        position: 'absolute',
        top: -8,
        width: 24,
        height: 4,
        backgroundColor: Colors.spec.gray500,
        borderRadius: 2,
        transform: [{ rotate: '-10deg' }],
    },
    pupil: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.spec.gray700,
    },
    mouth: {
        width: 24,
        height: 3,
        backgroundColor: Colors.spec.gray500,
        borderRadius: 2,
        marginTop: 8,
    },
    lockMessage: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.spec.gray600,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    // Breaks Info
    breaksInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    breaksText: {
        fontSize: 14,
        color: Colors.spec.gray500,
    },
    // Controls Section
    controlsSection: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    viewAppsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    viewAppsText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray700,
    },
    endButton: {
        alignItems: 'center',
        paddingVertical: 14,
    },
    endButtonText: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.primary[500],
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
        maxHeight: '85%',
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
        fontSize: 22,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.spec.gray500,
        marginBottom: 20,
    },
    appList: {
        maxHeight: 300,
    },
    appSelectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    appSelectCardActive: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[50],
    },
    appSelectRank: {
        width: 24,
        alignItems: 'center',
        marginRight: 10,
    },
    appSelectRankText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray400,
    },
    appSelectIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appSelectInfo: {
        flex: 1,
        marginLeft: 14,
    },
    appSelectName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    appSelectTime: {
        fontSize: 13,
        color: Colors.spec.gray500,
        marginTop: 2,
    },
    appSelectCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.spec.gray300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appSelectCheckActive: {
        backgroundColor: Colors.primary[500],
        borderColor: Colors.primary[500],
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    modalCancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        backgroundColor: Colors.spec.gray100,
        borderRadius: 12,
    },
    modalCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray700,
    },
    modalConfirmButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalConfirmButtonDisabled: {
        opacity: 0.7,
    },
    modalConfirmGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
    },
    modalConfirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    modalConfirmTextDisabled: {
        color: Colors.neutral[500],
    },
    // Breaks Modal
    breaksModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    breaksCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        paddingVertical: 32,
    },
    breaksButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.spec.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    breaksButtonDisabled: {
        opacity: 0.5,
    },
    breaksDisplay: {
        alignItems: 'center',
    },
    breaksValue: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.primary[500],
    },
    breaksLabel: {
        fontSize: 14,
        color: Colors.spec.gray500,
        marginTop: 4,
    },
    // Locked Apps Modal
    lockedAppsModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '70%',
    },
    lockedAppsList: {
        marginTop: 16,
    },
    lockedAppRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.spec.gray100,
    },
    lockedAppIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedAppInfo: {
        flex: 1,
        marginLeft: 14,
    },
    lockedAppName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    lockedAppSaved: {
        fontSize: 13,
        color: Colors.spec.gray500,
        marginTop: 2,
    },
    lockedAppsNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.spec.gray50,
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
    },
    lockedAppsNoteText: {
        flex: 1,
        fontSize: 13,
        color: Colors.spec.gray500,
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
    // End Session Confirmation
    endConfirmOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    endConfirmModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        width: '100%',
        alignItems: 'center',
    },
    endConfirmIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    endConfirmTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 20,
    },
    consequencesList: {
        width: '100%',
        gap: 12,
        marginBottom: 24,
    },
    consequenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    consequenceText: {
        flex: 1,
        fontSize: 14,
        color: Colors.spec.gray600,
    },
    endConfirmActions: {
        width: '100%',
        gap: 12,
    },
    stayFocusedButton: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    stayFocusedGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    stayFocusedText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    confirmEndButton: {
        alignItems: 'center',
        paddingVertical: 14,
    },
    confirmEndText: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.primary[500],
    },
    // App Detail Modal
    appDetailModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    appDetailHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    appDetailIcon: {
        width: 72,
        height: 72,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    appDetailName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 8,
    },
    lockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.primary[500],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    lockedBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    appDetailSection: {
        backgroundColor: Colors.spec.gray50,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    appDetailSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray700,
        marginBottom: 6,
    },
    appDetailSectionText: {
        fontSize: 14,
        color: Colors.spec.gray600,
        lineHeight: 20,
    },
    appDetailStats: {
        flexDirection: 'row',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    appDetailStat: {
        flex: 1,
        alignItems: 'center',
    },
    appDetailStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.spec.gray900,
    },
    appDetailStatLabel: {
        fontSize: 12,
        color: Colors.spec.gray500,
        marginTop: 4,
    },
    appDetailStatDivider: {
        width: 1,
        backgroundColor: Colors.spec.gray200,
        marginHorizontal: 8,
    },
    appDetailActions: {
        marginBottom: 16,
    },
    useBreakButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.spec.amber100,
        borderRadius: 14,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: Colors.spec.amber400,
    },
    useBreakText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.amber600,
    },
    noBreaksMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.spec.gray100,
        borderRadius: 14,
        paddingVertical: 16,
    },
    noBreaksText: {
        fontSize: 15,
        color: Colors.spec.gray500,
    },
    disabledNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    disabledNoteText: {
        flex: 1,
        fontSize: 13,
        color: Colors.spec.gray400,
    },
});
