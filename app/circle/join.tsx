import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';

export default function JoinCircleScreen() {
    const router = useRouter();
    const [inviteCode, setInviteCode] = useState('');

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleJoin = () => {
        if (inviteCode.length < 6) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // TODO: Join circle logic
        router.replace('/circle/active');
    };

    return (
        <AnimatedBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Pressable style={styles.backButton} onPress={handleBack}>
                                <Ionicons name="arrow-back" size={24} color={Colors.spec.gray700} />
                            </Pressable>
                            <Text style={styles.headerTitle}>Join Circle</Text>
                            <View style={styles.placeholder} />
                        </View>

                        <Animated.View entering={FadeIn.duration(300)} style={styles.formContainer}>
                            <View style={styles.iconContainer}>
                                <LinearGradient
                                    colors={[Colors.primary[500], Colors.primary[600]]}
                                    style={styles.iconGradient}
                                >
                                    <Ionicons name="enter" size={40} color="#FFFFFF" />
                                </LinearGradient>
                            </View>

                            <Text style={styles.title}>Enter Invite Code</Text>
                            <Text style={styles.subtitle}>
                                Ask your friend for the 6-digit code to join their circle
                            </Text>

                            <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                                <TextInput
                                    style={styles.codeInput}
                                    value={inviteCode}
                                    onChangeText={(text) => setInviteCode(text.toUpperCase())}
                                    placeholder="ABC123"
                                    placeholderTextColor={Colors.spec.gray300}
                                    maxLength={6}
                                    autoCapitalize="characters"
                                    autoFocus
                                    textAlign="center"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.buttonContainer}>
                                <Pressable
                                    style={[styles.joinButton, inviteCode.length < 6 && styles.joinButtonDisabled]}
                                    onPress={handleJoin}
                                    disabled={inviteCode.length < 6}
                                >
                                    <LinearGradient
                                        colors={inviteCode.length >= 6 ? [Colors.primary[500], Colors.primary[600]] : [Colors.spec.gray300, Colors.spec.gray300]}
                                        style={styles.joinButtonGradient}
                                    >
                                        <Text style={[styles.joinButtonText, inviteCode.length < 6 && styles.joinButtonTextDisabled]}>
                                            Join Circle
                                        </Text>
                                        <Ionicons
                                            name="arrow-forward"
                                            size={20}
                                            color={inviteCode.length >= 6 ? '#FFFFFF' : Colors.spec.gray500}
                                        />
                                    </LinearGradient>
                                </Pressable>
                            </Animated.View>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
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
        borderRadius: 12,
        backgroundColor: Colors.spec.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    placeholder: {
        width: 44,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.spec.gray900,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.spec.gray500,
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    codeInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 20,
        fontSize: 32,
        fontWeight: '700',
        color: Colors.spec.gray900,
        borderWidth: 2,
        borderColor: Colors.spec.gray200,
        width: 220,
        letterSpacing: 8,
    },
    buttonContainer: {
        marginTop: 32,
        width: '100%',
    },
    joinButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    joinButtonDisabled: {
        opacity: 0.7,
    },
    joinButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 18,
    },
    joinButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    joinButtonTextDisabled: {
        color: Colors.spec.gray500,
    },
});
