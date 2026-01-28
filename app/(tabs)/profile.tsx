import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock weekly data
const WEEKLY_DATA = [
    { day: 'Fri', value: 10, hours: 0.2 },
    { day: 'Sat', value: 15, hours: 0.3 },
    { day: 'Sun', value: 20, hours: 0.4 },
    { day: 'Mon', value: 25, hours: 0.5 },
    { day: 'Tue', value: 40, hours: 0.8 },
    { day: 'Wed', value: 100, hours: 2.25 },
    { day: 'Thu', value: 35, hours: 0.7 },
];

const SETTINGS_OPTIONS = [
    { id: 'notifications', icon: 'notifications-outline', title: 'Notifications', hasToggle: true },
    { id: 'privacy', icon: 'lock-closed-outline', title: 'Privacy', hasArrow: true },
    { id: 'appearance', icon: 'color-palette-outline', title: 'Appearance', hasArrow: true },
    { id: 'help', icon: 'help-circle-outline', title: 'Help & Support', hasArrow: true },
    { id: 'about', icon: 'information-circle-outline', title: 'About', hasArrow: true },
];

export default function ProfileScreen() {
    const [streak, setStreak] = useState(6);
    const [screenTimeSaved, setScreenTimeSaved] = useState(2.25);
    const [selectedPeriod, setSelectedPeriod] = useState('Week');

    const maxValue = Math.max(...WEEKLY_DATA.map(d => d.value));

    const handleEditProfile = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to edit profile
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
                        <Text style={styles.title}>Profile</Text>
                        <Pressable style={styles.settingsButton}>
                            <Ionicons name="settings-outline" size={24} color={Colors.spec.gray600} />
                        </Pressable>
                    </View>

                    {/* Profile Card */}
                    <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                        <View style={styles.profileCard}>
                            <View style={styles.avatarSection}>
                                <View style={styles.avatarLarge}>
                                    <Text style={styles.avatarLargeText}>EW</Text>
                                </View>
                                <Pressable onPress={handleEditProfile} style={styles.editButton}>
                                    <Ionicons name="pencil" size={14} color={Colors.spec.blue600} />
                                </Pressable>
                            </View>
                            <Text style={styles.userName}>Eddie Wang</Text>
                            <Text style={styles.userHandle}>@eddiewang</Text>
                        </View>
                    </Animated.View>

                    {/* Stats Row */}
                    <Animated.View
                        entering={FadeInDown.duration(600).delay(200)}
                        style={styles.statsRow}
                    >
                        <View style={styles.statCard}>
                            <View style={styles.statIconContainer}>
                                <Ionicons name="flame" size={24} color="#F97316" />
                            </View>
                            <Text style={styles.statValue}>{streak}</Text>
                            <Text style={styles.statLabel}>Current Streak</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statCard}>
                            <View style={styles.statIconContainer}>
                                <Ionicons name="time" size={24} color={Colors.spec.emerald600} />
                            </View>
                            <Text style={styles.statValue}>{screenTimeSaved}h</Text>
                            <Text style={styles.statLabel}>Saved Today</Text>
                        </View>
                    </Animated.View>

                    {/* Weekly Progress Chart */}
                    <Animated.View
                        entering={FadeInDown.duration(600).delay(300)}
                        style={styles.chartSection}
                    >
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Total Screen Time By Day</Text>
                            <Pressable>
                                <Text style={styles.learnMore}>Learn More</Text>
                                <Ionicons name="chevron-forward" size={14} color={Colors.spec.blue600} />
                            </Pressable>
                        </View>

                        {/* Period Selector */}
                        <View style={styles.periodSelector}>
                            {['Week', 'Month', 'Year'].map((period) => (
                                <Pressable
                                    key={period}
                                    onPress={() => setSelectedPeriod(period)}
                                    style={[
                                        styles.periodButton,
                                        selectedPeriod === period && styles.periodButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.periodText,
                                        selectedPeriod === period && styles.periodTextActive
                                    ]}>
                                        {period}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Chart */}
                        <View style={styles.chartContainer}>
                            {/* Y-axis labels */}
                            <View style={styles.yAxis}>
                                <Text style={styles.yAxisLabel}>2hr 15</Text>
                                <Text style={styles.yAxisLabel}>1hr 21</Text>
                                <Text style={styles.yAxisLabel}>0m</Text>
                            </View>

                            {/* Chart area */}
                            <View style={styles.chartArea}>
                                {/* Line chart simulation */}
                                <View style={styles.chartLine}>
                                    {WEEKLY_DATA.map((data, index) => (
                                        <View key={data.day} style={styles.chartPoint}>
                                            <View
                                                style={[
                                                    styles.dot,
                                                    data.value === maxValue && styles.dotActive
                                                ]}
                                            />
                                            {index < WEEKLY_DATA.length - 1 && (
                                                <View style={styles.connector} />
                                            )}
                                        </View>
                                    ))}
                                </View>

                                {/* X-axis labels */}
                                <View style={styles.xAxis}>
                                    {WEEKLY_DATA.map((data) => (
                                        <Text key={data.day} style={styles.xAxisLabel}>{data.day}</Text>
                                    ))}
                                </View>
                            </View>

                            {/* Status labels */}
                            <View style={styles.statusLabels}>
                                <Text style={[styles.statusLabel, styles.statusNormal]}>Normal</Text>
                                <View>
                                    <Text style={[styles.statusLabel, styles.statusHigh]}>High</Text>
                                    <Text style={[styles.statusLabel, styles.statusLow]}>Low</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Overview Section */}
                    <Animated.View
                        entering={FadeInDown.duration(600).delay(400)}
                        style={styles.overviewSection}
                    >
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <View style={styles.overviewGrid}>
                            <View style={styles.overviewCard}>
                                <Ionicons name="checkmark-circle" size={28} color={Colors.spec.emerald500} />
                                <Text style={styles.overviewValue}>89%</Text>
                                <Text style={styles.overviewLabel}>Success Rate</Text>
                            </View>
                            <View style={styles.overviewCard}>
                                <Ionicons name="trophy" size={28} color="#FFD700" />
                                <Text style={styles.overviewValue}>12</Text>
                                <Text style={styles.overviewLabel}>Achievements</Text>
                            </View>
                            <View style={styles.overviewCard}>
                                <Ionicons name="people" size={28} color={Colors.spec.blue600} />
                                <Text style={styles.overviewValue}>8</Text>
                                <Text style={styles.overviewLabel}>Friends</Text>
                            </View>
                            <View style={styles.overviewCard}>
                                <Ionicons name="lock-closed" size={28} color={Colors.spec.gray700} />
                                <Text style={styles.overviewValue}>5</Text>
                                <Text style={styles.overviewLabel}>Apps Locked</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Settings Section */}
                    <Animated.View
                        entering={FadeInDown.duration(600).delay(500)}
                        style={styles.settingsSection}
                    >
                        <Text style={styles.sectionTitle}>Settings</Text>
                        <View style={styles.settingsList}>
                            {SETTINGS_OPTIONS.map((option, index) => (
                                <Pressable
                                    key={option.id}
                                    style={[
                                        styles.settingsItem,
                                        index === SETTINGS_OPTIONS.length - 1 && styles.settingsItemLast
                                    ]}
                                >
                                    <View style={styles.settingsItemLeft}>
                                        <Ionicons name={option.icon as any} size={22} color={Colors.spec.gray600} />
                                        <Text style={styles.settingsItemText}>{option.title}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={Colors.spec.gray400} />
                                </Pressable>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Sign Out */}
                    <Animated.View
                        entering={FadeInDown.duration(600).delay(600)}
                        style={styles.signOutSection}
                    >
                        <Pressable style={styles.signOutButton}>
                            <Ionicons name="log-out-outline" size={20} color={Colors.spec.red500} />
                            <Text style={styles.signOutText}>Sign Out</Text>
                        </Pressable>
                    </Animated.View>
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
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.spec.gray900,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    // Profile Card
    profileCard: {
        alignItems: 'center',
        paddingVertical: 24,
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
        marginBottom: 20,
    },
    avatarSection: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarLarge: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: Colors.spec.gray200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.spec.blue500,
    },
    avatarLargeText: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.spec.gray700,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.spec.blue500,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 4,
    },
    userHandle: {
        fontSize: 14,
        color: Colors.spec.gray500,
    },
    // Stats Row
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statIconContainer: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.spec.gray500,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.spec.gray200,
        marginHorizontal: 16,
    },
    // Chart Section
    chartSection: {
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    learnMore: {
        fontSize: 13,
        color: Colors.spec.blue600,
        fontWeight: '500',
    },
    periodSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    periodButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.spec.gray100,
    },
    periodButtonActive: {
        backgroundColor: Colors.spec.blue600,
    },
    periodText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.spec.gray600,
    },
    periodTextActive: {
        color: '#FFFFFF',
    },
    chartContainer: {
        flexDirection: 'row',
    },
    yAxis: {
        justifyContent: 'space-between',
        marginRight: 12,
        paddingVertical: 8,
    },
    yAxisLabel: {
        fontSize: 11,
        color: Colors.spec.gray500,
    },
    chartArea: {
        flex: 1,
    },
    chartLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 100,
        paddingBottom: 20,
    },
    chartPoint: {
        alignItems: 'center',
        flex: 1,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.spec.blue500,
    },
    dotActive: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    connector: {
        position: 'absolute',
        right: -20,
        top: 5,
        width: 40,
        height: 2,
        backgroundColor: Colors.spec.blue300,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    xAxisLabel: {
        fontSize: 11,
        color: Colors.spec.gray500,
        flex: 1,
        textAlign: 'center',
    },
    statusLabels: {
        marginLeft: 16,
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '500',
    },
    statusNormal: {
        color: Colors.spec.blue600,
    },
    statusHigh: {
        color: Colors.spec.gray500,
    },
    statusLow: {
        color: Colors.spec.gray400,
    },
    // Overview
    overviewSection: {
        marginHorizontal: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.spec.gray900,
        marginBottom: 12,
    },
    overviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    overviewCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    overviewValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginTop: 8,
        marginBottom: 4,
    },
    overviewLabel: {
        fontSize: 12,
        color: Colors.spec.gray500,
    },
    // Settings
    settingsSection: {
        marginHorizontal: 24,
        marginBottom: 20,
    },
    settingsList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
        overflow: 'hidden',
    },
    settingsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.spec.gray100,
    },
    settingsItemLast: {
        borderBottomWidth: 0,
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingsItemText: {
        fontSize: 15,
        color: Colors.spec.gray900,
    },
    // Sign Out
    signOutSection: {
        marginHorizontal: 24,
        marginBottom: 20,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: Colors.spec.red500,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.red500,
    },
});
