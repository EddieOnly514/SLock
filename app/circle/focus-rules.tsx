import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/Colors';
import { COMMITMENT_LEVELS, BLOCKING_PRESETS, CommitmentLevel, BlockingPreset } from '../../constants/circles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FocusRulesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        name: string;
        duration: string;
        startNow: string;
        inviteCode: string;
    }>();

    // App Blocking state
    const [appBlockingEnabled, setAppBlockingEnabled] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<BlockingPreset>('default');

    // Commitment Level state
    const [commitmentLevel, setCommitmentLevel] = useState<CommitmentLevel>('locked_in');

    // Visibility state
    const [showFocusedMembers, setShowFocusedMembers] = useState(true);
    const [showEarlyLeavers, setShowEarlyLeavers] = useState(true);
    const [showExitsToGroup, setShowExitsToGroup] = useState(false);

    // Animation
    const createButtonScale = useSharedValue(1);

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleToggleBlocking = (value: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setAppBlockingEnabled(value);
    };

    const handleSelectPreset = (preset: BlockingPreset) => {
        Haptics.selectionAsync();
        setSelectedPreset(preset);
    };

    const handleSelectCommitment = (level: CommitmentLevel) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCommitmentLevel(level);
    };

    const handleCreateCircle = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        router.replace({
            pathname: '/circle/active',
            params: {
                name: params.name,
                duration: params.duration,
                startNow: params.startNow,
                inviteCode: params.inviteCode,
                appBlockingEnabled: appBlockingEnabled ? 'true' : 'false',
                blockingPreset: selectedPreset,
                commitmentLevel: commitmentLevel,
                showFocusedMembers: showFocusedMembers ? 'true' : 'false',
                showEarlyLeavers: showEarlyLeavers ? 'true' : 'false',
                showExitsToGroup: showExitsToGroup ? 'true' : 'false',
            },
        });
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: createButtonScale.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Red background matching basics screen */}
            <View style={styles.background} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.8)" />
                        </Pressable>
                        <Text style={styles.headerTitle}>Focus Rules</Text>
                        <View style={styles.placeholder} />
                    </View>

                    {/* Form Cards */}
                    <View style={styles.formContainer}>
                        {/* Circle Preview */}
                        <View style={styles.card}>
                            <View style={styles.previewRow}>
                                <View style={styles.previewIcon}>
                                    <Ionicons name="people" size={24} color={Colors.primary[500]} />
                                </View>
                                <View style={styles.previewInfo}>
                                    <Text style={styles.previewName}>{params.name || 'Study Circle'}</Text>
                                    <Text style={styles.previewDuration}>
                                        {params.duration} minutes • {params.startNow === 'true' ? 'Starting now' : 'Scheduled'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Section 1: App Blocking */}
                        <View style={styles.card}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Ionicons name="shield-checkmark" size={20} color={Colors.primary[500]} />
                                    <Text style={styles.sectionTitle}>App Blocking</Text>
                                </View>
                            </View>

                            <View style={styles.toggleRow}>
                                <Text style={styles.toggleLabel}>Enforce app blocking</Text>
                                <Switch
                                    value={appBlockingEnabled}
                                    onValueChange={handleToggleBlocking}
                                    trackColor={{ false: Colors.spec.gray300, true: Colors.primary[500] }}
                                    thumbColor="#FFFFFF"
                                />
                            </View>

                            {appBlockingEnabled && (
                                <View style={styles.presetList}>
                                    {BLOCKING_PRESETS.map((preset) => (
                                        <Pressable
                                            key={preset.key}
                                            style={[
                                                styles.presetCard,
                                                selectedPreset === preset.key && styles.presetCardActive,
                                            ]}
                                            onPress={() => handleSelectPreset(preset.key)}
                                        >
                                            <View style={[styles.presetIconContainer, { backgroundColor: `${preset.iconColor}20` }]}>
                                                <Ionicons name={preset.icon as any} size={18} color={preset.iconColor} />
                                            </View>
                                            <View style={styles.presetContent}>
                                                <Text style={[
                                                    styles.presetLabel,
                                                    selectedPreset === preset.key && styles.presetLabelActive,
                                                ]}>
                                                    {preset.label}
                                                </Text>
                                                <Text style={styles.presetDesc}>{preset.description}</Text>
                                            </View>
                                            {selectedPreset === preset.key && (
                                                <Ionicons name="checkmark-circle" size={22} color={Colors.primary[500]} />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Section 2: Commitment Level */}
                        <View style={styles.card}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Ionicons name="flame" size={20} color={Colors.spec.amber500} />
                                    <Text style={styles.sectionTitle}>Commitment Level</Text>
                                </View>
                            </View>

                            <View style={styles.commitmentGrid}>
                                {COMMITMENT_LEVELS.map((level) => (
                                    <Pressable
                                        key={level.key}
                                        style={[
                                            styles.commitmentCard,
                                            commitmentLevel === level.key && styles.commitmentCardActive,
                                        ]}
                                        onPress={() => handleSelectCommitment(level.key)}
                                    >
                                        <View style={[styles.commitmentIconContainer, { backgroundColor: `${level.iconColor}20` }]}>
                                            <Ionicons name={level.icon as any} size={22} color={level.iconColor} />
                                        </View>
                                        <Text style={[
                                            styles.commitmentLabel,
                                            commitmentLevel === level.key && styles.commitmentLabelActive,
                                        ]}>
                                            {level.label}
                                        </Text>
                                        <Text style={styles.commitmentDesc}>{level.description}</Text>
                                        {commitmentLevel === level.key && (
                                            <View style={styles.commitmentCheck}>
                                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                                            </View>
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Section 3: Visibility */}
                        <View style={styles.card}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Ionicons name="eye" size={20} color={Colors.spec.emerald500} />
                                    <Text style={styles.sectionTitle}>Visibility</Text>
                                </View>
                            </View>

                            <View style={styles.visibilityList}>
                                <View style={styles.visibilityRow}>
                                    <View style={styles.visibilityInfo}>
                                        <View style={styles.visibilityLabelRow}>
                                            <Ionicons name="radio-button-on" size={12} color={Colors.spec.emerald500} />
                                            <Text style={styles.visibilityLabel}>Show who's focused</Text>
                                        </View>
                                        <Text style={styles.visibilityDesc}>See active members in real-time</Text>
                                    </View>
                                    <Switch
                                        value={showFocusedMembers}
                                        onValueChange={setShowFocusedMembers}
                                        trackColor={{ false: Colors.spec.gray300, true: Colors.spec.emerald500 }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>

                                <View style={styles.visibilityDivider} />

                                <View style={styles.visibilityRow}>
                                    <View style={styles.visibilityInfo}>
                                        <View style={styles.visibilityLabelRow}>
                                            <Ionicons name="warning" size={12} color={Colors.spec.amber500} />
                                            <Text style={styles.visibilityLabel}>Show who left early</Text>
                                        </View>
                                        <Text style={styles.visibilityDesc}>Notify when someone leaves</Text>
                                    </View>
                                    <Switch
                                        value={showEarlyLeavers}
                                        onValueChange={setShowEarlyLeavers}
                                        trackColor={{ false: Colors.spec.gray300, true: Colors.spec.amber500 }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>

                                <View style={styles.visibilityDivider} />

                                <View style={styles.visibilityRow}>
                                    <View style={styles.visibilityInfo}>
                                        <View style={styles.visibilityLabelRow}>
                                            <Ionicons name="megaphone" size={12} color={Colors.primary[500]} />
                                            <Text style={styles.visibilityLabel}>Show exits to group</Text>
                                        </View>
                                        <Text style={styles.visibilityDesc}>Everyone sees when you leave</Text>
                                    </View>
                                    <Switch
                                        value={showExitsToGroup}
                                        onValueChange={setShowExitsToGroup}
                                        trackColor={{ false: Colors.spec.gray300, true: Colors.primary[500] }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Create Button */}
                    <View style={styles.continueSection}>
                        <Pressable
                            style={styles.continueButton}
                            onPress={handleCreateCircle}
                        >
                            <Ionicons name="rocket" size={20} color={Colors.primary[500]} />
                            <Text style={styles.continueText}>Create Circle</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 44,
    },
    // Form
    formContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
    },
    // Preview
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: Colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    previewInfo: {
        flex: 1,
    },
    previewName: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.spec.gray900,
        marginBottom: 2,
    },
    previewDuration: {
        fontSize: 14,
        color: Colors.spec.gray500,
    },
    // Sections
    sectionHeader: {
        marginBottom: 14,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.spec.gray900,
    },
    // Toggle
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.spec.gray700,
    },
    // Presets
    presetList: {
        marginTop: 14,
        gap: 10,
    },
    presetCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 12,
        padding: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    presetCardActive: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[50],
    },
    presetIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    presetContent: {
        flex: 1,
    },
    presetLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray700,
        marginBottom: 2,
    },
    presetLabelActive: {
        color: Colors.primary[600],
    },
    presetDesc: {
        fontSize: 12,
        color: Colors.spec.gray500,
    },
    // Commitment Level
    commitmentGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    commitmentCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 14,
        padding: 14,
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    commitmentCardActive: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[50],
    },
    commitmentIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    commitmentLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.spec.gray700,
        marginBottom: 4,
        textAlign: 'center',
    },
    commitmentLabelActive: {
        color: Colors.primary[600],
    },
    commitmentDesc: {
        fontSize: 10,
        color: Colors.spec.gray500,
        textAlign: 'center',
    },
    commitmentCheck: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Visibility
    visibilityList: {
        gap: 0,
    },
    visibilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    visibilityInfo: {
        flex: 1,
        marginRight: 16,
    },
    visibilityLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    visibilityLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray700,
    },
    visibilityDesc: {
        fontSize: 12,
        color: Colors.spec.gray500,
        marginLeft: 18,
    },
    visibilityDivider: {
        height: 1,
        backgroundColor: Colors.spec.gray100,
    },
    // Continue Button
    continueSection: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 18,
    },
    continueText: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.primary[500],
    },
});
