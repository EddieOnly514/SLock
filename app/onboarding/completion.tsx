import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    withDelay,
    runOnJS,
    useAnimatedProps,
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ANIMATION_THEME } from '../../constants/AnimationTheme';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import { useOnboarding } from '../../hooks/useOnboarding';
import Colors from '../../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HOLD_DURATION = 3000; // 3 seconds
const BUTTON_SIZE = 200;
const STROKE_WIDTH = 6;
const RADIUS = (BUTTON_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CompletionScreen() {
    const router = useRouter();
    const { data } = useOnboarding();
    const [isHolding, setIsHolding] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hapticIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Premium Animation Values
    const contentOpacity = useSharedValue(0);
    const contentTranslateY = useSharedValue(20);
    const iconScale = useSharedValue(0.9);
    const iconOpacity = useSharedValue(0);
    const holdProgress = useSharedValue(0);
    const buttonScale = useSharedValue(1);
    const lockRotation = useSharedValue(0);

    React.useEffect(() => {
        // Page Entry: 700ms duration, Bezier easing
        const { eased, duration, stagger } = ANIMATION_THEME;

        // 1. Content (0ms)
        contentOpacity.value = withTiming(1, { duration: duration.slow, easing: eased });
        contentTranslateY.value = withTiming(0, { duration: duration.slow, easing: eased });

        // 2. Icon (200ms) - Subtle scale, no bounce
        iconOpacity.value = withDelay(stagger * 2, withTiming(1, { duration: duration.slow, easing: eased }));
        iconScale.value = withDelay(stagger * 2, withTiming(1, { duration: duration.slow, easing: eased }));
    }, []);

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ translateY: contentTranslateY.value }],
    }));

    const iconStyle = useAnimatedStyle(() => ({
        opacity: iconOpacity.value,
        transform: [{ scale: iconScale.value }],
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const lockStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${lockRotation.value}deg` }],
    }));

    const animatedCircleProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCUMFERENCE - (holdProgress.value * CIRCUMFERENCE),
    }));

    const navigateToDashboard = () => {
        router.replace('/(tabs)');
    };

    const handlePressIn = () => {
        setIsHolding(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Calm pressed state: scale to 0.98, timing only
        buttonScale.value = withTiming(0.98, {
            duration: ANIMATION_THEME.duration.fast,
            easing: ANIMATION_THEME.eased
        });

        holdProgress.value = withTiming(1, {
            duration: HOLD_DURATION,
            easing: Easing.linear,
        });

        hapticIntervalRef.current = setInterval(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 300);

        holdTimeoutRef.current = setTimeout(() => {
            setIsCompleted(true);
            setIsHolding(false);

            if (hapticIntervalRef.current) {
                clearInterval(hapticIntervalRef.current);
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Lock closing animation - reduced bounce for premium feel
            lockRotation.value = withTiming(-10, { duration: 200, easing: ANIMATION_THEME.eased }, () => {
                lockRotation.value = withTiming(0, { duration: 200, easing: ANIMATION_THEME.eased });
            });

            // Gentle pulse before navigation
            buttonScale.value = withTiming(1.02, { duration: 200, easing: ANIMATION_THEME.eased }, () => {
                buttonScale.value = withTiming(1, { duration: 200, easing: ANIMATION_THEME.eased });
                runOnJS(navigateToDashboard)();
            });
        }, HOLD_DURATION);
    };

    const handlePressOut = () => {
        if (!isCompleted) {
            setIsHolding(false);

            if (holdTimeoutRef.current) {
                clearTimeout(holdTimeoutRef.current);
            }
            if (hapticIntervalRef.current) {
                clearInterval(hapticIntervalRef.current);
            }

            // Reset smoothly
            holdProgress.value = withTiming(0, { duration: 300, easing: ANIMATION_THEME.eased });
            buttonScale.value = withTiming(1, {
                duration: ANIMATION_THEME.duration.fast,
                easing: ANIMATION_THEME.eased
            });
        }
    };

    return (
        <AnimatedBackground>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <Animated.View style={[styles.content, contentStyle]}>
                    <Animated.View style={[styles.iconContainer, iconStyle]}>
                        <LinearGradient
                            colors={[Colors.primary[500], Colors.primary[600]]}
                            style={styles.iconGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="checkmark-circle" size={56} color="#FFFFFF" />
                        </LinearGradient>
                    </Animated.View>

                    <Text style={styles.title}>
                        You're All Set{data.name ? `, ${data.name}` : ''}!
                    </Text>

                    <Text style={styles.subtitle}>
                        Your journey to reclaiming {data.socialMediaHours || 4} hours per day starts{'\u00A0'}now
                    </Text>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Your personalized plan:</Text>
                        <View style={styles.summaryRows}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryKey}>Current Screen Time</Text>
                                <Text style={styles.summaryValue}>{data.socialMediaHours || 4}h/day</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryKey}>Life Satisfaction</Text>
                                <Text style={styles.summaryValue}>{data.lifeSatisfaction || 50}%</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryKey}>Selected Plan</Text>
                                <Text style={[styles.summaryValue, styles.capitalize]}>
                                    {data.selectedPlan || 'Free'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Animated.View style={[styles.holdButtonContainer, buttonStyle]}>
                        <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            style={styles.holdButtonPressable}
                        >
                            <Svg
                                width={BUTTON_SIZE}
                                height={BUTTON_SIZE}
                                style={styles.progressRing}
                            >
                                <Circle
                                    cx={BUTTON_SIZE / 2}
                                    cy={BUTTON_SIZE / 2}
                                    r={RADIUS}
                                    fill="none"
                                    stroke={Colors.spec.gray200}
                                    strokeWidth={STROKE_WIDTH}
                                />
                                <AnimatedCircle
                                    cx={BUTTON_SIZE / 2}
                                    cy={BUTTON_SIZE / 2}
                                    r={RADIUS}
                                    fill="none"
                                    stroke="Colors.primary[500]"
                                    strokeWidth={STROKE_WIDTH}
                                    strokeLinecap="round"
                                    strokeDasharray={CIRCUMFERENCE}
                                    animatedProps={animatedCircleProps}
                                    rotation={-90}
                                    origin={`${BUTTON_SIZE / 2}, ${BUTTON_SIZE / 2}`}
                                />
                            </Svg>

                            <LinearGradient
                                colors={isHolding ? [Colors.primary[700], Colors.success[600]] : [Colors.primary[500], Colors.primary[600]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.holdButton}
                            >
                                <Animated.View style={lockStyle}>
                                    <Ionicons
                                        name={isCompleted ? "lock-closed" : "lock-open"}
                                        size={32}
                                        color="#FFFFFF"
                                    />
                                </Animated.View>
                                <Text style={styles.holdButtonText}>
                                    {isHolding ? 'Keep holding...' : 'Hold to SLock in'}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>

                    <Text style={styles.helperText}>
                        Hold for 3 seconds to begin your journey
                    </Text>
                </Animated.View>
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.spec.gray900,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.spec.gray600,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    summaryLabel: {
        fontSize: 14,
        color: Colors.spec.gray600,
        marginBottom: 14,
    },
    summaryRows: {
        gap: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryKey: {
        fontSize: 15,
        color: Colors.spec.gray700,
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    holdButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    holdButtonPressable: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressRing: {
        position: 'absolute',
    },
    holdButton: {
        width: BUTTON_SIZE - STROKE_WIDTH * 4,
        height: BUTTON_SIZE - STROKE_WIDTH * 4,
        borderRadius: (BUTTON_SIZE - STROKE_WIDTH * 4) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    holdButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    helperText: {
        fontSize: 14,
        color: Colors.spec.gray400,
        marginTop: 20,
        textAlign: 'center',
    },
});
