import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Share,
    Keyboard,
    TouchableWithoutFeedback,
    Modal,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { DURATION_PRESETS, generateInviteCode } from '../../constants/circles';

export default function CircleBasicsScreen() {
    const router = useRouter();

    // Form state
    const [circleName, setCircleName] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(30);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customDuration, setCustomDuration] = useState('');
    const [startNow, setStartNow] = useState(true);
    const [scheduledTime, setScheduledTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [inviteCode] = useState(generateInviteCode());

    // Content fade in animation
    const contentOpacity = useSharedValue(0);

    useEffect(() => {
        contentOpacity.value = withTiming(1, { duration: 400 });
    }, []);

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleDurationSelect = (value: number) => {
        Haptics.selectionAsync();
        setSelectedDuration(value);
        setShowCustomInput(false);
    };

    const handleCustomPress = () => {
        Haptics.selectionAsync();
        setShowCustomInput(true);
    };

    const handleCustomSubmit = () => {
        const mins = parseInt(customDuration);
        if (mins && mins > 0) {
            setSelectedDuration(mins);
        }
        Keyboard.dismiss();
    };

    const handleSchedulePress = () => {
        Haptics.selectionAsync();
        setStartNow(false);
        setShowTimePicker(true);
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (selectedDate) {
            // Ensure time is today and in the future
            const now = new Date();
            const newTime = new Date();
            newTime.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);

            if (newTime <= now) {
                // If selected time is in the past, add it to tomorrow... actually keep it today
                // Just use it as-is for same day
            }
            setScheduledTime(newTime);
        }
    };

    const handleShareInvite = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            await Share.share({
                message: `Join my Study Circle! 📚\n\nCode: ${inviteCode}\n\nDownload SLock: https://slock.app/join/${inviteCode}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleContinue = () => {
        if (!circleName.trim()) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        router.push({
            pathname: '/circle/focus-rules',
            params: {
                name: circleName,
                duration: selectedDuration,
                startNow: startNow ? 'true' : 'false',
                scheduledTime: scheduledTime.toISOString(),
                inviteCode: inviteCode,
            },
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.background} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Animated.View style={contentStyle}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Pressable style={styles.backButton} onPress={handleBack}>
                                    <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.8)" />
                                </Pressable>
                                <Text style={styles.headerTitle}>Create Circle</Text>
                                <View style={styles.placeholder} />
                            </View>

                            {/* Form Cards */}
                            <View style={styles.formContainer}>
                                {/* Circle Name */}
                                <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.card}>
                                    <Text style={styles.cardLabel}>Name your circle</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={circleName}
                                        onChangeText={setCircleName}
                                        maxLength={30}
                                    />
                                </Animated.View>

                                {/* Duration */}
                                <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.card}>
                                    <Text style={styles.cardLabel}>Duration</Text>
                                    <View style={styles.durationGrid}>
                                        {DURATION_PRESETS.map((preset) => (
                                            <Pressable
                                                key={preset.value}
                                                style={[
                                                    styles.durationChip,
                                                    selectedDuration === preset.value && !showCustomInput && styles.durationChipActive,
                                                ]}
                                                onPress={() => handleDurationSelect(preset.value)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.durationChipText,
                                                        selectedDuration === preset.value && !showCustomInput && styles.durationChipTextActive,
                                                    ]}
                                                >
                                                    {preset.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                        <Pressable
                                            style={[
                                                styles.durationChip,
                                                showCustomInput && styles.durationChipActive,
                                            ]}
                                            onPress={handleCustomPress}
                                        >
                                            <Text
                                                style={[
                                                    styles.durationChipText,
                                                    showCustomInput && styles.durationChipTextActive,
                                                ]}
                                            >
                                                Custom
                                            </Text>
                                        </Pressable>
                                    </View>

                                    {/* Custom Duration Input */}
                                    {showCustomInput && (
                                        <View style={styles.customInputContainer}>
                                            <TextInput
                                                style={styles.customInput}
                                                value={customDuration}
                                                onChangeText={setCustomDuration}
                                                keyboardType="number-pad"
                                                maxLength={3}
                                                autoFocus
                                                onSubmitEditing={handleCustomSubmit}
                                                onBlur={handleCustomSubmit}
                                            />
                                            <Text style={styles.customInputLabel}>minutes</Text>
                                        </View>
                                    )}
                                </Animated.View>

                                {/* Start Time */}
                                <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.card}>
                                    <Text style={styles.cardLabel}>Start Time</Text>
                                    <View style={styles.startTimeRow}>
                                        <Pressable
                                            style={[styles.startTimeOption, startNow && styles.startTimeOptionActive]}
                                            onPress={() => { setStartNow(true); setShowTimePicker(false); Haptics.selectionAsync(); }}
                                        >
                                            <Ionicons
                                                name="flash"
                                                size={20}
                                                color={startNow ? '#FFFFFF' : Colors.spec.gray600}
                                            />
                                            <Text style={[styles.startTimeText, startNow && styles.startTimeTextActive]}>
                                                Start Now
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.startTimeOption, !startNow && styles.startTimeOptionActive]}
                                            onPress={handleSchedulePress}
                                        >
                                            <Ionicons
                                                name="calendar"
                                                size={20}
                                                color={!startNow ? '#FFFFFF' : Colors.spec.gray600}
                                            />
                                            <Text style={[styles.startTimeText, !startNow && styles.startTimeTextActive]}>
                                                Schedule
                                            </Text>
                                        </Pressable>
                                    </View>

                                    {/* Time Picker */}
                                    {!startNow && (
                                        <View style={styles.timePickerContainer}>
                                            <Pressable
                                                style={styles.timeDisplay}
                                                onPress={() => setShowTimePicker(true)}
                                            >
                                                <Ionicons name="time-outline" size={20} color={Colors.primary[500]} />
                                                <Text style={styles.timeText}>{formatTime(scheduledTime)}</Text>
                                                <Text style={styles.todayLabel}>Today</Text>
                                            </Pressable>

                                            {showTimePicker && (
                                                <View>
                                                    <DateTimePicker
                                                        value={scheduledTime}
                                                        mode="time"
                                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                        onChange={handleTimeChange}
                                                        style={styles.timePicker}
                                                    />
                                                    <Pressable
                                                        style={styles.confirmTimeButton}
                                                        onPress={() => setShowTimePicker(false)}
                                                    >
                                                        <Text style={styles.confirmTimeText}>Confirm</Text>
                                                    </Pressable>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </Animated.View>

                                {/* Invite Code */}
                                <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.card}>
                                    <Text style={styles.cardLabel}>Invite Friends</Text>
                                    <View style={styles.inviteRow}>
                                        <View style={styles.inviteCodeBox}>
                                            <Text style={styles.inviteCodeLabel}>Code:</Text>
                                            <Text style={styles.inviteCodeValue}>{inviteCode}</Text>
                                        </View>
                                        <Pressable style={styles.shareButton} onPress={handleShareInvite}>
                                            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                                            <Text style={styles.shareButtonText}>Share</Text>
                                        </Pressable>
                                    </View>
                                </Animated.View>
                            </View>

                            {/* Continue Button */}
                            <Animated.View entering={FadeInUp.duration(400).delay(500)} style={styles.continueSection}>
                                <Pressable
                                    style={[styles.continueButton, !circleName.trim() && styles.continueButtonDisabled]}
                                    onPress={handleContinue}
                                    disabled={!circleName.trim()}
                                >
                                    <Text style={[styles.continueText, !circleName.trim() && styles.continueTextDisabled]}>
                                        Continue
                                    </Text>
                                    <Ionicons
                                        name="arrow-forward"
                                        size={20}
                                        color={circleName.trim() ? Colors.primary[500] : Colors.spec.gray400}
                                    />
                                </Pressable>
                            </Animated.View>
                        </Animated.View>
                    </ScrollView>
                </TouchableWithoutFeedback>
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
    formContainer: {
        paddingHorizontal: 24,
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray500,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    textInput: {
        backgroundColor: Colors.spec.gray50,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: Colors.spec.gray900,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    durationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    durationChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: Colors.spec.gray100,
    },
    durationChipActive: {
        backgroundColor: Colors.primary[500],
    },
    durationChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray700,
    },
    durationChipTextActive: {
        color: '#FFFFFF',
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        gap: 12,
    },
    customInput: {
        flex: 1,
        backgroundColor: Colors.spec.gray50,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.spec.gray900,
        borderWidth: 1,
        borderColor: Colors.primary[300],
    },
    customInputLabel: {
        fontSize: 15,
        color: Colors.spec.gray500,
    },
    startTimeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    startTimeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.spec.gray100,
        borderRadius: 12,
        paddingVertical: 12,
    },
    startTimeOptionActive: {
        backgroundColor: Colors.primary[500],
    },
    startTimeText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.spec.gray700,
    },
    startTimeTextActive: {
        color: '#FFFFFF',
    },
    timePickerContainer: {
        marginTop: 14,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 10,
    },
    timeText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    todayLabel: {
        fontSize: 14,
        color: Colors.primary[500],
        fontWeight: '500',
    },
    timePicker: {
        marginTop: 8,
        height: 150,
    },
    confirmTimeButton: {
        backgroundColor: Colors.primary[500],
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    confirmTimeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    inviteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    inviteCodeBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.spec.gray50,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 8,
    },
    inviteCodeLabel: {
        fontSize: 14,
        color: Colors.spec.gray500,
    },
    inviteCodeValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.spec.gray900,
        letterSpacing: 2,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.primary[500],
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    shareButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
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
    continueButtonDisabled: {
        opacity: 0.6,
    },
    continueText: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.primary[500],
    },
    continueTextDisabled: {
        color: Colors.spec.gray400,
    },
});
