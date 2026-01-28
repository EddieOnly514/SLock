import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';
import AnimatedBackground from '../../components/onboarding/AnimatedBackground';
import { useCircleOverlay } from '../../hooks/useCircleOverlay';

interface Circle {
    id: string;
    name: string;
    members: number;
    isActive: boolean;
}

// Mock data for recent circles
const RECENT_CIRCLES: Circle[] = [
    { id: '1', name: 'Study Squad', members: 4, isActive: true },
    { id: '2', name: 'Work Focus', members: 2, isActive: false },
];

export default function CreateScreen() {
    const { showOverlay } = useCircleOverlay();

    const handleOpenOverlay = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        showOverlay();
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
                        <Text style={styles.title}>Circles</Text>
                    </View>

                    {/* Recent Circles */}
                    {RECENT_CIRCLES.length > 0 && (
                        <Animated.View
                            entering={FadeInDown.duration(600).delay(100)}
                            style={styles.recentSection}
                        >
                            <Text style={styles.sectionTitle}>Your Circles</Text>
                            {RECENT_CIRCLES.map((circle) => (
                                <Pressable key={circle.id} style={styles.circleCard}>
                                    <View style={styles.circleIcon}>
                                        <Ionicons
                                            name={circle.isActive ? 'radio-button-on' : 'ellipse-outline'}
                                            size={20}
                                            color={circle.isActive ? Colors.spec.emerald500 : Colors.spec.gray400}
                                        />
                                    </View>
                                    <View style={styles.circleInfo}>
                                        <Text style={styles.circleName}>{circle.name}</Text>
                                        <Text style={styles.circleMembers}>
                                            {circle.members} members {circle.isActive && '• Active now'}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={Colors.spec.gray400} />
                                </Pressable>
                            ))}
                        </Animated.View>
                    )}

                    {/* Prompt to create */}
                    <Animated.View
                        entering={FadeInDown.duration(400).delay(200)}
                        style={styles.promptSection}
                    >
                        <Pressable style={styles.newCircleButton} onPress={handleOpenOverlay}>
                            <Ionicons name="add-circle" size={24} color={Colors.primary[500]} />
                            <Text style={styles.newCircleText}>Start a Study Circle</Text>
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
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.spec.gray900,
    },
    recentSection: {
        marginTop: 8,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.spec.gray900,
        marginBottom: 16,
    },
    circleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.spec.gray200,
    },
    circleIcon: {
        marginRight: 12,
    },
    circleInfo: {
        flex: 1,
    },
    circleName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.spec.gray900,
    },
    circleMembers: {
        fontSize: 13,
        color: Colors.spec.gray500,
    },
    promptSection: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    newCircleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.primary[50],
        borderRadius: 16,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: Colors.primary[100],
    },
    newCircleText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary[500],
    },
});
