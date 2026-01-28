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
    FadeIn,
    FadeInDown,
    FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { BorderRadius, IconSize } from '../../constants/Layout';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import SLockLogo from '../../components/SLockLogo';

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

interface SelectedApp {
    id: string;
    name: string;
    icon: string;
    color: string;
    screenTime: number;
    minutesSaved: number;
}

type ScreenState = 'empty' | 'selecting' | 'session';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Breaks options
const BREAKS_OPTIONS = [0, 1, 2, 3, 5, 10];

export default function HomeScreen() {
    const [screenState, setScreenState] = useState<ScreenState>('empty');
    const [selectedApps, setSelectedApps] = useState<SelectedApp[]>([]);
    const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
    const [showAppPicker, setShowAppPicker] = useState(false);
    const [showBreaksModal, setShowBreaksModal] = useState(false);
    const [selectedBreaks, setSelectedBreaks] = useState(3);
    const [sessionDuration, setSessionDuration] = useState(0); // seconds
    const [screenTimeToday, setScreenTimeToday] = useState(0); // minutes

    const buttonScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.3);

    // Pulse animation for main button
    useEffect(() => {
        pulseOpacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 1200 }),
                withTiming(0.3, { duration: 1200 })
            ),
            -1,
            true
        );
    }, []);

    // Session timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (screenState === 'session') {
            interval = setInterval(() => {
                setSessionDuration(prev => prev + 1);
                // Update minutes saved for each app
                setSelectedApps(prev => prev.map(app => ({
                    ...app,
                    minutesSaved: Math.floor((sessionDuration + 1) / 60)
                })));
                // Update total screen time saved
                setScreenTimeToday(Math.floor((sessionDuration + 1) / 60));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [screenState, sessionDuration]);

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
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
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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

    // Step 1: Confirm app selection, show breaks modal
    const confirmAppSelection = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowAppPicker(false);
        setSelectedBreaks(3); // Reset to default 3 breaks
        setShowBreaksModal(true);
    };

    // Step 2: Confirm breaks, start session
    const confirmBreaksSelection = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const apps = AVAILABLE_APPS
            .filter(app => tempSelectedIds.includes(app.id))
            .map(app => ({ ...app, minutesSaved: 0 }));

        // Merge with existing selectedApps (for adding more apps)
        const existingIds = selectedApps.map(a => a.id);
        const newApps = apps.filter(a => !existingIds.includes(a.id));
        setSelectedApps(prev => [...prev, ...newApps]);

        setShowBreaksModal(false);
        setScreenState('session');
        if (sessionDuration === 0) {
            setSessionDuration(0);
        }
    };

    const handleEndSession = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setScreenState('empty');
        setSelectedApps([]);
        setSessionDuration(0);
    };

    const handleAddMoreApps = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTempSelectedIds([]);
        setShowAppPicker(true);
    };

    return (
        <AnimatedBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header - SLock text */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        <Text style={{ color: Colors.primary[500] }}>S</Text>
                        <Text style={{ color: Colors.text.primary }}>Lock</Text>
                    </Text>
                </View>

                {/* Empty State */}
                {screenState === 'empty' && (
                    <View style={styles.emptyState}>
                        {/* Logo */}
                        <View style={styles.logoWrapper}>
                            <Image
                                source={require('../../assets/slock_logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        {/* CTA Text */}
                        <Text style={styles.ctaTitle}>Start to SLock in</Text>

                        {/* Add An App Button */}
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
                )}

                {/* Active Session State */}
                {screenState === 'session' && (
                    <View style={styles.sessionContainer}>
                        <ScrollView
                            style={styles.sessionScrollView}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.sessionScrollContent}
                        >
                            {/* Stats Card - Screen Time */}
                            <View style={styles.statsCard}>
                                <View style={styles.statsCardRow}>
                                    {/* Screen Time Saved */}
                                    <View style={styles.statsCardItem}>
                                        <View style={styles.statsCardIconWrapper}>
                                            <Ionicons name="shield-checkmark" size={20} color={Colors.success[500]} />
                                        </View>
                                        <Text style={styles.statsCardValue}>{formatTime(screenTimeToday)}</Text>
                                        <Text style={styles.statsCardLabel}>Screen time saved</Text>
                                    </View>

                                    <View style={styles.statsCardDivider} />

                                    {/* Current Screen Time */}
                                    <View style={styles.statsCardItem}>
                                        <View style={styles.statsCardIconWrapper}>
                                            <Ionicons name="time-outline" size={20} color={Colors.primary[500]} />
                                        </View>
                                        <Text style={styles.statsCardValue}>3h 24m</Text>
                                        <Text style={styles.statsCardLabel}>Screen time today</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Your Apps Section */}
                            <View style={styles.appsSection}>
                                <View style={styles.appsSectionHeader}>
                                    <Text style={styles.appsSectionTitle}>Your apps</Text>
                                    {/* Only show Add button when all available apps are locked */}
                                    {selectedApps.length >= AVAILABLE_APPS.length && (
                                        <Pressable onPress={handleAddMoreApps} style={styles.addMoreButton}>
                                            <Ionicons name="add-circle-outline" size={20} color={Colors.primary[500]} />
                                            <Text style={styles.addMoreText}>Add</Text>
                                        </Pressable>
                                    )}
                                </View>

                                {/* App Cards */}
                                {selectedApps.map((app) => (
                                    <View key={app.id} style={styles.appCard}>
                                        <View style={[styles.appCardIcon, { backgroundColor: app.color + '15' }]}>
                                            <Ionicons name={app.icon as any} size={28} color={app.color} />
                                        </View>
                                        <View style={styles.appCardContent}>
                                            <Text style={styles.appCardName}>{app.name}</Text>
                                            <View style={styles.appCardStats}>
                                                <Text style={styles.appCardStatText}>
                                                    {app.screenTime} min today
                                                </Text>
                                                <View style={styles.appCardStatDot} />
                                                <Text style={[styles.appCardStatText, { color: Colors.success[500] }]}>
                                                    {app.minutesSaved} min saved
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.lockedBadge}>
                                            <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
                                        </View>
                                    </View>
                                ))}

                                {/* Add Apps Card - only show when there are more apps available */}
                                {selectedApps.length < AVAILABLE_APPS.length && (
                                    <Pressable
                                        onPress={handleAddMoreApps}
                                        style={styles.addAppsCard}
                                    >
                                        <View style={styles.addAppsIconWrapper}>
                                            <Ionicons name="add" size={24} color={Colors.primary[500]} />
                                        </View>
                                        <Text style={styles.addAppsText}>Add apps</Text>
                                    </Pressable>
                                )}
                            </View>
                        </ScrollView>
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

                            {/* Breaks Counter */}
                            <View style={styles.breaksCounter}>
                                {/* Decrease Button */}
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

                                {/* Counter Display */}
                                <View style={styles.breaksDisplay}>
                                    <Text style={styles.breaksValue}>{selectedBreaks}</Text>
                                    <Text style={styles.breaksLabel}>
                                        {selectedBreaks === 1 ? 'break' : 'breaks'}
                                    </Text>
                                </View>

                                {/* Increase Button */}
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
                                        setShowAppPicker(true); // Go back to app picker
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
            </SafeAreaView>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
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
    headerS: {
        color: Colors.primary[500],
    },
    headerLock: {
        color: Colors.success[500],
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
    // Session State
    sessionContainer: {
        flex: 1,
    },
    sessionScrollView: {
        flex: 1,
    },
    sessionScrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
    },
    // Stats Card - Light Theme with subtle gradient tint
    statsCard: {
        backgroundColor: 'rgba(239, 246, 255, 0.8)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(191, 219, 254, 0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    statsCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsCardItem: {
        flex: 1,
        alignItems: 'center',
    },
    statsCardIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.spec.gray50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statsCardValue: {
        ...Typography.h2,
        color: Colors.spec.gray900,
        marginBottom: Spacing.micro,
    },
    statsCardLabel: {
        ...Typography.caption,
        color: Colors.spec.gray500,
        textAlign: 'center',
    },
    statsCardDivider: {
        width: 1,
        height: 60,
        backgroundColor: Colors.spec.gray200,
        marginHorizontal: 16,
    },
    // Apps Section
    appsSection: {
        marginBottom: 24,
    },
    appsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    appsSectionTitle: {
        ...Typography.bodyEmphasis,
        color: Colors.spec.gray700,
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addMoreText: {
        ...Typography.small,
        fontFamily: FontFamily.medium,
        color: Colors.primary[500],
    },
    // App Cards
    appCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 246, 255, 0.7)',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(191, 219, 254, 0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    appCardIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appCardContent: {
        flex: 1,
        marginLeft: 14,
    },
    appCardName: {
        ...Typography.bodyEmphasis,
        color: Colors.spec.gray900,
        marginBottom: Spacing.micro,
    },
    appCardStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appCardStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    appCardStatText: {
        ...Typography.caption,
        color: Colors.spec.gray500,
    },
    appCardStatDivider: {
        width: 1,
        height: 12,
        backgroundColor: Colors.spec.gray200,
        marginHorizontal: 10,
    },
    appCardStatDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.spec.gray300,
        marginHorizontal: 8,
    },
    appCardStatus: {
        marginLeft: 8,
    },
    lockedBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Add Apps Card
    addAppsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.spec.gray200,
        borderStyle: 'dashed',
    },
    addAppsIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: Colors.primary.soft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAppsText: {
        flex: 1,
        marginLeft: Spacing.compact,
        ...Typography.bodyEmphasis,
        color: Colors.primary[500],
    },
    // End Session
    endSessionWrapper: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    endSessionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 28,
        backgroundColor: Colors.spec.red50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.spec.red100,
    },
    endSessionText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.spec.red600,
    },
    // Old styles kept for compatibility
    lockedAppsSection: {
        flex: 1,
    },
    lockedAppsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    lockedAppsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    lockedAppsList: {
        flex: 1,
    },
    lockedAppCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    appIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appInfo: {
        flex: 1,
        marginLeft: 14,
    },
    appName: {
        ...Typography.bodyEmphasis,
        color: Colors.spec.gray900,
        marginBottom: 2,
    },
    appStatus: {
        ...Typography.small,
        fontFamily: FontFamily.medium,
        color: Colors.spec.emerald600,
    },
    minutesSaved: {
        alignItems: 'center',
        backgroundColor: Colors.spec.emerald50,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    minutesSavedValue: {
        ...Typography.h2,
        color: Colors.spec.emerald600,
    },
    minutesSavedLabel: {
        ...Typography.micro,
        color: Colors.spec.emerald600,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.spec.gray300,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    modalTitle: {
        ...Typography.h1,
        color: Colors.spec.gray900,
        marginBottom: Spacing.micro,
    },
    modalSubtitle: {
        ...Typography.small,
        color: Colors.spec.gray500,
        marginBottom: Spacing.cozy,
    },
    appList: {
        maxHeight: 400,
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
        borderColor: Colors.spec.blue500,
        backgroundColor: Colors.spec.blue50,
    },
    appSelectRank: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.spec.gray200,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    appSelectRankText: {
        ...Typography.caption,
        fontFamily: FontFamily.medium,
        color: Colors.spec.gray600,
    },
    appSelectIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appSelectInfo: {
        flex: 1,
        marginLeft: 12,
    },
    appSelectName: {
        ...Typography.bodyEmphasis,
        fontSize: 15,
        color: Colors.spec.gray900,
        marginBottom: 2,
    },
    appSelectTime: {
        ...Typography.small,
        fontSize: 13,
        color: Colors.spec.gray500,
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
        borderColor: Colors.spec.blue500,
        backgroundColor: Colors.spec.blue500,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    modalCancelButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: Colors.spec.gray100,
    },
    modalCancelText: {
        ...Typography.button,
        color: Colors.spec.gray700,
    },
    modalConfirmButton: {
        flex: 2,
        borderRadius: 14,
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
        paddingVertical: 16,
    },
    modalConfirmText: {
        ...Typography.button,
        color: '#FFFFFF',
    },
    modalConfirmTextDisabled: {
        color: Colors.spec.gray500,
    },
    // Breaks Modal
    breaksModalContent: {
        backgroundColor: 'rgba(239, 246, 255, 0.98)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    // Breaks Counter Styles
    breaksCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 24,
        gap: 20,
    },
    breaksButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: Colors.spec.blue200,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.spec.blue500,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    breaksButtonDisabled: {
        backgroundColor: Colors.spec.gray50,
        borderColor: Colors.spec.gray200,
        shadowOpacity: 0,
    },
    breaksDisplay: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    breaksValue: {
        fontFamily: FontFamily.bold,
        fontSize: 42,
        lineHeight: 48,
        color: Colors.spec.blue600,
        textAlign: 'center',
    },
    breaksLabel: {
        ...Typography.small,
        fontFamily: FontFamily.medium,
        color: Colors.spec.gray500,
        marginTop: 4,
    },
});
