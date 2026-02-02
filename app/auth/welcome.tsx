import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    interpolate,
    Extrapolation,
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

const { width } = Dimensions.get('window');

// Animation timing constants
const EXPAND_DURATION = 380;
const COLLAPSE_DURATION = 320;
const OVERLAY_DURATION = 240;
const ROW_REVEAL_DURATION = 280;
const ROW_STAGGER = 70;

// Panel heights
const BUTTON_HEIGHT = 56;
const EXPANDED_HEIGHT = 260;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    // Animation values
    const expandProgress = useSharedValue(0);
    const overlayOpacity = useSharedValue(0);

    // Staggered row animations
    const row1Progress = useSharedValue(0);
    const row2Progress = useSharedValue(0);
    const row3Progress = useSharedValue(0);
    const backProgress = useSharedValue(0);

    const handleCreateAccount = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/auth/signup');
    };

    const expandPanel = () => {
        setIsExpanded(true);

        // Expand panel upward
        expandProgress.value = withTiming(1, {
            duration: EXPAND_DURATION,
            easing: Easing.out(Easing.cubic)
        });

        // Show overlay
        overlayOpacity.value = withTiming(0.35, {
            duration: OVERLAY_DURATION,
            easing: Easing.out(Easing.cubic)
        });

        // Staggered row reveal - starts after panel expands ~60%
        const startDelay = EXPAND_DURATION * 0.5;
        row1Progress.value = withDelay(
            startDelay,
            withTiming(1, { duration: ROW_REVEAL_DURATION, easing: Easing.out(Easing.cubic) })
        );
        row2Progress.value = withDelay(
            startDelay + ROW_STAGGER,
            withTiming(1, { duration: ROW_REVEAL_DURATION, easing: Easing.out(Easing.cubic) })
        );
        row3Progress.value = withDelay(
            startDelay + ROW_STAGGER * 2,
            withTiming(1, { duration: ROW_REVEAL_DURATION, easing: Easing.out(Easing.cubic) })
        );
        backProgress.value = withDelay(
            startDelay + ROW_STAGGER * 3,
            withTiming(1, { duration: ROW_REVEAL_DURATION, easing: Easing.out(Easing.cubic) })
        );
    };

    const handleSignIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        expandPanel();
    };

    const collapsePanel = () => {
        // Fade out rows quickly (reverse stagger)
        backProgress.value = withTiming(0, { duration: 100 });
        row3Progress.value = withDelay(20, withTiming(0, { duration: 100 }));
        row2Progress.value = withDelay(40, withTiming(0, { duration: 100 }));
        row1Progress.value = withDelay(60, withTiming(0, { duration: 100 }));

        // Collapse panel
        expandProgress.value = withDelay(
            80,
            withTiming(0, {
                duration: COLLAPSE_DURATION,
                easing: Easing.out(Easing.cubic)
            })
        );

        // Hide overlay
        overlayOpacity.value = withTiming(0, {
            duration: OVERLAY_DURATION,
            easing: Easing.out(Easing.cubic)
        });

        // Reset state after animation
        setTimeout(() => setIsExpanded(false), COLLAPSE_DURATION + 100);
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        collapsePanel();
    };

    const handleOverlayPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        collapsePanel();
    };

    const handleAppleSignIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        alert('Apple Sign In coming soon!');
    };

    const handleGoogleSignIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        alert('Google Sign In coming soon!');
    };

    const handlePhoneSignIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/auth/login');
    };

    // Overlay style
    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        pointerEvents: overlayOpacity.value > 0 ? 'auto' : 'none',
    }));

    // Create account button fade out when expanded
    const createAccountStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expandProgress.value, [0, 0.3], [1, 0], Extrapolation.CLAMP),
        transform: [
            { translateY: interpolate(expandProgress.value, [0, 1], [0, 20], Extrapolation.CLAMP) }
        ],
    }));

    // Sign in button / expanding panel style - grows UPWARD
    const expandingPanelStyle = useAnimatedStyle(() => {
        const height = interpolate(
            expandProgress.value,
            [0, 1],
            [BUTTON_HEIGHT, EXPANDED_HEIGHT],
            Extrapolation.CLAMP
        );

        const borderRadius = interpolate(
            expandProgress.value,
            [0, 1],
            [100, 24],
            Extrapolation.CLAMP
        );

        return {
            height,
            borderRadius,
        };
    });

    // Sign in text fade out
    const signInLabelStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expandProgress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
    }));

    // Row animation styles - fade in + slide up
    const createRowStyle = (progress: Animated.SharedValue<number>) => {
        return useAnimatedStyle(() => ({
            opacity: progress.value,
            transform: [
                { translateY: interpolate(progress.value, [0, 1], [8, 0], Extrapolation.CLAMP) }
            ],
        }));
    };

    const row1Style = createRowStyle(row1Progress);
    const row2Style = createRowStyle(row2Progress);
    const row3Style = createRowStyle(row3Progress);
    const backStyle = createRowStyle(backProgress);

    // Options container fade in
    const optionsContainerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expandProgress.value, [0.4, 0.7], [0, 1], Extrapolation.CLAMP),
    }));

    return (
        <AnimatedBackground>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Dim Overlay */}
                <Animated.View style={[styles.overlay, overlayStyle]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleOverlayPress} />
                </Animated.View>

                {/* Top Section - Brand Name & Tagline */}
                <View style={styles.topSection}>
                    <Text style={styles.brandName}>SLock</Text>
                    <Text style={styles.tagline}>Lock in, Together.</Text>
                </View>

                {/* Middle Section - Logo */}
                <View style={styles.middleSection}>
                    <Image
                        source={require('../../assets/slock_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Bottom Section - Actions */}
                <View style={styles.bottomSection}>
                    {/* Create Account Button - Fades out when expanded */}
                    <Animated.View style={createAccountStyle}>
                        <Pressable
                            onPress={handleCreateAccount}
                            style={({ pressed }) => [
                                styles.createAccountButton,
                                pressed && styles.buttonPressed,
                            ]}
                            disabled={isExpanded}
                        >
                            <LinearGradient
                                colors={[Colors.primary[500], Colors.primary[600]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.createAccountGradient}
                            >
                                <Text style={styles.createAccountText}>Create account</Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>

                    {/* Expanding Panel - Sign In Button that grows upward */}
                    <Animated.View style={[styles.expandingPanel, expandingPanelStyle]}>
                        {/* Sign In Label (visible when collapsed) */}
                        <Animated.View style={[styles.signInLabelContainer, signInLabelStyle]}>
                            <Pressable
                                onPress={handleSignIn}
                                style={styles.signInTouchable}
                                disabled={isExpanded}
                            >
                                <Text style={styles.signInText}>Sign in</Text>
                            </Pressable>
                        </Animated.View>

                        {/* Expanded Options (visible when expanded) */}
                        <Animated.View style={[styles.optionsContainer, optionsContainerStyle]}>
                            {/* Apple Sign In */}
                            <Animated.View style={row1Style}>
                                <Pressable
                                    onPress={handleAppleSignIn}
                                    style={({ pressed }) => [
                                        styles.socialButton,
                                        pressed && styles.socialButtonPressed,
                                    ]}
                                >
                                    <Ionicons name="logo-apple" size={22} color={Colors.text.primary} />
                                    <Text style={styles.socialButtonText}>Continue with Apple</Text>
                                </Pressable>
                            </Animated.View>

                            {/* Google Sign In */}
                            <Animated.View style={row2Style}>
                                <Pressable
                                    onPress={handleGoogleSignIn}
                                    style={({ pressed }) => [
                                        styles.socialButton,
                                        pressed && styles.socialButtonPressed,
                                    ]}
                                >
                                    <Ionicons name="logo-google" size={20} color="#4285F4" />
                                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                                </Pressable>
                            </Animated.View>

                            {/* Phone Sign In */}
                            <Animated.View style={row3Style}>
                                <Pressable
                                    onPress={handlePhoneSignIn}
                                    style={({ pressed }) => [
                                        styles.phoneButton,
                                        pressed && styles.phoneButtonPressed,
                                    ]}
                                >
                                    <LinearGradient
                                        colors={[Colors.primary[500], Colors.primary[600]]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.phoneButtonGradient}
                                    >
                                        <Text style={styles.phoneButtonText}>Continue with Phone</Text>
                                    </LinearGradient>
                                </Pressable>
                            </Animated.View>

                            {/* Back Button */}
                            <Animated.View style={backStyle}>
                                <Pressable onPress={handleBack} style={styles.backButton}>
                                    <Text style={styles.backText}>Back</Text>
                                </Pressable>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>

                    {/* Legal Text - at bottom */}
                    <Text style={styles.legalText}>
                        By continuing, you agree to our{'\n'}
                        <Text style={styles.legalLink}>Terms</Text> and <Text style={styles.legalLink}>Privacy Policy</Text>.
                    </Text>
                </View>
            </SafeAreaView>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        zIndex: 5,
    },
    topSection: {
        alignItems: 'center',
        paddingTop: 80,
        zIndex: 1,
    },
    brandName: {
        fontSize: 56,
        fontWeight: '700',
        color: Colors.text.primary,
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 20,
        fontWeight: '500',
        color: Colors.text.primary,
        marginTop: 8,
        letterSpacing: -0.3,
    },
    middleSection: {
        position: 'absolute',
        top: '35%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    logo: {
        width: 200,
        height: 200,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 16,
        zIndex: 10,
        minHeight: 280,
        justifyContent: 'flex-end',
    },
    createAccountButton: {
        borderRadius: 100,
        overflow: 'hidden',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 12,
    },
    createAccountGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createAccountText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    expandingPanel: {
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    signInLabelContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInTouchable: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        color: Colors.text.primary,
        fontSize: 17,
        fontWeight: '600',
    },
    optionsContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        justifyContent: 'flex-end',
        gap: 10,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.border.medium,
        gap: 12,
    },
    socialButtonPressed: {
        backgroundColor: Colors.neutral[50],
    },
    socialButtonText: {
        color: Colors.text.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    phoneButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    phoneButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    phoneButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    phoneButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    backText: {
        color: Colors.text.secondary,
        fontSize: 15,
        fontWeight: '500',
    },
    legalText: {
        fontSize: 13,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 16,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    legalLink: {
        textDecorationLine: 'underline',
        color: Colors.text.primary,
        fontWeight: '500',
    },
});
