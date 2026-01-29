import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';


// Mock data for Focus Trend
const TREND_DATA = {
    Week: [
        { label: 'Mon', value: 45 },
        { label: 'Tue', value: 60 },
        { label: 'Wed', value: 55 },
        { label: 'Thu', value: 80 },
        { label: 'Fri', value: 70 },
        { label: 'Sat', value: 90 },
        { label: 'Sun', value: 85 },
    ],
    Month: [
        { label: 'W1', value: 55 },
        { label: 'W2', value: 65 },
        { label: 'W3', value: 75 },
        { label: 'W4', value: 85 },
    ],
    Year: [
        { label: 'Jan', value: 40 },
        { label: 'Feb', value: 50 },
        { label: 'Mar', value: 55 },
        { label: 'Apr', value: 60 },
        { label: 'May', value: 70 },
        { label: 'Jun', value: 75 },
        { label: 'Jul', value: 80 },
        { label: 'Aug', value: 78 },
        { label: 'Sep', value: 82 },
        { label: 'Oct', value: 85 },
        { label: 'Nov', value: 88 },
        { label: 'Dec', value: 92 },
    ],
};

// Mock focus style insights
const FOCUS_INSIGHTS = [
    { id: 'session', icon: 'time-outline', label: 'Average lock in time', value: '50 min' },
    { id: 'mode', icon: 'shield-checkmark-outline', label: 'Typical lock level', value: 'Hardcore' },
    { id: 'app', icon: 'logo-instagram', label: 'Most locked app', value: 'Instagram', appColor: '#E4405F' },
    { id: 'peak', icon: 'moon-outline', label: 'Peak focus time', value: 'Evenings' },
];

// Mock milestones / badges
const MILESTONES = [
    { id: '1', title: '100 hours saved', icon: 'hourglass-outline', earned: true },
    { id: '2', title: 'Consistency badge', icon: 'ribbon-outline', earned: true },
    { id: '3', title: '7-day streak', icon: 'flame-outline', earned: true },
    { id: '4', title: 'Never quit (7 days)', icon: 'trophy-outline', earned: false },
    { id: '5', title: '500 hours saved', icon: 'star-outline', earned: false },
];

export default function ProfileScreen() {
    const router = useRouter();
    const [selectedPeriod, setSelectedPeriod] = useState<'Week' | 'Month' | 'Year'>('Week');

    // Static profile data (will connect to real data later)
    const streak = 6;
    const totalHoursSaved = 127;

    const handleSettingsPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/settings');
    };

    const currentTrendData = TREND_DATA[selectedPeriod];
    const maxTrendValue = Math.max(...currentTrendData.map(d => d.value));

    return (
        <AnimatedBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ===== 1. Header / Identity Block ===== */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Profile</Text>
                        <Pressable style={styles.settingsButton} onPress={handleSettingsPress}>
                            <Ionicons name="settings-outline" size={24} color={Colors.spec.gray600} />
                        </Pressable>
                    </View>

                    <View>
                        <View style={styles.identityBlock}>
                            {/* Avatar with red ring */}
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatarRing}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>EW</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Name & Username */}
                            <Text style={styles.userName}>Eddie Wang</Text>
                            <Text style={styles.userHandle}>@eddiewang</Text>
                        </View>
                    </View>

                    {/* ===== 2. Core Identity Metrics ===== */}
                    <View
                        style={styles.metricsCard}
                    >
                        <View style={styles.metricColumn}>
                            <View style={styles.metricIconContainer}>
                                <Ionicons name="flame" size={28} color="#F97316" />
                            </View>
                            <Text style={styles.metricValue}>{streak}</Text>
                            <Text style={styles.metricLabel}>Current streak</Text>
                        </View>

                        <View style={styles.metricDivider} />

                        <View style={styles.metricColumn}>
                            <View style={styles.metricIconContainer}>
                                <Ionicons name="time" size={28} color={Colors.primary[500]} />
                            </View>
                            <Text style={styles.metricValue}>{totalHoursSaved}h</Text>
                            <Text style={styles.metricLabel}>Total time saved</Text>
                        </View>
                    </View>

                    {/* ===== 3. Focus Trend ===== */}
                    <View
                        style={styles.trendCard}
                    >
                        <View style={styles.trendHeader}>
                            <Text style={styles.cardTitle}>Focus Trend</Text>
                            <Pressable style={styles.viewDetailsButton}>
                                <Text style={styles.viewDetailsText}>View details</Text>
                                <Ionicons name="chevron-forward" size={14} color={Colors.primary[500]} />
                            </Pressable>
                        </View>

                        {/* Period Selector */}
                        <View style={styles.periodSelector}>
                            {(['Week', 'Month', 'Year'] as const).map((period) => (
                                <Pressable
                                    key={period}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setSelectedPeriod(period);
                                    }}
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

                        {/* Simple Bar Chart */}
                        <View style={styles.chartContainer}>
                            {currentTrendData.map((item, index) => (
                                <View key={item.label} style={styles.chartBarContainer}>
                                    <View style={styles.chartBarWrapper}>
                                        <View
                                            style={[
                                                styles.chartBar,
                                                {
                                                    height: `${(item.value / maxTrendValue) * 100}%`,
                                                    backgroundColor: item.value === maxTrendValue
                                                        ? Colors.primary[500]
                                                        : Colors.primary[200],
                                                }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.chartLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ===== 4. Focus Style (Personal Insights) ===== */}
                    <View
                        style={styles.insightsCard}
                    >
                        <Text style={styles.cardTitle}>Your Focus Style</Text>

                        {FOCUS_INSIGHTS.map((insight, index) => (
                            <View
                                key={insight.id}
                                style={[
                                    styles.insightRow,
                                    index === FOCUS_INSIGHTS.length - 1 && styles.insightRowLast
                                ]}
                            >
                                <View style={styles.insightIconContainer}>
                                    <Ionicons
                                        name={insight.icon as any}
                                        size={20}
                                        color={insight.appColor || Colors.spec.gray600}
                                    />
                                </View>
                                <Text style={styles.insightLabel}>{insight.label}</Text>
                                <Text style={styles.insightValue}>{insight.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ===== 5. Identity Badges / Milestones ===== */}
                    <View
                        style={styles.milestonesSection}
                    >
                        <Text style={styles.sectionTitle}>Milestones</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.milestonesScroll}
                        >
                            {MILESTONES.map((milestone, index) => (
                                <View
                                    key={milestone.id}
                                >
                                    <View style={[
                                        styles.milestoneCard,
                                        !milestone.earned && styles.milestoneCardLocked
                                    ]}>
                                        <View style={[
                                            styles.milestoneIconContainer,
                                            milestone.earned && styles.milestoneIconEarned
                                        ]}>
                                            <Ionicons
                                                name={milestone.icon as any}
                                                size={24}
                                                color={milestone.earned ? Colors.secondary[500] : Colors.spec.gray400}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.milestoneTitle,
                                            !milestone.earned && styles.milestoneTitleLocked
                                        ]}>
                                            {milestone.title}
                                        </Text>
                                        {!milestone.earned && (
                                            <Ionicons
                                                name="lock-closed"
                                                size={12}
                                                color={Colors.spec.gray400}
                                                style={styles.milestoneLockIcon}
                                            />
                                        )}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
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
        paddingBottom: 16,
    },

    // ===== Header =====
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

    // ===== Identity Block =====
    identityBlock: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: Colors.primary[500],
        padding: 3,
    },
    avatar: {
        flex: 1,
        borderRadius: 44,
        backgroundColor: Colors.spec.gray200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.spec.gray700,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 4,
    },
    userHandle: {
        fontSize: 15,
        color: Colors.spec.gray500,
        marginBottom: 12,
    },
    identityTagline: {
        fontSize: 15,
        color: Colors.spec.gray700,
        fontWeight: '500',
    },

    // ===== Core Metrics Card =====
    metricsCard: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    metricColumn: {
        flex: 1,
        alignItems: 'center',
    },
    metricIconContainer: {
        marginBottom: 12,
    },
    metricValue: {
        fontSize: 36,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 13,
        color: Colors.spec.gray500,
    },
    metricDivider: {
        width: 1,
        backgroundColor: Colors.spec.gray200,
        marginHorizontal: 20,
    },

    // ===== Focus Trend Card =====
    trendCard: {
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    trendHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.spec.gray900,
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    viewDetailsText: {
        fontSize: 13,
        color: Colors.primary[500],
        fontWeight: '500',
    },
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: Colors.spec.gray100,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray500,
    },
    periodTextActive: {
        color: Colors.spec.gray900,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 100,
        paddingTop: 8,
    },
    chartBarContainer: {
        flex: 1,
        alignItems: 'center',
    },
    chartBarWrapper: {
        width: 20,
        height: 80,
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    chartBar: {
        width: '100%',
        borderRadius: 10,
        minHeight: 8,
    },
    chartLabel: {
        fontSize: 11,
        color: Colors.spec.gray500,
    },

    // ===== Focus Style / Insights Card =====
    insightsCard: {
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.spec.gray100,
    },
    insightRowLast: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    insightIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.spec.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    insightLabel: {
        flex: 1,
        fontSize: 15,
        color: Colors.spec.gray700,
    },
    insightValue: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },

    // ===== Milestones Section =====
    milestonesSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    milestonesScroll: {
        paddingHorizontal: 24,
        gap: 12,
    },
    milestoneCard: {
        width: 120,
        height: 130,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    milestoneCardLocked: {
        opacity: 0.6,
    },
    milestoneIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.spec.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    milestoneIconEarned: {
        backgroundColor: Colors.secondary.soft,
    },
    milestoneTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.spec.gray900,
        textAlign: 'center',
    },
    milestoneTitleLocked: {
        color: Colors.spec.gray500,
    },
    milestoneLockIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
});
