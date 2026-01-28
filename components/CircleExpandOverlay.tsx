import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.85, 380);
const FULL_SCREEN_SCALE = (Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.5) / CIRCLE_SIZE;

interface CircleExpandOverlayProps {
    visible: boolean;
    onClose: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CircleExpandOverlay({
    visible,
    onClose,
}: CircleExpandOverlayProps) {
    const router = useRouter();
    const [showOverlay, setShowOverlay] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);

    // Animation values - start with visible values
    const circleScale = useSharedValue(0.15);
    const circleOpacity = useSharedValue(0);
    const contentOpacity = useSharedValue(0);
    const backdropOpacity = useSharedValue(0);

    // Show/hide overlay based on visible prop
    useEffect(() => {
        if (visible) {
            setShowOverlay(true);
            setIsExpanding(false);

            // IMPORTANT: Reset scale to small value BEFORE animating
            // This prevents the shrink-from-fullscreen bug
            circleScale.value = 0.15;
            circleOpacity.value = 0;
            contentOpacity.value = 0;
            backdropOpacity.value = 0;

            // Small delay to ensure reset happens first, then animate in
            setTimeout(() => {
                circleOpacity.value = withTiming(1, { duration: 200 });
                circleScale.value = withTiming(1, {
                    duration: 350,
                    easing: Easing.out(Easing.cubic),
                });
                backdropOpacity.value = withTiming(0.6, { duration: 300 });
                contentOpacity.value = withDelay(180, withTiming(1, { duration: 200 }));
            }, 10);
        } else if (!isExpanding) {
            // Animate out
            contentOpacity.value = withTiming(0, { duration: 100 });
            backdropOpacity.value = withTiming(0, { duration: 200 });
            circleOpacity.value = withTiming(0, { duration: 200 });
            circleScale.value = withTiming(0.15, {
                duration: 250,
                easing: Easing.in(Easing.cubic)
            });

            // Hide overlay after animation
            setTimeout(() => {
                if (!visible) setShowOverlay(false);
            }, 300);
        }
    }, [visible]);

    const navigateToCreate = () => {
        setShowOverlay(false);
        onClose();
        router.push('/circle/basics');
    };

    // Animated styles
    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const circleContainerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: circleScale.value }],
        opacity: circleOpacity.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
    };

    const handleJoin = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onClose();
        setTimeout(() => {
            router.push('/circle/join');
        }, 300);
    };

    const handleCreate = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsExpanding(true);

        // Hide content first
        contentOpacity.value = withTiming(0, { duration: 100 });

        // Expand circle to full screen
        circleScale.value = withTiming(FULL_SCREEN_SCALE, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
        });

        // Navigate while circle is still visible (don't hide overlay yet)
        setTimeout(() => {
            router.push('/circle/basics');

            // Hide overlay AFTER screen has fully rendered (increased delay)
            setTimeout(() => {
                setShowOverlay(false);
                onClose();
            }, 300);
        }, 150);
    };

    if (!showOverlay) {
        return null;
    }

    return (
        <View style={styles.overlay} pointerEvents="auto">
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, backdropStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
            </Animated.View>

            {/* Expanding Circle */}
            <Animated.View style={[styles.circleContainer, circleContainerStyle]}>
                <View style={styles.circle}>
                    {/* Content - always rendered */}
                    <Animated.View style={[styles.content, contentStyle]}>
                        <Text style={styles.title}>Study Circle</Text>

                        {/* Create Circle Button */}
                        <Pressable style={styles.primaryButton} onPress={handleCreate}>
                            <Text style={styles.primaryButtonText}>Create Circle</Text>
                        </Pressable>

                        {/* Join Circle Button */}
                        <Pressable style={styles.secondaryButton} onPress={handleJoin}>
                            <Text style={styles.secondaryButtonText}>Join Circle</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(80, 80, 80, 1)',
    },
    circleContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 40,
        textAlign: 'center',
    },
    primaryButton: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary[500],
    },
    secondaryButton: {
        width: '85%',
        backgroundColor: 'transparent',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    secondaryButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
