import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';
import { useCircleOverlay } from '../hooks/useCircleOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab configuration
const TAB_CONFIG = [
    { name: 'index', icon: 'home', label: 'Home' },
    { name: 'friends', icon: 'people', label: 'Friends' },
    { name: 'create', icon: 'add', label: '', isCenter: true },
    { name: 'rewards', icon: 'gift', label: 'Rewards' },
    { name: 'profile', icon: 'person', label: 'Profile' },
];

const VISIBLE_TABS = TAB_CONFIG.length;
const TAB_WIDTH = SCREEN_WIDTH / VISIBLE_TABS;
const BLOB_WIDTH = 56;
const BLOB_HEIGHT = 52;
const CENTER_TAB_INDEX = 2;

interface LiquidTabBarProps extends BottomTabBarProps { }

export default function LiquidTabBar({ state, navigation }: LiquidTabBarProps) {
    const { showOverlay } = useCircleOverlay();

    // Get the actual visible tab index (excluding center button from selection tracking)
    const getVisibleIndex = () => {
        // If center is selected, keep blob where it was (don't move to center)
        if (state.index === CENTER_TAB_INDEX) {
            return -1; // Hide blob
        }
        return state.index;
    };

    const currentVisibleIndex = getVisibleIndex();
    const translateX = useSharedValue(currentVisibleIndex >= 0 ? currentVisibleIndex * TAB_WIDTH : 0);
    const blobOpacity = useSharedValue(currentVisibleIndex >= 0 ? 1 : 0);
    const prevVisibleIndex = useSharedValue(currentVisibleIndex);

    useEffect(() => {
        const visibleIndex = getVisibleIndex();

        if (visibleIndex >= 0) {
            const targetX = visibleIndex * TAB_WIDTH;
            blobOpacity.value = withTiming(1, { duration: 150 });
            translateX.value = withSpring(targetX, {
                damping: 18,
                stiffness: 150,
                mass: 0.8,
            });
            prevVisibleIndex.value = visibleIndex;
        } else {
            // Center tab selected - hide blob
            blobOpacity.value = withTiming(0, { duration: 150 });
        }
    }, [state.index]);

    // Animated blob style
    const blobStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value + (TAB_WIDTH - BLOB_WIDTH) / 2 },
            ],
            opacity: blobOpacity.value,
        };
    });

    const handlePress = (index: number, routeName: string, isCenter: boolean) => {
        if (isCenter) {
            // Show the circle overlay instead of navigating
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            showOverlay();
            return;
        }

        const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
            navigation.navigate(routeName);
        }
    };

    return (
        <View style={styles.container}>
            {/* Liquid blob indicator */}
            <Animated.View style={[styles.blobContainer, blobStyle]}>
                <View style={styles.blob}>
                    <LinearGradient
                        colors={[Colors.primary[500], Colors.primary[600]]}
                        style={styles.blobGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </View>
            </Animated.View>

            {/* Tab buttons */}
            {state.routes.map((route, index) => {
                const tabConfig = TAB_CONFIG.find(t => t.name === route.name);
                if (!tabConfig) return null;

                const isFocused = state.index === index;
                const isCenter = tabConfig.isCenter;

                return (
                    <Pressable
                        key={route.key}
                        onPress={() => handlePress(index, route.name, !!isCenter)}
                        style={styles.tabButton}
                    >
                        {isCenter ? (
                            <View style={styles.centerButtonContainer}>
                                <LinearGradient
                                    colors={[Colors.primary[500], Colors.primary[600]]}
                                    style={styles.centerButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Ionicons name="add" size={32} color="#FFFFFF" />
                                </LinearGradient>
                            </View>
                        ) : (
                            <View style={styles.tabContent}>
                                <Ionicons
                                    name={isFocused ? tabConfig.icon as any : `${tabConfig.icon}-outline` as any}
                                    size={24}
                                    color={isFocused ? '#FFFFFF' : Colors.tabInactive}
                                />
                                {tabConfig.label && (
                                    <Animated.Text
                                        style={[
                                            styles.label,
                                            { color: isFocused ? '#FFFFFF' : Colors.tabInactive }
                                        ]}
                                    >
                                        {tabConfig.label}
                                    </Animated.Text>
                                )}
                            </View>
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.background.primary,
        borderTopColor: Colors.border.subtle,
        borderTopWidth: 1,
        paddingTop: 8,
        paddingBottom: 28,
        height: 88,
        position: 'relative',
    },
    blobContainer: {
        position: 'absolute',
        top: 6,
        left: 0,
        height: BLOB_HEIGHT,
        width: BLOB_WIDTH,
        zIndex: 0,
    },
    blob: {
        width: BLOB_WIDTH,
        height: BLOB_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
    },
    blobGradient: {
        flex: 1,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: BLOB_HEIGHT,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
    },
    centerButtonContainer: {
        position: 'absolute',
        top: -28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
